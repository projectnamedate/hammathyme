import { NextResponse } from "next/server";
import {
  applyDemoVisitorCookie,
  getProviderKey,
  reserveDemoSpend,
  type SpendReservation,
} from "@/lib/demo-guards";
import { CONSISTENCY_SCENES } from "@/lib/demo-samples";

export const runtime = "nodejs";

function sceneForId(sceneId: unknown) {
  return CONSISTENCY_SCENES.find((scene) => scene.id === sceneId) ?? CONSISTENCY_SCENES[0];
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

function kiraGuardrailPrompt(scenePrompt: string) {
  return [
    scenePrompt,
    "Kira continuity guardrails: same adult woman identity, same face structure, round black wireframe glasses when visible, black blazer or black turtleneck, dry intelligent expression, editorial portrait lighting.",
    "Public demo constraints: safe for work, no sensual styling, no exposed skin, no minors, no weapons, no gore, no brand logos, no private UI, no text overlays.",
    "Portfolio finish: high-end AI producer contact-sheet quality, natural skin texture, restrained cinematic color, consistent character anchors.",
  ].join(". ");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { sceneId?: unknown } | null;
  const scene = sceneForId(body?.sceneId);

  const falKey = getProviderKey("HAMMER_FAL_KEY", "FAL_KEY");
  const loraUrl = getProviderKey("HAMMER_KIRA_LORA_URL", "KIRA_LORA_URL");
  if (!falKey || !loraUrl) {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider setup unavailable",
      scene,
      imageUrl: scene.image,
      capUsd: 1,
    });
  }

  const reservation = await reserveDemoSpend(request, {
    demo: "consistency",
    estimatedUsd: 0.06,
    perClientDailyLimit: 1,
    globalDailyLimit: 8,
  });
  if (!reservation.ok) {
    return noStore({
      ok: true,
      sample: true,
      status: `sample: ${reservation.reason}`,
      scene,
      imageUrl: scene.image,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }

  try {
    const { fal } = await import("@fal-ai/client");
    fal.config({ credentials: falKey });
    const result = await fal.subscribe("fal-ai/flux-2/lora", {
      input: {
        prompt: kiraGuardrailPrompt(scene.prompt),
        image_size: { width: 768, height: 960 },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        loras: [{ path: loraUrl, scale: 1.0 }],
      },
      logs: false,
    });

    const data = result.data as {
      images?: { url?: string; has_nsfw_concepts?: boolean }[];
      has_nsfw_concepts?: boolean[];
    };
    const image = data.images?.[0];
    const blocked = image?.has_nsfw_concepts || data.has_nsfw_concepts?.some(Boolean);
    if (!image?.url || blocked) throw new Error("unsafe or empty image");

    const payload = { imageUrl: image.url, requestId: result.requestId };
    return noStore({
      ok: true,
      sample: false,
      status: "live",
      scene,
      ...payload,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  } catch {
    return noStore({
      ok: true,
      sample: true,
      status: "sample: provider failed safely",
      scene,
      imageUrl: scene.image,
      capUsd: reservation.capUsd,
      spentUsd: reservation.spentUsd,
    }, undefined, reservation);
  }
}
