import { NextResponse } from "next/server";
import { getDemoCache, getProviderKey, reserveDemoSpend, setDemoCache } from "@/lib/demo-guards";
import { storyboardFallbackFromPrompt, type StoryboardPanel } from "@/lib/demo-samples";
import { requireSafeCreativeInput } from "@/lib/demo-safety";

export const runtime = "nodejs";

const STORYBOARD_SYSTEM = `You are a senior AI producer making a safe public portfolio demo.
Return only JSON: {"panels":[{"id":"01","shot":"...","camera":"...","action":"...","caption":"...","palette":"..."}]}.
Make exactly six panels. Keep each field under 14 words. No adult, violent, medical, political, or private material.`;

type StoryboardPayload = {
  panels: StoryboardPanel[];
};

function parseStoryboard(text: string): StoryboardPanel[] | null {
  try {
    const parsed = JSON.parse(text) as Partial<StoryboardPayload>;
    if (!Array.isArray(parsed.panels) || parsed.panels.length !== 6) return null;
    return parsed.panels.map((panel, index) => ({
      id: String(panel.id || String(index + 1).padStart(2, "0")).slice(0, 3),
      shot: String(panel.shot || "shot").slice(0, 80),
      camera: String(panel.camera || "camera").slice(0, 80),
      action: String(panel.action || "action").slice(0, 110),
      caption: String(panel.caption || "caption").slice(0, 110),
      palette: String(panel.palette || "warm editorial").slice(0, 90),
    }));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { prompt?: unknown } | null;
  const safe = requireSafeCreativeInput(body?.prompt, 520);
  if (!safe.ok) {
    return NextResponse.json({ ok: false, error: safe.reason }, { status: 400 });
  }

  const cached = await getDemoCache<StoryboardPanel[]>("storyboard", safe.value);
  if (cached) {
    return NextResponse.json({
      ok: true,
      sample: false,
      status: "cached",
      panels: cached,
      capUsd: 1,
    });
  }

  const apiKey = getProviderKey("HAMMER_OPENROUTER_API_KEY", "OPENROUTER_API_KEY");
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      sample: true,
      status: "sample: provider key unavailable",
      panels: storyboardFallbackFromPrompt(safe.value),
      capUsd: 1,
    });
  }

  const reservation = await reserveDemoSpend(request, {
    demo: "storyboard",
    estimatedUsd: 0.01,
    perClientDailyLimit: 6,
    globalDailyLimit: 60,
  });
  if (!reservation.ok) {
    return NextResponse.json({
      ok: true,
      sample: true,
      status: `sample: ${reservation.reason}`,
      panels: storyboardFallbackFromPrompt(safe.value),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "http-referer": "https://hammer.ad",
        "x-title": "Hammer interactive storyboard demo",
      },
      body: JSON.stringify({
        model: process.env.HAMMER_STORYBOARD_MODEL ?? "deepseek/deepseek-v4-flash",
        messages: [
          { role: "system", content: STORYBOARD_SYSTEM },
          { role: "user", content: `Brief: ${safe.value}` },
        ],
        max_tokens: 900,
        temperature: 0.72,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) throw new Error("openrouter request failed");
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    const panels = text ? parseStoryboard(text) : null;
    if (!panels) throw new Error("invalid storyboard response");
    await setDemoCache("storyboard", safe.value, panels);
    return NextResponse.json({
      ok: true,
      sample: false,
      status: "live",
      panels,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      sample: true,
      status: "sample: provider failed safely",
      panels: storyboardFallbackFromPrompt(safe.value),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    });
  }
}
