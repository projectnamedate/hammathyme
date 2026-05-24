import { NextResponse } from "next/server";
import {
  applyDemoVisitorCookie,
  getProviderKey,
  reserveDemoSpend,
  type SpendReservation,
} from "@/lib/demo-guards";
import { sampleKiraReply } from "@/lib/demo-samples";
import { clampChatHistory, requireSafeCreativeInput } from "@/lib/demo-safety";

export const runtime = "nodejs";

const KIRA_SYSTEM = `You are Kira, a safe public demo of an autonomous AI character.
Voice: dry, precise, visually minded, impatient with hype, never explicit.
Do not provide financial advice, pretend to have live market data, expose private systems, or ask for secrets.
Answer in 55 words or fewer.`;

const DEFAULT_KIRA_MODEL = "deepseek/deepseek-v4-flash";
const DEFAULT_CHAT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const ALLOWED_KIRA_MODELS = new Set([DEFAULT_KIRA_MODEL]);

function kiraModel() {
  const configured =
    process.env.HAMMER_KIRA_WEB_CHAT_MODEL ??
    process.env.KIRA_WEB_CHAT_MODEL ??
    process.env.HAMMER_KIRA_CHAT_MODEL ??
    DEFAULT_KIRA_MODEL;
  return ALLOWED_KIRA_MODELS.has(configured) ? configured : DEFAULT_KIRA_MODEL;
}

function chatEndpoint() {
  const configured = process.env.HAMMER_KIRA_WEB_CHAT_BASE_URL?.trim();
  if (!configured) return DEFAULT_CHAT_ENDPOINT;

  try {
    const url = new URL(configured);
    if (url.origin === "https://openrouter.ai" && url.pathname === "/api/v1/chat/completions") {
      return DEFAULT_CHAT_ENDPOINT;
    }
  } catch {
    return DEFAULT_CHAT_ENDPOINT;
  }

  return DEFAULT_CHAT_ENDPOINT;
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
  const body = (await request.json().catch(() => null)) as {
    message?: unknown;
    messages?: unknown;
  } | null;
  const safe = requireSafeCreativeInput(body?.message, 420);
  if (!safe.ok) {
    return noStore({ ok: false, error: safe.reason }, { status: 400 });
  }

  const apiKey = getProviderKey("HAMMER_KIRA_WEB_CHAT_API_KEY", "KIRA_WEB_CHAT_API_KEY", "HAMMER_OPENROUTER_API_KEY", "OPENROUTER_API_KEY");
  if (!apiKey) {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider key unavailable",
      reply: sampleKiraReply(safe.value),
      capUsd: 1,
    });
  }

  const reservation = await reserveDemoSpend(request, {
    demo: "kira-chat",
    estimatedUsd: 0.004,
    perClientDailyLimit: 4,
    globalDailyLimit: 80,
  });
  if (!reservation.ok) {
    return noStore({
      ok: true,
      sample: true,
      status: `sample: ${reservation.reason}`,
      reply: sampleKiraReply(safe.value),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }

  const history = clampChatHistory(body?.messages);

  try {
    const response = await fetch(chatEndpoint(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "http-referer": "https://hammer.ad",
        "x-title": "Hammer Kira character demo",
      },
      body: JSON.stringify({
        model: kiraModel(),
        messages: [
          { role: "system", content: KIRA_SYSTEM },
          ...history,
          { role: "user", content: safe.value },
        ],
        max_tokens: 180,
        temperature: 0.78,
        reasoning: { exclude: true },
      }),
    });

    if (!response.ok) throw new Error("openrouter request failed");
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.replace(/\s+/g, " ").trim();
    if (!reply) throw new Error("empty character response");
    return noStore({
      ok: true,
      sample: false,
      status: "live",
      reply: reply.slice(0, 520),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  } catch {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider failed safely",
      reply: sampleKiraReply(safe.value),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }
}
