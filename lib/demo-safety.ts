const UNSAFE_TERMS = [
  "adult",
  "bikini",
  "blood",
  "bloody",
  "cleavage",
  "erotic",
  "fetish",
  "gore",
  "lingerie",
  "minor",
  "naked",
  "nude",
  "nsfw",
  "porn",
  "seductive",
  "sex",
  "sexy",
  "sheer",
  "shower",
  "swimsuit",
  "thong",
  "topless",
  "underage",
  "violence",
  "weapon",
];

const UNSAFE_RE = new RegExp(`\\b(${UNSAFE_TERMS.join("|")})\\b`, "i");

export function normalizeCreativeInput(value: unknown, maxLength = 700): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function hasUnsafeCreativeText(value: string): boolean {
  return UNSAFE_RE.test(value);
}

export function requireSafeCreativeInput(value: unknown, maxLength = 700): {
  ok: true;
  value: string;
} | {
  ok: false;
  reason: string;
} {
  const normalized = normalizeCreativeInput(value, maxLength);
  if (normalized.length < 4) return { ok: false, reason: "add a little more detail" };
  if (hasUnsafeCreativeText(normalized)) return { ok: false, reason: "try a safe, public demo prompt" };
  return { ok: true, value: normalized };
}

export function clampChatHistory(
  messages: unknown,
): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-12)
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const record = message as Record<string, unknown>;
      if (record.role !== "user" && record.role !== "assistant") return null;
      const content = normalizeCreativeInput(record.content, 500);
      if (!content || hasUnsafeCreativeText(content)) return null;
      return { role: record.role, content };
    })
    .filter((message): message is { role: "user" | "assistant"; content: string } => Boolean(message));
}
