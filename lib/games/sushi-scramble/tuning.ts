// Every number the game plays by. World units: the hero nigiri is about 1 unit tall.

export const ASSET_BASE = "/work/interactive-playable/sushi-scramble";

export const WORLD = {
  beltRadius: 16, // centre line of the belt
  beltWidth: 3,
  beltSpeed: 1.2, // units per second along the belt, clockwise seen from above
  slatLength: 0.5,
  rimHeight: 0.18,
  counterTop: 0.32, // the customers' counter outside the belt
  counterOuter: 21.5,
  islandTop: 1.35, // the chef's island inside the belt
  islandInner: 10,
  lanternRadius: 19.4,
  lanternHeight: 6.4,
  lanternCount: 8,
  norenRadius: 27,
  dinerRadius: 36,
  plateCount: 12,
};

export const PLAYER = {
  radius: 0.42,
  height: 1.0,
  walkSpeed: 3.4,
  sprintSpeed: 5.6,
  accel: 22,
  airAccel: 6,
  jumpSpeed: 5.2,
  gravity: 16,
  stepHeight: 0.36,
  shieldMax: 100,
  shieldRegenDelay: 3,
  shieldRegenRate: 40,
  healthMax: 100,
};

export const CAMERA = {
  fov: 58,
  aimFov: 44,
  shoulder: { x: 0.62, y: 1.05, z: 2.7 }, // right, up, back from the hero's pivot
  aimShoulder: { x: 0.78, y: 0.95, z: 1.8 },
  pitchMin: -0.55,
  pitchMax: 1.0,
  lookSensitivity: 0.0022,
  follow: 14, // spring rate toward the target position
};

export const LOOK = {
  // A dark room lit by its lanterns: low ambient, a warm raking key, a cool rim, glowing paper.
  exposure: 0.82,
  keyColor: 0xffbf80,
  keyIntensity: 2.6,
  rimColor: 0x6178ff,
  rimIntensity: 1.2,
  lanternColor: 0xff9e4f,
  lanternIntensity: 3.2,
  lanternGlow: 3.4,
  envIntensity: 0.22,
  bloom: { strength: 0.38, radius: 0.42, threshold: 1.3 },
  // BokehShader's widest tap sits at 0.4 x maxblur; far set dressing is pre-blurred in its textures instead.
  dof: { aperture: 0.003, maxBlur: 0.02 },
  vignette: 0.5,
};

export type Tier = "high" | "medium" | "low";

export const TIERS: Record<Tier, { dpr: number; shadows: number; gtao: boolean; dof: boolean; lanternLights: number }> = {
  high: { dpr: 1.5, shadows: 2048, gtao: true, dof: true, lanternLights: 8 },
  medium: { dpr: 1.25, shadows: 1024, gtao: false, dof: true, lanternLights: 4 },
  low: { dpr: 1, shadows: 0, gtao: false, dof: false, lanternLights: 2 },
};
