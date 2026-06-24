# Portfolio Build Handoff — vfx + cgi and digital-twin pieces

**For:** the coding agent that will actually build these portfolio pieces.
**From:** the 2026-06-24 restructure session. Deep-researched, feasibility-graded, and scoped for how Hammer actually works.
**Status:** all pieces below are scaffolded in `lib/works.ts` as `coming-soon`. None has a detail page yet. This doc is the spec to build them.

---

## 0. The studio model (read first — it defines "feasible")

Hammer is a **solo AI-producer studio** (one operator, Jeff) that ships work by **orchestrating coding agents** (Claude Code / Codex) plus:
- **cloud GPU rental** (RunPod / Vast.ai, RTX 4090 ~$0.30–0.70/hr),
- **paid generative APIs** (image / video / 3D, a few dollars of credits),
- **free / indie-licensed creative software** (Blender, OpenUSD, ComfyUI, Nerfstudio, Unreal under-$1M, Houdini Apprentice/Indie).

There is **no physical studio, no render farm, and no enterprise software license** (no paid Omniverse Enterprise, no Houdini FX commercial). Every piece must produce a **credible, shippable artifact that renders on a `/work/<slug>/<piece>` detail page** — a video, an interactive web embed, an image/turntable grid, or annotated code + diagrams.

