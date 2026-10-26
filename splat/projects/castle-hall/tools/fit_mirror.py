"""Fit a mirror's glass from the world collider: rays through the glass's pixel box from a known viewer camera,
RANSAC the dominant plane, report its centre, normal (toward the viewer) and the largest circle inside it.
usage: fit_mirror.py world  W H  eyeX eyeY eyeZ  u0 v0 u1 v1     (viewer camera at yaw 0, vertical fov 70)"""
import json, sys
import numpy as np, trimesh
w, W, H, ex, ey, ez, u0, v0, u1, v1 = sys.argv[1], *map(float, sys.argv[2:])
meta = json.load(open(f"{w}-meta.json"))["assets"]["splats"]["semantics_metadata"]
f, off = meta["metric_scale_factor"], meta["ground_plane_offset"]
m = trimesh.load(f"{w}-collider.glb").to_geometry(); v = m.vertices.copy()
m.vertices = np.c_[v[:, 0] * f, off - v[:, 1] * f, -v[:, 2] * f]
tv = np.tan(np.radians(35)); th = tv * W / H
us, vs = np.meshgrid(np.linspace(u0, u1, 24), np.linspace(v0, v1, 40))
d = np.c_[(us.ravel() - W / 2) / (W / 2) * th, -(vs.ravel() - H / 2) / (H / 2) * tv, -np.ones(us.size)]
d /= np.linalg.norm(d, axis=1)[:, None]
loc, _, _ = m.ray.intersects_location(np.tile([ex, ey, ez], (len(d), 1)), d, multiple_hits=False)
rng = np.random.default_rng(0); best = None
for _ in range(400):
    a, b, c = loc[rng.choice(len(loc), 3, replace=False)]
    n = np.cross(b - a, c - a); 
    if np.linalg.norm(n) < 1e-9: continue
    n /= np.linalg.norm(n); inl = np.abs((loc - a) @ n) < 0.03
    if best is None or inl.sum() > best[1].sum(): best = (n, inl)
n, inl = best; P = loc[inl]; c = P.mean(0)
n, = [np.linalg.svd(P - c)[2][2]]
if n @ (np.array([ex, ey, ez]) - c) < 0: n = -n
hz = np.cross([0, 1, 0], n); hz /= np.linalg.norm(hz); vt = np.cross(n, hz)
x, y = (P - c) @ hz, (P - c) @ vt
cx, cy = (np.percentile(x, 5) + np.percentile(x, 95)) / 2, (np.percentile(y, 5) + np.percentile(y, 95)) / 2
c = c + hz * cx + vt * cy
r = 0.5 * min(np.percentile(x, 95) - np.percentile(x, 5), np.percentile(y, 95) - np.percentile(y, 5))
print(w, "hits", len(loc), "inliers", inl.sum(), "centre", c.round(3).tolist(), "normal", n.round(3).tolist(), "radius", round(r, 3),
      "size", round(np.ptp(x), 2), "x", round(np.ptp(y), 2))
