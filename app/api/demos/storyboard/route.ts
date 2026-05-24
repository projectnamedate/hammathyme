import { NextResponse } from "next/server";
import {
  applyDemoVisitorCookie,
  getProviderKey,
  reserveDemoSpend,
  type SpendReservation,
} from "@/lib/demo-guards";
import { storyboardFallbackFromPrompt } from "@/lib/demo-samples";
import { requireSafeCreativeInput } from "@/lib/demo-safety";

export const runtime = "nodejs";

const STORYBOARD_FAL_MODEL = "fal-ai/nano-banana-2";

function storyboardImagePrompt(brief: string) {
  return [
    "Create one polished 6-panel storyboard contact sheet for a public AI producer portfolio.",
    "Layout: clean 3 by 2 grid, cinematic thumbnails, no visible written captions, small unobtrusive panel numbers only.",
    "Style: warm cream paper, deep maroon ink, restrained vinaceous cinnamon accents, elegant editorial production-board language.",
    "Every panel should show a distinct shot: establishing frame, insert, process, subject/action, payoff, delivery.",
    "Do not depict Kira, a Kira-like woman, round black wireframe glasses, black blazer/turtleneck character styling, or crypto-character influencer imagery.",
    "Storyboard the user's brief as its own product, campaign, or scene concept with fresh anonymous subjects where people are needed.",
    "Keep it safe for work. No adult content, violence, gore, weapons, medical claims, politics, logos, or private data.",
    `Brief: ${brief}`,
  ].join(" ");
}

function noStore<T extends Record<string, unknown>>(payload: T, init?: ResponseInit, reservation?: SpendReservation) {
  const headers = new Headers(init?.headers);
  headers.set("cache-control", "no-store");
  if (reservation) applyDemoVisitorCookie(headers, reservation);
  return NextResponse.json(payload, {
    ...init,
    headers,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { prompt?: unknown } | null;
  const safe = requireSafeCreativeInput(body?.prompt, 520);
  if (!safe.ok) {
    return noStore({ ok: false, error: safe.reason }, { status: 400 });
  }

  const panels = storyboardFallbackFromPrompt(safe.value);
  const apiKey = getProviderKey("HAMMER_FAL_KEY", "FAL_KEY");
  if (!apiKey) {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider key unavailable",
      panels,
      capUsd: 1,
    });
  }

  const reservation = await reserveDemoSpend(request, {
    demo: "storyboard",
    estimatedUsd: 0.08,
    perClientDailyLimit: 1,
    globalDailyLimit: 10,
  });
  if (!reservation.ok) {
    return noStore({
      ok: true,
      sample: true,
      status: `sample: ${reservation.reason}`,
      panels,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }

  try {
    const { fal } = await import("@fal-ai/client");
    fal.config({ credentials: apiKey });
    const result = await fal.subscribe(process.env.HAMMER_STORYBOARD_FAL_MODEL ?? STORYBOARD_FAL_MODEL, {
      input: {
        prompt: storyboardImagePrompt(safe.value),
        num_images: 1,
        aspect_ratio: "16:9",
        output_format: "png",
        resolution: "1K",
        safety_tolerance: "2",
        limit_generations: true,
        enable_web_search: false,
      },
      logs: false,
    });

    const data = result.data as {
      images?: { url?: string }[];
      description?: string;
    };
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) throw new Error("empty storyboard image");
    return noStore({
      ok: true,
      sample: false,
      status: "live",
      panels,
      imageUrl,
      description: data.description?.slice(0, 500),
      requestId: result.requestId,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  } catch {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider failed safely",
      panels,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }
}
