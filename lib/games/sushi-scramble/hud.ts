// The HUD: a deadpan Halo parody in DOM over the canvas. Written imperatively; nothing here re-renders React.
export type Tracked = { x: number; z: number; big?: boolean };
export type PlateTier = { name: string; color: string };

export const TIERS: [number, PlateTier][] = [
  [15000, { name: "black plate", color: "#141216" }],
  [8000, { name: "gold plate", color: "#d4a640" }],
  [4000, { name: "red plate", color: "#b8322b" }],
  [1500, { name: "blue plate", color: "#2f4c9a" }],
  [0, { name: "white plate", color: "#f3efe6" }],
];
export const tierFor = (score: number) => TIERS.find(([min]) => score >= min)![1];

const CSS = `
.rw-hud{position:absolute;inset:0;container-type:size;pointer-events:none;color:#f6efe3;font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:lowercase;user-select:none}
.rw-hud *{box-sizing:border-box}
.rw-top{position:absolute;top:18px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px}
.rw-shield{display:flex;gap:3px}
.rw-shield i{display:block;width:26px;height:9px;border:1px solid rgba(246,239,227,.75);background:rgba(246,239,227,.92);transition:background .12s}
.rw-shield i.off{background:transparent;border-color:rgba(246,239,227,.3)}
.rw-shield.low i:not(.off){background:#ff7a59;border-color:#ff7a59}
.rw-fish{width:200px;height:3px;background:rgba(246,239,227,.18)}
.rw-fish b{display:block;height:100%;background:#ff7a59;transition:width .15s}
.rw-labels{display:flex;justify-content:space-between;width:200px;opacity:.7;font-size:9px}
.rw-wave{position:absolute;top:18px;left:20px;font-size:10px;opacity:.85}
.rw-score{position:absolute;top:16px;right:20px;text-align:right}
.rw-score strong{display:block;font-family:var(--font-display);font-size:26px;letter-spacing:0;font-weight:700}
.rw-tier{display:inline-flex;align-items:center;gap:6px;opacity:.85;font-size:9px}
.rw-tier i{width:12px;height:12px;border-radius:50%;border:1px solid rgba(246,239,227,.6)}
.rw-reticle{position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px 0 0 -13px;border:1.5px solid #b6ef4c;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.25)}
.rw-reticle:after{content:"";position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px 0 0 -1.5px;background:#b6ef4c;border-radius:50%}
.rw-hit{position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;opacity:0;transition:opacity .12s}
.rw-hit:before,.rw-hit:after{content:"";position:absolute;left:50%;top:0;width:2px;height:100%;margin-left:-1px;background:#f6efe3;transform:rotate(45deg)}
.rw-hit:after{transform:rotate(-45deg)}
.rw-hit.kill:before,.rw-hit.kill:after{background:#ff7a59}
.rw-dmg{position:absolute;left:50%;top:50%;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;border:3px solid transparent;border-top-color:#ff7a59;opacity:0;transition:opacity .35s}
.rw-ammo{position:absolute;right:22px;bottom:20px;text-align:right}
.rw-ammo strong{font-family:var(--font-display);font-size:40px;letter-spacing:0;font-weight:700;line-height:1}
.rw-ammo span{opacity:.6;margin-left:4px}
.rw-ammo .rw-reload{color:#b6ef4c}
.rw-ginger{display:flex;gap:4px;justify-content:flex-end;margin-top:6px}
.rw-ginger i{width:14px;height:9px;border-radius:50%;background:#ffa8bd;transform:rotate(-20deg)}
.rw-ginger i.off{background:transparent;border:1px solid rgba(255,168,189,.4)}
.rw-tracker{position:absolute;left:18px;bottom:18px;width:120px;height:120px}
.rw-tracker-label{position:absolute;left:18px;bottom:142px;font-size:9px;opacity:.7}
.rw-banner{position:absolute;left:0;right:0;top:30%;text-align:center;opacity:0;transition:opacity .3s}
.rw-banner strong{display:block;font-family:var(--font-display);font-size:clamp(28px,4vw,52px);letter-spacing:0;font-weight:800;text-transform:lowercase}
.rw-banner span{opacity:.75}
.rw-boss{position:absolute;top:66px;left:50%;width:280px;margin-left:-140px;text-align:center;font-size:9px;display:none}
.rw-boss b{display:block;height:4px;margin-top:4px;background:rgba(246,239,227,.15)}
.rw-boss b i{display:block;height:100%;background:#d4a640}
.rw-soaked{position:absolute;top:84px;left:50%;transform:translateX(-50%);padding:3px 8px;background:#2a120a;border:1px solid #5a2a14;opacity:0;transition:opacity .2s}
.rw-flash{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(255,90,60,.55);opacity:0;transition:opacity .25s}
.rw-card{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(14,9,12,.62);pointer-events:auto}
.rw-card.on{display:flex}
.rw-card .in{max-width:440px;padding:28px;text-align:center}
.rw-card h3{font-family:var(--font-display);font-size:clamp(34px,5vw,64px);letter-spacing:-.01em;font-weight:800;line-height:.95;margin:0 0 14px;text-transform:lowercase}
.rw-card p{margin:6px 0;opacity:.85;line-height:1.7}
.rw-card dl{display:grid;grid-template-columns:auto auto;gap:4px 18px;justify-content:center;margin:16px 0;opacity:.8;text-align:left}
.rw-card dt{color:#b6ef4c}
.rw-card button{margin-top:16px;padding:12px 22px;border:1px solid #f6efe3;background:transparent;color:#f6efe3;font:inherit;letter-spacing:.2em;cursor:pointer}
.rw-card button:hover{border-color:#b6ef4c;color:#b6ef4c}
.rw-touch{position:absolute;right:16px;bottom:120px;display:none;flex-direction:column;gap:10px;pointer-events:auto}
.rw-touch.on{display:flex}
.rw-touch button{width:64px;height:64px;border-radius:50%;border:1px solid rgba(246,239,227,.6);background:rgba(14,9,12,.35);color:#f6efe3;font:inherit;font-size:9px;letter-spacing:.1em}
.rw-touch button[data-touch-button=fire]{width:78px;height:78px;border-color:#b6ef4c;color:#b6ef4c}
@container (max-width: 700px){
.rw-hud{font-size:9px}
.rw-top{top:8px}.rw-shield i{width:12px;height:6px}.rw-fish,.rw-labels{width:130px}
.rw-score{top:6px;right:8px}.rw-score strong{font-size:16px}.rw-wave{top:8px;left:8px}
.rw-ammo{right:8px;bottom:8px}.rw-ammo strong{font-size:22px}
.rw-tracker,.rw-tracker-label{display:none}
.rw-card .in{padding:12px}.rw-card h3{font-size:26px;margin-bottom:6px}.rw-card dl{display:none}.rw-card p{line-height:1.4}
.rw-touch{bottom:46px;right:8px;gap:6px}.rw-touch button{width:44px;height:44px}.rw-touch button[data-touch-button=fire]{width:54px;height:54px}
.rw-banner strong{font-size:22px}
}
`;

