import { getProviderKey, noStore, reserveDemoSpend } from "@/lib/demo-guards";
import { storyboardFallbackFromPrompt } from "@/lib/demo-samples";
import { requireSafeCreativeInput } from "@/lib/demo-safety";

export const runtime = "nodejs";

export const maxDuration = 300;

const STORYBOARD_FAL_MODEL = "openai/gpt-image-2.5/sunburst/text-to-image";

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
    estimatedUsd: 0.1,
    perClientDailyLimit: 1,
    globalDailyLimit: 8,
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
    const result = await fal.subscribe(STORYBOARD_FAL_MODEL, {
      input: {
        prompt: storyboardImagePrompt(safe.value),
        num_images: 1,
        image_size: "landscape_16_9",
        quality: "medium",
        output_format: "jpeg",
      },
      logs: false,
    });

    const data = result.data as { images?: { url?: string }[] };
    const imageUrl = data.images?.[0]?.url;
    if (!imageUrl) throw new Error("empty storyboard image");
    return noStore({
      ok: true,
      sample: false,
      status: "live",
      panels,
      imageUrl,
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
