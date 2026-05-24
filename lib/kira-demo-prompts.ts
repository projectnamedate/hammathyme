import "server-only";

const KIRA_PROMPT_CORE = [
  "kira_agi_v1 kira_agi_v1 kira_agi_v1",
  "copper-orange hair with darker brown roots in a messy updo with face-framing strands",
  "light olive skin with prominent face-only freckles clearly visible across her nose and upper cheeks",
  "clear mostly unfreckled skin below her face",
  "round black wireframe glasses",
  "wearing a black oversized blazer over a charcoal crewneck",
  "medium shot face and shoulders",
  "one arm extended toward camera",
  "selfie perspective",
  "hands cropped out of frame except the selfie arm cropped at forearm",
  "looking directly at the camera with a dry intelligent expression",
] as const;

const KIRA_PROMPT_FINISH = [
  "soft neutral daylight from a nearby window on her face preserving light olive skin",
  "no colored spill across her skin",
  "deep depth of field",
  "everything in focus",
  "sharp background",
  "50mm lens",
  "natural proportions",
  "phone front camera photo",
] as const;

const KIRA_CONSISTENCY_PROMPTS = [
  {
    id: "desk-signal",
    scene: "at a daylight trading desk with cool monitors in the background only",
  },
  {
    id: "brooklyn-glass",
    scene: "beside a brooklyn window wall with city glass behind her",
  },
  {
    id: "voice-anchor",
    scene: "against a clean cream wall with a small stack of notes behind her",
  },
  {
    id: "studio-card",
    scene: "inside a studio apartment window corner with plants and cool monitors behind her",
  },
  {
    id: "rain-street",
    scene: "near a rain-dark street window with neon signs blurred in the distant background only",
  },
  {
    id: "diner-light",
    scene: "inside a quiet morning diner booth with chrome trim behind her",
  },
  {
    id: "rooftop-close",
    scene: "on a covered rooftop with an overcast skyline behind her",
  },
  {
    id: "archive-room",
    scene: "inside an archive room with labeled boxes and a laptop behind her",
  },
  {
    id: "gallery-floor",
    scene: "at a gallery corridor with cream walls and quiet wall text behind her",
  },
  {
    id: "phone-nook",
    scene: "inside a co-working phone nook with a closed laptop behind her",
  },
  {
    id: "train-shelter",
    scene: "at a train platform shelter in soft overcast daylight",
  },
  {
    id: "product-table",
    scene: "beside a product table with a mock launch poster behind her",
  },
  {
    id: "elevator-lobby",
    scene: "in an elevator lobby with brushed metal walls and daylight from the doorway",
  },
  {
    id: "hotel-desk",
    scene: "by a hotel writing desk with a notebook and coffee cup behind her",
  },
  {
    id: "conference-hall",
    scene: "at a crypto conference hallway with muted signage behind her",
  },
  {
    id: "server-door",
    scene: "inside a server room doorway with blue rack lights in the background only",
  },
  {
    id: "record-aisle",
    scene: "in a record-store aisle with soft window light and album spines behind her",
  },
  {
    id: "chess-cafe",
    scene: "beside a chess table in a quiet cafe window",
  },
  {
    id: "bookstore-corner",
    scene: "in a bookstore corner with paperbacks behind her",
  },
  {
    id: "taxi-window",
    scene: "in a taxi back seat with overcast daylight through the side window",
  },
] as const;

export function getKiraConsistencyPrompt(id: string): string {
  const preset = KIRA_CONSISTENCY_PROMPTS.find((item) => item.id === id) ?? KIRA_CONSISTENCY_PROMPTS[0];
  return [...KIRA_PROMPT_CORE, preset.scene, ...KIRA_PROMPT_FINISH].join(", ");
}

