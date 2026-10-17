// The wave director: endless waves of chopstick drones, the diner's hand every third wave.
export type WaveEvent =
  | { type: "announce"; wave: number; boss: boolean }
  | { type: "spawn"; count: number; speed: number }
  | { type: "boss" }
  | { type: "cleared"; wave: number };

export type Waves = {
  wave: () => number;
  start: () => WaveEvent[];
  jumpTo: (wave: number) => WaveEvent[];
  update: (dt: number, alive: number, bossActive: boolean) => WaveEvent[];
};

export const MAX_ALIVE = 12;

export function createWaves(): Waves {
  let wave = 0;
  let phase: "intermission" | "fight" = "intermission";
  let timer = 0;
  let toSpawn = 0;
  let spawnTimer = 0;
  let boss = false;
  let bossStarted = false;

  const next = (): WaveEvent[] => {
    wave += 1;
    phase = "intermission";
    timer = 0;
    boss = wave % 3 === 0;
    bossStarted = false;
    toSpawn = boss ? Math.ceil(wave / 2) : 2 + 2 * wave;
    return [{ type: "announce", wave, boss }];
  };

  return {
    wave: () => wave,
    start: () => {
      wave = 0;
      return next();
    },
    jumpTo: (n) => {
      wave = Math.max(0, n - 1);
      return next();
    },
    update: (dt, alive, bossActive) => {
      const events: WaveEvent[] = [];
      timer += dt;
      if (phase === "intermission") {
        if (timer > 2.6) {
          phase = "fight";
          timer = 0;
          spawnTimer = 0;
        }
        return events;
      }
      if (boss && !bossStarted && timer > 0.8) {
        bossStarted = true;
        events.push({ type: "boss" });
      }
      spawnTimer -= dt;
      if (toSpawn > 0 && spawnTimer <= 0 && alive < MAX_ALIVE) {
        const count = Math.min(2, toSpawn, MAX_ALIVE - alive);
        toSpawn -= count;
        spawnTimer = Math.max(1.2, 2.6 - wave * 0.12);
        events.push({ type: "spawn", count, speed: Math.min(1.6, 1 + wave * 0.06) });
      }
      if (toSpawn === 0 && alive === 0 && !bossActive && (!boss || bossStarted)) {
        events.push({ type: "cleared", wave });
        events.push(...next());
      }
      return events;
    },
  };
}
