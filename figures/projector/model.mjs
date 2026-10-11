// The projector's truth. Every number the figure shows comes from here.
//
// Sources, read 2026-10-10:
//   SMPTE ST 139-2003, table 1: 35 mm film 1.377 in wide, KS perforations 0.110 × 0.078 in,
//     0.1870 in long pitch, 0.079 in from the edge, rows 1.109 in apart.
//   SMPTE ST 195-2000, table 1: classic (style C, 1.37:1) projectable area 0.825 × 0.602 in.
//   SMPTE ST 242-2003: 16-tooth intermittent sprocket, root diameter 0.950 in; feed and
//     holdback sprockets with 16 or 24 teeth (24-tooth root 1.413 in).
//   US 6,183,087: a four-slot star wheel is engaged for 90° of each 360° turn of its driver,
//     so the pull-down takes a quarter of the frame (about 10.5 ms at 24 fps); a two-bladed
//     shutter gives two blanking periods per frame, raising the apparent rate to 48 a second.
//   ANSI/SMPTE 55 universal leader: a countdown from 8 to 2 in seconds, a one-frame 2 with
//     the sync pop, then 47 frames of black, 192 frames (12 ft) in all.

export const IN = 25.4;

export const FILM = {
  width: 1.377 * IN,
  pitch: 0.187 * IN,
  perfW: 0.11 * IN,
  perfH: 0.078 * IN,
  edge: 0.079 * IN,
  rows: 1.109 * IN,
  perfsPerFrame: 4,
};
export const FRAME_LENGTH = FILM.pitch * FILM.perfsPerFrame;
export const APERTURE = { w: 0.825 * IN, h: 0.602 * IN };
export const INTERMITTENT = { teeth: 16, root: 0.95 * IN };
export const FEED = { teeth: 24, root: 1.413 * IN };
export const SLOTS = 4;
export const PULLDOWN = 0.25;
export const BLADE = 0.25;
export const SOUND_FPS = 24;
export const SILENT_FPS = [16, 18];
export const LEADER = { from: 8, to: 2, frames: 192, pop: 144 };

const TAU = Math.PI * 2;
const fract = (x) => x - Math.floor(x);

// Driver angle α runs from −45° to +45° while its pin is in a slot; for a four-slot
// external Geneva wheel the centre distance is a·√2, so tan β = sin α / (√2 − cos α).
export function crossOf(phase) {
  if (phase >= PULLDOWN) return 1;
  const alpha = (phase / PULLDOWN - 0.5) * (TAU / SLOTS);
  const beta = Math.atan2(Math.sin(alpha), Math.SQRT2 - Math.cos(alpha));
  return beta / (TAU / SLOTS) + 0.5;
}

export function driverAngle(frames) {
  return fract(frames) * 360;
}

// The cross turns a quarter per frame: the whole turns before this frame plus the share of
// this pull-down. The film at the gate moves with it, one frame per quarter turn.
export function intermittentOf(frames) {
  const whole = Math.floor(frames);
  return whole + crossOf(frames - whole);
}

// This machine's front shutter: the beam's centre passes 100 from the shutter axis, and the
// beam is 35.5 wide and 33 tall there (the lens's 28 exit pupil spreading toward a 176 × 128
// picture 276 away). A blade edge has fully crossed it once it clears the beam's corners
// nearest the axis, 17.75 across and 83.5 out.
// Blade 0 is centred on the pull-down; the others are spaced evenly round the disc and are
// as wide. A blade edge takes CROSSING of a turn to sweep across the beam, so each blade is
// that much wider than the pull-down and the film never moves in the light.
export const SHUTTER = { beamOffset: 100, beamHalfY: 17.75, beamHalfZ: 16.5 };
export const CROSSING = (2 * Math.atan(SHUTTER.beamHalfY / (SHUTTER.beamOffset - SHUTTER.beamHalfZ))) / (2 * Math.PI);
export function shutterOpen(phase, blades) {
  let covered = 0;
  for (let k = 0; k < blades; k++) {
    const centre = PULLDOWN / 2 + k / blades;
    const d = Math.abs(fract(phase - centre + 0.5) - 0.5);
    const edge = BLADE / 2 + CROSSING / 2;
    covered += 1 - smoothstep(edge - CROSSING / 2, edge + CROSSING / 2, d);
  }
  return Math.max(0, 1 - covered);
}

export function lightShare(blades) {
  return Math.max(0, 1 - blades * (BLADE + CROSSING));
}

export function flickerHz(fps, blades) {
  return fps * blades;
}

// Mean light the screen gets over one display frame, sampled across the shutter's turn.
export function screenLight(frames0, frames1, blades, samples = 24) {
  let sum = 0;
  for (let i = 0; i < samples; i++) {
    const f = frames0 + ((i + 0.5) / samples) * (frames1 - frames0);
    sum += shutterOpen(fract(f), blades);
  }
  return sum / samples;
}

export function feetPerMinute(fps) {
  return (fps * FRAME_LENGTH * 60) / (12 * IN);
}

export function leaderAt(frame) {
  const f = ((Math.floor(frame) % LEADER.frames) + LEADER.frames) % LEADER.frames;
  if (f < LEADER.pop) return { number: LEADER.from - Math.floor(f / 24), sweep: (f % 24) / 24, pop: false, frame: f };
  if (f === LEADER.pop) return { number: LEADER.to, sweep: 0, pop: true, frame: f };
  return { number: 0, sweep: 0, pop: false, frame: f };
}

export function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// The middle of the first gap between blades after the pull-down: the instant a still frame
// is most open to the light.
export function openPhase(blades) {
  return PULLDOWN / 2 + 1 / (2 * blades);
}

// What the gate is doing at this instant of the frame, for the readout at hand speeds. Each
// blade's window is worded whole, so the words change only as often as the light does.
export function phaseOf(frames, blades) {
  const phase = fract(frames);
  const edge = BLADE / 2 + CROSSING / 2;
  for (let k = 0; k < blades; k++) {
    const d = Math.abs(fract(phase - (PULLDOWN / 2 + k / blades) + 0.5) - 0.5);
    if (d < edge) {
      const blade = blades === 1 ? "blade" : `blade ${k + 1}`;
      return k === 0 ? `pull-down, ${blade} over the beam` : `frame still, ${blade} over the beam`;
    }
  }
  return "frame still, light on screen";
}

export function readoutOf(fps, blades, frames = 0) {
  const light = `${Math.round(lightShare(blades) * 100)}% light`;
  const speed = Math.abs(fps);
  if (speed < 0.05) return `stopped · ${blades} blade${blades === 1 ? "" : "s"}`;
  const back = fps < 0 ? "backwards · " : "";
  // The rate shown is the one the flicker is worked out from, so the two always agree.
  const shown = speed >= 9.95 ? Math.round(speed) : Math.round(speed * 10) / 10;
  const f = speed >= 9.95 ? shown.toFixed(0) : shown.toFixed(1);
  if (speed <= 3.05) return `${back}${f} fps · ${phaseOf(frames, blades)}`;
  const hz = flickerHz(shown, blades);
  return `${back}${f} fps · ${speed >= 9.95 ? hz.toFixed(0) : hz.toFixed(1)} Hz · ${light}`;
}
