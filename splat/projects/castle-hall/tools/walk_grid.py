"""Turn a Marble collider into a walk map for the viewer: ground height plus where you can't walk.

The collider is in raw OpenCV space; the viewer places it at scale (f, -f, -f) and y = ground_plane_offset,
so a raw point (x, y, z) lands at (x f, off - y f, -z f) in metres with the floor at y = 0.

The collider surface is sampled densely. Ground is the lowest sample in each cell. A cell is blocked when any
sample sits between knee and head height above that ground (walls, trunks, furniture, rocks), when the cell has
no surface (outside the world), the ground steps too far to a neighbour, or the ground is a mound above the
local terrain. Blocked cells are dilated by the body
radius. Writes <world>-walk.json: origin, cell, size, ground in centimetres (int16, base64), blocked bitmask.
"""
import base64, json, sys
import numpy as np, trimesh
from scipy.ndimage import binary_closing, binary_dilation, distance_transform_edt, median_filter, percentile_filter

world = sys.argv[1]
CELL, RADIUS, KNEE, HEAD, MAX_STEP, MOUND = 0.1, 0.22, 0.32, 1.8, 0.08, 0.3
meta = json.load(open(f"{world}-meta.json"))["assets"]["splats"]["semantics_metadata"]
f, off = meta["metric_scale_factor"], meta["ground_plane_offset"]
m = trimesh.load(f"{world}-collider.glb").to_geometry()
v = m.vertices.copy()
m.vertices = np.c_[v[:, 0] * f, off - v[:, 1] * f, -v[:, 2] * f]
lo, hi = m.bounds
x0, z0 = lo[0], lo[2]
W, H = int((hi[0] - x0) / CELL) + 1, int((hi[2] - z0) / CELL) + 1

pts = trimesh.sample.sample_surface(m, int(m.area / (CELL * CELL) * 12), seed=1)[0]
i, j = ((pts[:, 2] - z0) / CELL).astype(int).clip(0, H - 1), ((pts[:, 0] - x0) / CELL).astype(int).clip(0, W - 1)
ground = np.full((H, W), np.inf); np.minimum.at(ground, (i, j), pts[:, 1])
has = binary_closing(np.isfinite(ground), structure=np.ones((3, 3)))
near = distance_transform_edt(~np.isfinite(ground), return_distances=False, return_indices=True)
g = median_filter(ground[near[0], near[1]], size=5)        # splat-mesh floors are bumpy; walk on the smoothed one

h = pts[:, 1] - g[i, j]
blocked = np.zeros((H, W), bool); hit = (h > KNEE) & (h < HEAD); blocked[i[hit], j[hit]] = True
steep = np.zeros_like(blocked)
steep[:, 1:] |= np.abs(np.diff(g, axis=1)) > MAX_STEP; steep[1:, :] |= np.abs(np.diff(g, axis=0)) > MAX_STEP
# mounds: reconstructed furniture comes out as smooth humps you could climb; block ground that stands above the
# local terrain (a low percentile over 2.5 m follows hills but not tables)
terrain = percentile_filter(g, 20, size=int(2.5 / CELL))
blocked |= steep | ~has | (g - terrain > MOUND)
r = int(round(RADIUS / CELL)); yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
blocked = binary_dilation(blocked, structure=(xx * xx + yy * yy) <= r * r)

json.dump({"x0": x0, "z0": z0, "cell": CELL, "w": W, "h": H,
           "ground": base64.b64encode(np.round(g * 100).astype("<i2").tobytes()).decode(),
           "blocked": base64.b64encode(np.packbits(blocked.ravel())).decode()}, open(f"{world}-walk.json", "w"))
free = ~blocked
print(world, f"{W}x{H}", f"blocked {blocked.mean():.0%}", f"ground on free cells {g[free].min():.2f}..{g[free].max():.2f} m")
from PIL import Image
img = np.where(blocked, 30, 140 + 100 * (g - g[free].min()) / max(1e-6, np.ptp(g[free]))).clip(0, 255)
Image.fromarray(img.astype(np.uint8)).save(f"/private/tmp/claude-501/-Users-hammer-Desktop-vibe-skills/85062ebb-c989-40f5-be0d-83d93b30c1e0/scratchpad/walk-{world}.png")