**Honesty rule (load-bearing):** the page copy must not overclaim. Where the research flags a caveat (splats aren't relightable; auto-retopo is quad-*dominant* not artist-grade; a surrogate is only valid in-domain; sensor data may be synthetic), state it plainly. Honest framing reads as competence here.

**Total build budget** for the vfx set is **under ~$10** of compute (mostly cloud GPU hours); the two twin pieces are **near-zero** cost (CPU + free tiers).

---

## 1. How a piece becomes live on the site (integration contract)

Source of truth is `lib/works.ts` → `CASE_STUDIES`. To ship a piece:

1. **Build the artifact** (per the spec below). Put media under `public/work/<category-slug>/<piece-slug>/…` (e.g. `public/work/vfx-cgi/neural-set-capture/flythrough.mp4`).
2. **Add a detail renderer** in `app/work/[slug]/[piece]/page.tsx`:
   - Write a `function <Name>Detail({ transitionName }: { transitionName: string })`.
   - Add a branch in `renderPieceDetail()` keyed on `pieceDetailKey(category.slug, piece.slug)` → `"<slug>/<piece>"`.
   - Reuse the shared grammar (copy an existing renderer like `KiraAgentDetail` or `EquinoxCampaignDetail`):
     - `<section className="mx-auto max-w-[1320px]">`
     - 12-col grid: `grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10`; hero in `md:col-span-8`, aside in `md:col-span-4`.
     - Media frame: `border border-[var(--ink-4)] bg-[var(--cream-1)] shadow-[0_24px_80px_rgba(31,7,7,0.07)]` with `style={{ viewTransitionName: transitionName }}`.
     - Mono labels: `font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--cinnamon)]`.
     - Wrap entrance in `FadeIn` / `MaskReveal` (already imported).
3. **Flip it live** in `lib/works.ts`: set the piece `status: "live"` and add `"<slug>/<piece>"` to `DETAIL_READY_KEYS`. This auto-adds it to `app/sitemap.ts` and makes the card clickable.
4. **SEO**: `buildPieceMetadata` is automatic. If the piece has a hero **video**, add a `VideoObject` branch in `lib/seo.ts` `buildVideoObjectJsonLd()` (copy the `equinox` block at line ~397). Add the route to `public/.well-known/agents.json` `public_routes`, and optionally to `app/sitemap-priority.xml/route.ts`.
5. **Card art** already falls back to the category `PieceArt` specimen; add a per-piece specimen in `components/PieceArt.tsx` `SPECIMENS` only if you want bespoke card art (use the `Plate`/`MonoLabel` pattern, viewBox `0 0 120 160`, locked tokens only).
6. **Interactive pieces** (sensor twin, surrogate) can either embed a web viewer/iframe or follow the existing live-demo pattern under `app/api/demos/*` (note the $1 shared daily provider cap — though these two need no paid provider).

**Brand invariants:** lowercase house voice, blurbs ≤25 words, no banned words (`harness`, `leverage`, `seamless`, "the power of AI", etc.); palette limited to `--cream-*`, `--ink-0..4`, `--cinnamon`, `--bloodlust`. See `BRAND_GUIDE.md`.

**Verify before claiming done:** `npm run typecheck && npm run lint && npm run build && npm run verify:seo`, then dev-server check the new route renders + is clickable from the category grid.

---

## 2. Build order (recommended)

Lowest-risk / highest-signal first:

1. **`vfx-cgi/neural-set-capture`** — clearly feasible, <$1, visually stunning. Proves the capture→splat→web pattern.
2. **`agents-digital-twins/surrogate-model`** — clearly feasible, $0 infra, instant "ML vs physics + speedup number" legibility.
3. **`vfx-cgi/blender-lookdev-pipeline`** — clearly feasible, pennies. Proves the headless-CLI-agent pattern.
4. **`agents-digital-twins/sensor-twin-dashboard`** — clearly feasible; design around the synthetic fallback.
5. **`vfx-cgi/comfyui-production-backend`** — feasible, scoped; highest "real service" credibility.
6. **`vfx-cgi/usd-scene-assembly`** — feasible, most time; the interchange showpiece, scope the splat leg.

`agents-digital-twins/bradley` is **not in this list** — it's a persona twin that follows Hammer's existing kira-class character pipeline (character bible + LoRA + runtime), no new research needed.

---

## 3. Piece specs

Each verdict: **clearly feasible** / **feasible-with-scoping**. Costs are per finished artifact.

### 3.1 `vfx-cgi/neural-set-capture` — phone → 3D Gaussian splat → web flythrough
**Verdict: clearly feasible.** ~$0.20–0.70 GPU, or $0 if captured on-device.

- **Stack:** capture with iPhone video **or Scaniverse** (Niantic, on-device splatting, exports PLY/SPZ) → pose via **COLMAP** (`ns-process-data`) → train **Nerfstudio `splatfacto`** on the **gsplat** backend → clean in **SuperSplat Editor** (browser, MIT) → compress to **.sog / .spz** → publish via SuperSplat one-click embed or self-host with **Spark** (`@sparkjsdev/spark`, Three.js).
- **Build:** capture 150–400 photos / slow orbit video (even light, 60–80% overlap, no glass/water) → run a RunPod/Vast 4090 pod with the official `nerfstudio` Docker image → `ns-process-data images …` → `ns-train splatfacto --data …` (~8–30 min) → `ns-export gaussian-splat …` → clean/crop/rescale in SuperSplat → publish → render a 30–60s MP4 flythrough via a camera path.
- **GPU/cost/data:** RTX 4090 24GB, ~0.25–0.5 GPU-hr, **<$1 total**; $0 if Scaniverse on-device. Input = you shoot it.
- **Artifact:** interactive in-browser splat viewer (SOG/SPZ ~40–60MB, embed iframe or Spark canvas) **+ a 30–60s MP4 flythrough** as the autoplay poster + optional process strip. → renders in the standard hero frame; video uses the `EquinoxCampaignDetail` video pattern.
- **Gotchas:** splats are **view-captured, not relightable** (don't promise relighting); COLMAP is finicky (Scaniverse/Polycam poses are the reliable fallback); RTX 50-series has CUDA/torch install friction — **use the Docker image + a 4090**; large splats can stall mobile WebGL — keep the MP4 fallback.
- **Done when:** viewer loads <5s desktop, 30+ FPS, no floaters in frame; compressed ≤~80MB; renders on a second browser/mobile; reproducible from the documented commands.

### 3.2 `vfx-cgi/blender-lookdev-pipeline` — headless bpy material/lighting sweeps → contact sheet
**Verdict: clearly feasible** (safest of the set). <$1–3.

- **Stack:** **Blender 4.5 LTS** (or 5.1), **Cycles + OptiX** (NOT EEVEE headless), `bpy` PyPI for glue, **Poly Haven** CC0 assets/HDRIs.
- **Build:** Linux container + NVIDIA driver ≥535 + Blender binary → `import_asset.py` (load glTF/USD, normalize, frame) → `turntable.py` (parent to empty, keyframe 360°, HDRI world) → `sweep.py` (loop over {material × HDRI × light angle}, one job per cell) → `contact_sheet.py` (PIL grid + labels). **GPU must be enabled explicitly in headless** — devices don't auto-populate:
  ```python
  prefs = bpy.context.preferences.addons['cycles'].preferences
  prefs.compute_device_type = 'OPTIX'; prefs.get_devices()
  for d in prefs.devices: d.use = (d.type == 'OPTIX')
  bpy.context.scene.cycles.device = 'GPU'
  ```
- **GPU/cost/data:** RTX 4090, ~5–15s/frame at 1080p with OptiX denoise; 48-frame turntable ≈ 5–20 min; **<$1–3 total**. Input = one CC0 asset + a few HDRIs.
- **Artifact:** contact-sheet PNG grid + turntable MP4/WebM + the **reviewable bpy scripts** (syntax-highlighted) + a methodology note.
- **Gotchas:** **avoid EEVEE headless** (needs display/EGL); driver/CUDA-OptiX mismatch is the #1 failure (verify `nvidia-smi`); use the full `blender` binary for renders, the `bpy` module for glue only; do labels in PIL not in-scene.
- **Done when:** reproducible from CLI on a fresh box; GPU confirmed active (no CPU fallback); ≥1 turntable + ≥1 sweep grid at 1080p; scripts run unmodified; cost logged.

### 3.3 `vfx-cgi/comfyui-production-backend` — ComfyUI as an API service with a quality gate
**Verdict: feasible-with-scoping** (days; operational not architectural complexity). ~$0.005/delivered image.

- **Stack:** **ComfyUI** (GPL; hosting a network API does NOT trigger distribution obligations); API = `POST /prompt`, `GET /history/{id}`, `GET /view`, WS `/ws`; export workflow via dev-mode **"Save (API format)"** (node-id-keyed — the only format `/prompt` accepts). **Commercial-safe model: FLUX.2 [klein] 4B (Apache-2.0)** or FLUX.1 [schnell] — **avoid [dev]** (non-commercial). Quality gate (free pip): **torchmetrics CLIPScore** (prompt alignment) + **InsightFace ArcFace** cosine (face/identity drift — flag `buffalo_l` as non-commercial) + **LAION aesthetic** / ImageReward.
- **Build:** build the workflow in the UI → Save (API format) → commit JSON (version pin) → deploy on **RunPod Serverless `worker-comfyui`** (queue + warm pool) or **Modal** → orchestrator submits graph, polls/listens, fetches via `/view` → quality gate stacks CLIP + ArcFace + aesthetic, each with a threshold → reject → resubmit new seed, **cap retries ~3** → log every attempt + score for the before/after demo.
- **GPU/cost/data:** RTX 4090 24GB; ~5–15s gen + ms scoring → **~$0.002–0.005/delivered image** + warm-idle. Input = prompt set + reference face(s) for the consistency demo.
- **Artifact:** live API endpoint (or recorded demo) + **before/after gallery** (rejected vs accepted with scores) + the orchestration code + pinned graph JSON.
- **Gotchas:** **licensing has the legal teeth** — ship Apache models; single metrics miss subtle artifacts — **stack signals**; modern models one-shot easy portraits, so frame the gate around **hard prompts** (multi-subject, hands-in-action, embedded text) and **identity consistency** (ArcFace), not "rescuing a broken model"; pin ComfyUI + custom nodes + weights together.
- **Done when:** API accepts a pinned graph and returns scored images; gate visibly rejects ≥1 bad output and delivers a passing retry; thresholds documented vs a labeled sample; retries bounded; per-image cost logged.

### 3.4 `vfx-cgi/usd-scene-assembly` — one OpenUSD scene composed across tools
**Verdict: feasible-with-scoping** (most time; two scope cuts). A few $ GPU; cost is time, not money.

- **Stack:** **OpenUSD v26.05** (`usd-core` PyPI wheel — Python API only, no usdview) is the **composition authority**; **usdview/usdrecord** from NVIDIA prebuilt binaries; **Blender 5.1** as asset producer/consumer only (it **flattens composition** — do not let it assemble); **Unreal 5.8** USD Stage Actor (preserves layers/references/variants live; Movie Render Graph + Path Tracer = best free render); splats via the **v26.03 `…GaussianSplat` USD schema** + `py3dgsPlyToUsd.py` (+ build the `hdParticleField` Hydra delegate).
- **Build:** author root stage in Python with **sublayers + `references` + `variantSets`** → produce the generated asset + a UsdSkel/animated character in Blender, export each as its own USD, **reference** them as layers → splat env: 3DGS PLY → `py3dgsPlyToUsd.py` → reference as a layer → set `metersPerUnit` + `upAxis` (Blender 5.1 now honors both) → render in **Unreal 5.8 (USD Stage Actor → MRG + Path Tracer)** or headless `usdrecord` → generate the composition diagram from the stage structure.
- **GPU/cost/data:** authoring is CPU/free; render GPU same 4090-class for the flythrough; **low $**. Input = a 3DGS PLY + a generated asset + an animated/mocap character.
- **Artifact:** rendered turntable/flythrough of the composed scene + the **USD authoring scripts** + a **layer/composition diagram** (sublayers/references/variants).
- **Gotchas (scope cuts):** composition round-trips through **usdview/Unreal, NOT Blender** (Blender flattens — Python is the authority); the splat leg needs the `hdParticleField` delegate or an RTX renderer — **if it proves too much, ship {generated asset + UsdSkel character} as the headline and treat the splat env as a stretch layer**; **no MaterialX import** (keep materials simple / rebuild per-tool); Houdini Apprentice taints to `.usdnc` + watermarks — use only to *prove* the round-trip.
- **Done when:** a single stage assembled programmatically with real references + ≥1 variantSet opens in usdview/Unreal **with composition intact (not flattened)**; ≥1 layer authored in Blender + ≥1 splat-or-generated asset; rendered flythrough; diagram matches the real stage; units/up-axis correct.

### 3.5 `agents-digital-twins/sensor-twin-dashboard` — roll-your-own live twin dashboard
**Verdict: clearly feasible** (feasible-with-scoping on the word "live"). No GPU; ~$0 (+ optional $5–15 hardware).

- **Stack:** **dlt 1.28** (ingest) → **DuckDB 1.5** (store) → **River 0.25** HalfSpaceTrees + EWMA/z-score (anomaly) → **FastAPI + WebSocket** (backend) → **Apache ECharts** (frontend) → deploy backend on **Fly.io / Railway** (NOT Vercel — serverless can't hold WebSockets). Skip TimescaleDB unless the narrative needs "production cloud TSDB."
- **Feed (the crux), ranked:** real **ESP32 + BME280** over MQTT (~$5–15, the "my own sensor" story) > **Sensor.Community** air-quality JSON (no auth, 5-min updates — **best always-on default**) > OpenSky ADS-B (impressive but now needs OAuth2 + daily credits since Mar 2026) > public MQTT test brokers (flaky — wiring tests only) > synthetic generator (fallback, labeled).
- **Build:** pick feed → dlt micro-batch poll → DuckDB `merge`/`append` → anomaly tag (z-score baseline + River HalfSpaceTrees) → FastAPI pushes latest over WS + a replay endpoint → ECharts live time-series with anomaly markers + device-state panel + **Live / Replay / Synthetic** toggle → deploy to Fly/Railway.
- **GPU/cost/data:** none / CPU-trivial; ~$0 + optional hardware. Data = the feed itself.
- **Artifact:** a web dashboard with the Live/Replay/Synthetic toggle (replay guarantees the page is never dead) + the public ingestion/anomaly repo. Embed as an iframe in the detail page or build inline.
- **Gotchas:** dlt is **micro-batch, not true streaming** (call it "near-real-time"); **synthetic fallback is mandatory** (public feeds hiccup); label synthetic data as synthetic; the *feed source itself* is the "twinned thing" — that's the honest answer to "no physical asset."
- **Done when:** updates live or convincingly replays at sub-few-second cadence; ≥1 real external feed wired; anomalies flagged + triggerable on demand; survives feed outage via labeled fallback; code public on a WS-capable host.

### 3.6 `agents-digital-twins/surrogate-model` — interactive ML-surrogate vs physics demo
**Verdict: clearly feasible** (one scoping discipline). No GPU; $0 (static + ONNX).

- **Stack:** **PyTorch 2.12** (train) → data-gen via **FiPy 4.0** (2D heat equation — recommended) or scipy `solve_ivp` (pendulum) → export **ONNX** → run client-side with **ONNX Runtime Web** (WASM/WebGPU) → deploy static (Vercel/GitHub Pages). **Avoid FEniCSx (install fragility) and CFD (convergence/meshing friction) for v1.** `neuraloperator` FNO is an optional flex, not needed for one slider.
- **Build:** pick system (2D heat eq is the visual headline) → sweep 1–2 scalar params over a grid, FiPy solves each, store (params→field) → train a small MLP/CNN on **CPU** (minutes) → **precompute a dense ground-truth sweep** offline and ship it (so the browser shows prediction vs truth without re-solving) → export PyTorch→ONNX → frontend slider → instant ONNX inference → render predicted field + ground-truth field + error map + a **speedup benchmark** ("full solve ~X ms; surrogate <1 ms").
- **GPU/cost/data:** **no GPU** (CPU trains in minutes); $0. Data self-generated by FiPy (cleaner than adapting PDEBench / The Well, which exist if wanted).
- **Artifact:** interactive web demo (slider → instant surrogate vs precomputed full-sim + live error + speedup number) + training/data-gen code + benchmark. Embed inline in the detail page.
- **Gotchas:** **OOD is the #1 honesty issue** — a surrogate is only valid inside its training range; **clamp the slider to the trained domain** and visibly flag extrapolation; precompute ground truth offline (don't solve in-browser); FNO is overkill for one scalar slider.
- **Done when:** slider drives <~16ms client-side prediction; prediction + ground truth + error shown together with low in-domain error; OOD clamped/flagged; a concrete speedup number displayed; code public, CPU-only end to end.

---

## 4. Confidence caveats (verify at build time)
- Nerfstudio per-scene GPU-hour at high image counts is extrapolated, not a direct 1000-img/30k-iter benchmark.
- The `uPlot`-vs-ECharts choice and dlt's "no true streaming" were inferred from absence of a fresh 2026 primary cite — treat as known-good, not freshly verified.
- Tool versions (Blender 4.5/5.1, OpenUSD 26.05, dlt 1.28, PyTorch 2.12, DuckDB 1.5, River 0.25, ComfyUI cadence) were current as of this session (2026-06-24) — re-check before relying on a specific flag.

---

## 5. What this doc does NOT cover
- Per-piece copywriting for the detail page (write in lowercase house voice at build time).
- The `bradley` persona-twin build (follows the existing kira-class character pipeline).
- Bespoke `PieceArt` card specimens (optional; category fallback already renders).
