import { ASSET_BASE } from "./tuning";

// Web Audio: the music and the sushi-bar ambience loop from files; every sound effect is synthesised.
export type Sfx =
  | "shot" | "hit" | "kill" | "windup" | "pinch" | "shieldHit" | "shieldBreak" | "fishHit" | "reload" | "empty"
  | "throw" | "boom" | "slam" | "telegraph" | "pickup" | "wave" | "eaten" | "splash";

export type Audio = {
  start: () => Promise<void>;
  play: (name: Sfx, gain?: number) => void;
  setMuted: (muted: boolean) => void;
  muted: () => boolean;
  suspend: () => void;
  resume: () => void;
  dispose: () => void;
};

export function createAudio(): Audio {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let sfx: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let isMuted = false;
  const loops: AudioBufferSourceNode[] = [];

  // loopEnd is the musical length: AAC pads the tail, and looping the padding would leave a gap at the seam.
  const loop = async (file: string, gain: number, loopEnd: number) => {
    if (!ctx || !master) return;
    try {
      const res = await fetch(`${ASSET_BASE}/audio/${file}`);
      if (!res.ok) return;
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      g.gain.value = gain;
      src.buffer = buffer;
      src.loop = true;
      src.loopEnd = Math.min(loopEnd, buffer.duration);
      src.connect(g).connect(master);
      src.start();
      loops.push(src);
    } catch {
      // A missing or undecodable loop leaves the game silent but playable.
    }
  };

  // Building blocks: an enveloped oscillator sweep and an enveloped, filtered noise burst.
  const tone = (type: OscillatorType, f0: number, f1: number, dur: number, gain: number, at = 0) => {
    if (!ctx || !sfx) return;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(sfx);
    o.start(t);
    o.stop(t + dur + 0.02);
  };
  const hiss = (filter: BiquadFilterType, f0: number, f1: number, dur: number, gain: number, at = 0, q = 1) => {
    if (!ctx || !sfx || !noise) return;
    const t = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(sfx);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  };

  const SOUNDS: Record<Sfx, (k: number) => void> = {
    shot: (k) => {
      const p = 0.92 + Math.random() * 0.16;
      tone("triangle", 520 * p, 140 * p, 0.09, 0.22 * k);
      hiss("bandpass", 2600, 900, 0.06, 0.18 * k, 0, 1.4);
    },
    hit: (k) => tone("sine", 1900, 1500, 0.035, 0.12 * k),
    kill: (k) => {
      hiss("highpass", 1400, 700, 0.12, 0.35 * k);
      tone("square", 1250, 900, 0.03, 0.08 * k);
      tone("square", 800, 520, 0.04, 0.07 * k, 0.05);
    },
    windup: (k) => {
      tone("sine", 900, 2400, 0.12, 0.07 * k);
      tone("sine", 1200, 2800, 0.1, 0.05 * k, 0.12);
    },
    pinch: (k) => {
      hiss("bandpass", 2200, 1800, 0.03, 0.35 * k, 0, 3);
      hiss("bandpass", 1700, 1500, 0.03, 0.3 * k, 0.035, 3);
    },
    shieldHit: (k) => hiss("bandpass", 3600, 2400, 0.09, 0.32 * k, 0, 0.8),
    shieldBreak: (k) => {
      hiss("bandpass", 3200, 1200, 0.32, 0.4 * k, 0, 0.7);
      tone("sine", 110, 45, 0.35, 0.35 * k);
    },
    fishHit: (k) => {
      hiss("lowpass", 900, 260, 0.16, 0.35 * k);
      tone("sine", 190, 85, 0.18, 0.25 * k);
    },
    reload: (k) => {
      hiss("bandpass", 320, 1100, 0.32, 0.22 * k, 0, 2);
      tone("square", 1600, 1400, 0.025, 0.06 * k, 0.36);
    },
    empty: (k) => tone("square", 900, 880, 0.02, 0.05 * k),
    throw: (k) => hiss("bandpass", 500, 2200, 0.28, 0.16 * k, 0, 1.2),
    boom: (k) => {
      hiss("lowpass", 1800, 120, 0.7, 0.6 * k);
      tone("sine", 95, 38, 0.6, 0.55 * k);
    },
    slam: (k) => {
      hiss("lowpass", 900, 80, 0.9, 0.7 * k);
      tone("sine", 70, 28, 0.9, 0.75 * k);
    },
    telegraph: (k) => tone("sawtooth", 55, 75, 0.9, 0.08 * k),
    pickup: (k) => {
      tone("sine", 880, 880, 0.12, 0.12 * k);
      tone("sine", 1320, 1320, 0.2, 0.1 * k, 0.09);
    },
    wave: (k) => {
      tone("triangle", 392, 392, 0.16, 0.12 * k);
      tone("triangle", 587, 587, 0.3, 0.12 * k, 0.15);
    },
    eaten: (k) => {
      hiss("bandpass", 280, 1300, 0.55, 0.4 * k, 0, 3);
      tone("sine", 210, 70, 0.3, 0.4 * k, 0.55);
    },
    splash: (k) => hiss("lowpass", 1400, 300, 0.25, 0.25 * k),
  };

  return {
    start: async () => {
      if (ctx) return;
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = isMuted ? 0 : 0.9;
      // A soft limiter so a full wave of explosions can't clip.
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -10;
      comp.ratio.value = 6;
      master.connect(comp).connect(ctx.destination);
      sfx = ctx.createGain();
      sfx.gain.value = 0.85;
      sfx.connect(master);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      // The music loop is 24 bars at 122 BPM; the ambience is a 30 s seamless loop.
      await Promise.all([loop("music.m4a", 0.55, (24 * 4 * 60) / 122), loop("ambience.m4a", 0.35, 30)]);
    },
    play: (name, gain = 1) => {
      if (!ctx || ctx.state !== "running") return;
      SOUNDS[name](gain);
    },
    setMuted: (m) => {
      isMuted = m;
      if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05);
    },
    muted: () => isMuted,
    suspend: () => void ctx?.suspend(),
    resume: () => void ctx?.resume(),
    dispose: () => {
      loops.forEach((l) => {
        try {
          l.stop();
        } catch {}
      });
      void ctx?.close();
      ctx = null;
    },
  };
}
