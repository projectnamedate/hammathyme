import { demosEnabled, getProviderKey, noStore } from "@/lib/demo-guards";
import { storyboardFallbackFromPrompt } from "@/lib/demo-samples";
import { requireSafeCreativeInput } from "@/lib/demo-safety";

export const runtime = "nodejs";

export const maxDuration = 300;

const EVOLINK = "https://api.evolink.ai/v1";
const STORYBOARD_MODEL = "gpt-image-2.5-sunburst";
const POLL_MS = 4000;
const GIVE_UP_MS = 270_000;

function storyboardImagePrompt(brief: string) {
  return [
    "One storyboard sheet: six panels in a 3 by 2 grid on a single sheet of warm off-white drawing paper, thin pencil-ruled panel borders, small handwritten panel numbers 1 to 6 and no other text.",
    "Medium: a story artist's colour pencil drawing. Colour pencil line and hatching on warm off-white paper, visible strokes, paper grain showing through, loose and handmade, the same medium in every panel.",
    "Palette: graphite and deep maroon line, muted teal and warm sepia washes of hatching, soft cinnamon accents, mostly bare paper.",
    "No 3D render, no CG, no painted illustration finish, no digital painting, no photorealism.",
    "Every panel shows a distinct shot of the brief: 1 establishing frame for the world or product context; 2 insert of one important object, hand, screen or texture; 3 process shot of the work in motion; 4 a person or subject in a clear action beat; 5 the payoff where the idea resolves; 6 the delivery or final result.",
    "Storyboard the brief as its own product, campaign, or scene concept. Keep it safe for work: no adult content, violence, gore, weapons, medical claims, politics, logos, or private data.",
    `Brief: ${brief}`,
  ].join(" ");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { prompt?: unknown } | null;
  const safe = requireSafeCreativeInput(body?.prompt, 520);
  if (!safe.ok) {
    return noStore({ ok: false, error: safe.reason }, { status: 400 });
  }

  const panels = storyboardFallbackFromPrompt(safe.value);
  const apiKey = getProviderKey("EVOLINK_API_KEY");
  if (!apiKey || !demosEnabled()) {
    return noStore({ ok: true, sample: true, status: "sample: live boards are off", panels });
  }

  try {
    const imageUrl = await drawStoryboard(apiKey, storyboardImagePrompt(safe.value));
    return noStore({ ok: true, sample: false, status: "live", panels, imageUrl });
  } catch {
    return noStore({ ok: true, sample: true, status: "sample: provider failed safely", panels });
  }
}

async function drawStoryboard(apiKey: string, prompt: string): Promise<string> {
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const submit = await fetch(`${EVOLINK}/images/generations`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: STORYBOARD_MODEL, prompt, size: "16:9", quality: "medium" }),
  });
  let task = (await submit.json()) as { id?: string; status?: string };
  if (!submit.ok || !task.id) throw new Error("storyboard submit failed");

  const started = Date.now();
  while (Date.now() - started < GIVE_UP_MS) {
    const status = String(task.status ?? "").toLowerCase();
    if (["failed", "error", "cancelled"].includes(status)) throw new Error("storyboard failed");
    if (["completed", "succeeded", "success"].includes(status)) {
      const url = JSON.stringify(task).match(/https:[^"]+?\.(?:png|jpe?g|webp)[^"]*/i)?.[0];
      if (!url) throw new Error("empty storyboard image");
      return url;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    const poll = await fetch(`${EVOLINK}/tasks/${task.id}`, { headers });
    if (poll.ok) task = await poll.json();
  }
  throw new Error("storyboard timed out");
}
