# AGENTS.md: splat

Gaussian-splat pipeline for Hammer portfolio pieces, living inside the hammer-ad
repo at `splat/` (moved from `~/Desktop/vibe/splat` 2026-10-10, history kept via
`git subtree`). It is excluded from the site's lint, typecheck and Vercel build.
The shipped web asset goes to `public/work/vfx-cgi/neural-set-capture/`. The first project is
`projects/gunfight-street`: the main street from the short film The Gunfight
(`studioly/projects/the-gunfight`), rebuilt as a 3D set and trained into a
gaussian splat for `hammer.ad/work/vfx-cgi/neural-set-capture`.

## Pipeline (gunfight-street)

1. `refs/`: frames pulled from the film master (the design authority).
2. `stills/`: one isolated object per still, GPT Image 2.5 on Evolink
   (`scripts/gen_still.mjs`), refs = film frames.
3. `meshes/`: Hunyuan 3D 3.1 Pro image-to-3D on fal (`scripts/hunyuan.mjs`).
4. Blender 5.1 assembles the street and renders posed views
   (`scripts/build_street.py`, `scripts/render_views.py`) into `dataset/`
   (nerfstudio `transforms.json` + `points3d.ply` seed). Pass
   `--viewer-shell` to add views on the web viewer's own orbit. Anything the
   viewer can see but no training view covers trains into junk: v02 shipped
   a black and yellow hillside blob that the 70 shell views fixed in v03
   (2026-10-18).
5. Brush trains the splat into `splats/` (`scripts/train.sh`). Brush is an external
   Rust tool, not vendored: `scripts/setup_brush.sh` clones and builds the pinned
   commit into `~/src/brush` (override with `BRUSH_DIR`).
6. SuperSplat cleanup, then `@playcanvas/splat-transform` to `.sog` for the web
   (Spark viewer on the site). Its filters apply to the file named before
   them: `splat-transform in.ply -N -S 0,0,0,140 --decimate-adaptive 1000000 out.ply`.

## Rules

- Personal work: fal and Evolink only, never the Artlist MCP (Artlist owns its
  output).
- Keys come from `/Users/hammer/.codex/private/aividdy-provider.env`; never
  write them to the repo.
- Every paid call is appended to `projects/<name>/ledger.json`.
- Never overwrite generated media: every output gets a new `-vNN` id.
- Commit text only (code, prompts, ledgers, docs). Media, meshes, splats and
  renders are ignored by `.gitignore` and stay on disk.
- Spend: runs estimated at $25 or less go ahead; larger needs Jeff's approval.
