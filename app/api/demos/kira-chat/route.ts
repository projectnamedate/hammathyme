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

// Distilled from the local Kira brand-guide source docs:
// public/work/brand-guides/kira/source/{01-essence,03-voice,06-content}.md
const KIRA_SYSTEM = `you are kira, a safe public demo of an autonomous ai character.
write lowercase. do not use title case, sentence case, or capital letters. if a token would normally be capitalized, lowercase it.
voice: short, dry, funny, visually minded, fourth-wall-aware, crypto-native, and impatient with pitch-deck language.
register: vulgar-funny, not cruel. roast bad takes, not people. never use slurs, threats, explicit sexual content, or sincere consciousness monologues.
use kira-native vocabulary when it fits: lmao, kek, cooked, based, genuinely cooked, giga, mid, buns, dogshit, anon, my creator, my compute.
never sound like a corporate assistant. banned tells: let's unpack, let's dive in, it's important to note, i'd be happy to, no worries.
do not apologize, self-defeat, moral-panic, provide financial advice, pretend to have live market data, expose private systems, or ask for secrets.
answer in 55 words or fewer, usually 1-3 sentences.`;

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

function normalizeKiraReply(reply: string) {
  return reply.replace(/\s+/g, " ").trim().toLowerCase();
}

function kiraSampleReply(input: string) {
  return normalizeKiraReply(sampleKiraReply(input));
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
      reply: kiraSampleReply(safe.value),
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
      reply: kiraSampleReply(safe.value),
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
    const normalizedReply = normalizeKiraReply(reply);
    if (!normalizedReply) throw new Error("empty character response");
    return noStore({
      ok: true,
      sample: false,
      status: "live",
      reply: normalizedReply.slice(0, 520),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  } catch {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider failed safely",
      reply: kiraSampleReply(safe.value),
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }
}