const CONTROLS = `<dl><dt>move</dt><dd>w a s d</dd><dt>aim / look</dt><dd>mouse, right button zooms</dd><dt>wasabi blaster</dt><dd>left button</dd><dt>ginger grenade</dt><dd>g</dd><dt>jump · sprint</dt><dd>space · shift</dd><dt>re-wasabi</dt><dd>r</dd><dt>pause · mute</dt><dd>esc · m</dd></dl>`;

export type Hud = {
  el: HTMLElement;
  touchUi: HTMLElement;
  shield: (frac: number) => void;
  fish: (frac: number) => void;
  ammo: (n: number, max: number, reloading: boolean) => void;
  ginger: (n: number) => void;
  score: (score: number, best: number) => void;
  wave: (n: number) => void;
  banner: (title: string, sub?: string, seconds?: number) => void;
  hit: (kill: boolean) => void;
  damageFrom: (angle: number) => void;
  flash: () => void;
  soaked: (on: boolean) => void;
  boss: (frac: number | null) => void;
  tracker: (items: Tracked[], range: number) => void;
  card: (which: "start" | "pause" | "over" | null, data?: { score: number; best: number; wave: number; cause: "eaten" | "dropped" }) => void;
  onButton: (fn: (action: "start" | "resume" | "again") => void) => void;
  touch: (on: boolean) => void;
  dispose: () => void;
};

export function createHud(parent: HTMLElement, reducedMotion: boolean): Hud {
  const style = document.createElement("style");
  style.textContent = CSS;
  const el = document.createElement("div");
  el.className = "rw-hud";
  el.innerHTML = `
    <div class="rw-wave">wave <b>1</b></div>
    <div class="rw-top"><div class="rw-shield">${"<i></i>".repeat(10)}</div><div class="rw-fish"><b style="width:100%"></b></div><div class="rw-labels"><span>rice</span><span>fish</span></div></div>
    <div class="rw-boss">the diner's hand<b><i style="width:100%"></i></b></div>
    <div class="rw-soaked">soaked: rice won't recharge</div>
    <div class="rw-score"><strong>0</strong><span class="rw-tier"><i></i><em>white plate</em></span><div class="rw-best" style="opacity:.55;font-size:9px;margin-top:3px"></div></div>
    <div class="rw-reticle"></div><div class="rw-hit"></div><div class="rw-dmg"></div>
    <div class="rw-banner"><strong></strong><span></span></div>
    <div class="rw-ammo"><strong>32</strong><span>/ 32</span><div class="rw-ginger"><i></i><i></i></div></div>
    <div class="rw-tracker-label">chopstick tracker</div><canvas class="rw-tracker" width="240" height="240"></canvas>
    <div class="rw-flash"></div>
    <div class="rw-touch"><button data-touch-button="grenade">ginger</button><button data-touch-button="jump">jump</button><button data-touch-button="aim">aim</button><button data-touch-button="fire">fire</button></div>
    <div class="rw-card" data-card="start"><div class="in"><h3>sushi scramble</h3><p>you are a salmon nigiri in power armour. the belt never stops. the diner is hungry.</p>${CONTROLS}<button data-action="start">play</button></div></div>
    <div class="rw-card" data-card="pause"><div class="in"><h3>paused</h3>${CONTROLS}<button data-action="resume">resume</button></div></div>
    <div class="rw-card" data-card="over"><div class="in"><h3 class="rw-over-title">eaten.</h3><p class="rw-over-why"></p><p class="rw-over-score"></p><p class="rw-over-best"></p><button data-action="again">again</button></div></div>`;
  parent.append(style, el);
  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector(s) as T;
  const segs = Array.from(el.querySelectorAll<HTMLElement>(".rw-shield i"));
  const tracker = q<HTMLCanvasElement>(".rw-tracker");
  const g = tracker.getContext("2d")!;
  let bannerTimer = 0;
  let hitTimer = 0;
  let buttonHandler: (a: "start" | "resume" | "again") => void = () => {};
  const click = (e: Event) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>("[data-action]")?.dataset.action as "start" | "resume" | "again" | undefined;
    if (action) buttonHandler(action);
  };
  el.addEventListener("click", click);

  return {
    el,
    touchUi: q(".rw-touch"),
    shield: (f) => {
      const on = Math.ceil(f * 10 - 0.001);
      segs.forEach((s, i) => s.classList.toggle("off", i >= on));
      q(".rw-shield").classList.toggle("low", f > 0 && f < 0.3);
    },
    fish: (f) => {
      q(".rw-fish b").style.width = `${Math.max(0, f) * 100}%`;
    },
    ammo: (n, max, reloading) => {
      const s = q(".rw-ammo strong");
      s.textContent = reloading ? "re-wasabi" : String(n);
      s.className = reloading ? "rw-reload" : "";
      s.style.fontSize = reloading ? "18px" : "";
      q(".rw-ammo span").textContent = reloading ? "" : `/ ${max}`;
    },
    ginger: (n) => el.querySelectorAll(".rw-ginger i").forEach((i, k) => i.classList.toggle("off", k >= n)),
    score: (score, best) => {
      q(".rw-score strong").textContent = score.toLocaleString("en-US");
      const t = tierFor(score);
      q(".rw-tier i").style.background = t.color;
      q(".rw-tier em").textContent = t.name;
      q(".rw-best").textContent = best > 0 ? `best ${best.toLocaleString("en-US")}` : "";
    },
    wave: (n) => {
      q(".rw-wave b").textContent = String(n);
    },
    banner: (title, sub = "", seconds = 2.2) => {
      q(".rw-banner strong").textContent = title;
      q(".rw-banner span").textContent = sub;
      q(".rw-banner").style.opacity = "1";
      window.clearTimeout(bannerTimer);
      bannerTimer = window.setTimeout(() => (q(".rw-banner").style.opacity = "0"), seconds * 1000);
    },
    hit: (kill) => {
      const h = q(".rw-hit");
      h.classList.toggle("kill", kill);
      h.style.opacity = "1";
      window.clearTimeout(hitTimer);
      hitTimer = window.setTimeout(() => (h.style.opacity = "0"), kill ? 220 : 90);
    },
    damageFrom: (angle) => {
      const d = q(".rw-dmg");
      d.style.transform = `rotate(${angle}rad)`;
      d.style.opacity = "0.9";
      window.setTimeout(() => (d.style.opacity = "0"), 260);
    },
    flash: () => {
      if (reducedMotion) return;
      const f = q(".rw-flash");
      f.style.opacity = "1";
      window.setTimeout(() => (f.style.opacity = "0"), 160);
    },
    soaked: (on) => {
      q(".rw-soaked").style.opacity = on ? "1" : "0";
    },
    boss: (frac) => {
      const b = q(".rw-boss");
      b.style.display = frac === null ? "none" : "block";
      if (frac !== null) q(".rw-boss i").style.width = `${Math.max(0, frac) * 100}%`;
    },
    tracker: (items, range) => {
      const w = tracker.width;
      g.clearRect(0, 0, w, w);
      g.save();
      g.translate(w / 2, w / 2);
      g.strokeStyle = "rgba(246,239,227,.35)";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(0, 0, w / 2 - 2, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(0, 0, w / 4, 0, Math.PI * 2);
      g.strokeStyle = "rgba(246,239,227,.15)";
      g.stroke();
      g.fillStyle = "rgba(14,9,12,.35)";
      g.beginPath();
      g.arc(0, 0, w / 2 - 3, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#b6ef4c";
      g.beginPath();
      g.moveTo(0, -7);
      g.lineTo(5, 5);
      g.lineTo(-5, 5);
      g.fill();
      for (const it of items) {
        const k = (w / 2 - 8) / range;
        const x = it.x * k;
        const y = it.z * k;
        if (Math.hypot(x, y) > w / 2 - 6) continue;
        g.fillStyle = it.big ? "#d4a640" : "#ff7a59";
        g.beginPath();
        g.arc(x, y, it.big ? 11 : 5, 0, Math.PI * 2);
        g.fill();
      }
      g.restore();
    },
    card: (which, data) => {
      el.querySelectorAll<HTMLElement>(".rw-card").forEach((c) => c.classList.toggle("on", c.dataset.card === which));
      if (which === "over" && data) {
        q(".rw-over-title").textContent = data.cause === "dropped" ? "dropped." : "eaten.";
        q(".rw-over-why").textContent = data.cause === "dropped" ? "the five-second rule does not apply." : "";
        const t = tierFor(data.score);
        q(".rw-over-score").textContent = `${data.score.toLocaleString("en-US")} points · ${t.name} · wave ${data.wave}`;
        q(".rw-over-best").textContent = data.score >= data.best && data.score > 0 ? "a new best" : `best ${data.best.toLocaleString("en-US")}`;
      }
    },
    onButton: (fn) => {
      buttonHandler = fn;
    },
    touch: (on) => q(".rw-touch").classList.toggle("on", on),
    dispose: () => {
      window.clearTimeout(bannerTimer);
      window.clearTimeout(hitTimer);
      el.removeEventListener("click", click);
      el.remove();
      style.remove();
    },
  };
}
