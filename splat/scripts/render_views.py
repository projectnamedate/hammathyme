# Render posed training views + nerfstudio transforms.json + a surface-sampled points3d.ply seed.
# usage: blender -b <street.blend> -P scripts/render_views.py -- <dataset_dir> [--preview] [--viewer-shell]
import bpy, sys, os, math, random, json
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
OUT = argv[0]
PREVIEW = "--preview" in argv
os.makedirs(f"{OUT}/images", exist_ok=True)
scene = bpy.context.scene
random.seed(11)

prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
# Background kernel specialization crashed Blender 5.1 mid-run (MetalKernelPipeline::compile).
prefs.kernel_optimization_level = "OFF"
prefs.get_devices()
for d in prefs.devices:
    d.use = True
scene.cycles.device = "GPU"
W, H = (960, 540) if PREVIEW else (1440, 810)
scene.render.resolution_x, scene.render.resolution_y = W, H
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
if PREVIEW:
    scene.cycles.samples = 32

cam_data = bpy.data.cameras.new("cam")
cam_data.sensor_width = 36.0
cam_data.sensor_fit = "HORIZONTAL"
cam_data.clip_end = 1000.0
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam


def views():
    v = []
    # street level: two lanes, four headings each
    for x in range(-26, 27, 4):
        for y in (-3.5, 3.5):
            z = random.choice((1.6, 1.7, 2.4))
            p = Vector((x + random.uniform(-0.8, 0.8), y, z))
            v.append((p, Vector((x + random.uniform(-6, 6), 11, 3.5)), 24))
            v.append((p, Vector((x + random.uniform(-6, 6), -11, 3.5)), 24))
            v.append((p, Vector((x + 30, y * 0.3, 2.5)), 28))
            v.append((p, Vector((x - 30, y * 0.3, 2.5)), 28))
    # mid-height dolly down the centre line, one look at each row
    for x in range(-24, 25, 6):
        p = Vector((x, random.uniform(-1, 1), 5.5))
        v.append((p, Vector((x + 4, 11, 3.0)), 24))
        v.append((p, Vector((x - 4, -11, 3.0)), 24))
    # orbits around the street at three heights
    for radius, z, n, lens in ((34, 9, 40, 30), (44, 20, 32, 32), (52, 32, 24, 35)):
        for i in range(n):
            a = 2 * math.pi * i / n + random.uniform(-0.05, 0.05)
            p = Vector((radius * math.cos(a), radius * math.sin(a) * 0.8, z))
            v.append((p, Vector((p.x * 0.25, p.y * 0.1, 1.5)), lens))
    # high overview
    for i in range(8):
        a = 2 * math.pi * i / 8
        v.append((Vector((20 * math.cos(a), 20 * math.sin(a), 45)), Vector((0, 0, 0)), 30))
    if "--viewer-shell" in argv:
        v += viewer_shell()
    return v


def viewer_shell():
    # The web viewer orbits a fixed target down to ~5 degrees elevation, so it sees the hill ring
    # behind the town from angles the views above never cover; unsupervised hillside drifts into blobs.
    # Appended after the original views so their random draws (and file names) stay unchanged.
    target = Vector((10.16, -1.35, 1.5))
    deps = bpy.context.evaluated_depsgraph_get()
    v = []
    for dist in (25, 45, 65):
        for elev in (6, 14):
            for i in range(12):
                a = 2 * math.pi * i / 12
                e = math.radians(elev)
                p = target + dist * Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)))
                up = scene.ray_cast(deps, p, Vector((0, 0, 1)), distance=200)
                if up[0]:
                    continue  # inside a building or under the terrain
                v.append((p, target, 30))
    return v


all_views = views()
if PREVIEW:
    all_views = [all_views[i] for i in (0, 2, 125, 160, 200)]

frames = []
for i, (pos, target, lens) in enumerate(all_views):
    cam_data.lens = lens
    cam.location = pos
    cam.rotation_euler = (target - pos).to_track_quat("-Z", "Y").to_euler()
    bpy.context.view_layer.update()
    name = f"images/view_{i:04d}.png"
    scene.render.filepath = f"{OUT}/{name}"
    if not os.path.exists(scene.render.filepath):
        bpy.ops.render.render(write_still=True)
    fx = lens / 36.0 * W
    frames.append({
        "file_path": name, "fl_x": fx, "fl_y": fx, "cx": W / 2, "cy": H / 2, "w": W, "h": H,
        "transform_matrix": [list(r) for r in cam.matrix_world],
    })
    print(f"VIEW {i + 1}/{len(all_views)}", flush=True)

transforms = {"camera_model": "OPENCV", "frames": frames}

if not PREVIEW:
    # Seed points: area-weighted samples on every visible surface, coloured from the base texture.
    pts, cols = [], []
    rng = np.random.default_rng(3)
    tex_cache = {}
    deps = bpy.context.evaluated_depsgraph_get()
    for obj in bpy.data.collections["set"].objects:
        if obj.type != "MESH":
            continue
        ev = obj.evaluated_get(deps)
        me = ev.to_mesh()
        me.calc_loop_triangles()
        nt = len(me.loop_triangles)
        co = np.empty(len(me.vertices) * 3, np.float32)
        me.vertices.foreach_get("co", co)
        co = co.reshape(-1, 3)
        tv = np.empty(nt * 3, np.int32)
        me.loop_triangles.foreach_get("vertices", tv)
        tv = tv.reshape(-1, 3)
        tl = np.empty(nt * 3, np.int32)
        me.loop_triangles.foreach_get("loops", tl)
        tl = tl.reshape(-1, 3)
        M = np.array(obj.matrix_world)
        wco = co @ M[:3, :3].T + M[:3, 3]
        a, b, c = wco[tv[:, 0]], wco[tv[:, 1]], wco[tv[:, 2]]
        area = 0.5 * np.linalg.norm(np.cross(b - a, c - a), axis=1)
        count = 60000 if obj.name == "terrain" else 28000
        idx = rng.choice(nt, count, p=area / area.sum())
        r1, r2 = rng.random(count), rng.random(count)
        s = np.sqrt(r1)
        u, w = 1 - s, s * r2
        vv = s * (1 - r2)
        p = a[idx] * u[:, None] + b[idx] * vv[:, None] + c[idx] * w[:, None]
        if obj.name == "terrain":
            keep = np.hypot(p[:, 0], p[:, 1]) < 130
            p = p[keep]
            col = np.tile(np.array([[0.66, 0.56, 0.42]]), (len(p), 1))
        else:
            img = None
            for slot in obj.material_slots:
                for n in slot.material.node_tree.nodes:
                    if n.type == "TEX_IMAGE" and n.image and "metallic" not in n.image.name and "normal" not in n.image.name:
                        img = n.image
            if img.name not in tex_cache:
                px = np.empty(img.size[0] * img.size[1] * 4, np.float32)
                img.pixels.foreach_get(px)
                tex_cache[img.name] = (px.reshape(img.size[1], img.size[0], 4), img.size)
            px, (iw, ih) = tex_cache[img.name]
            uvs = np.empty(len(me.loops) * 2, np.float32)
            me.uv_layers.active.data.foreach_get("uv", uvs)
            uvs = uvs.reshape(-1, 2)
            la, lb, lc = uvs[tl[idx, 0]], uvs[tl[idx, 1]], uvs[tl[idx, 2]]
            uv = la * u[:, None] + lb * vv[:, None] + lc * w[:, None]
            xi = np.clip((uv[:, 0] % 1) * iw, 0, iw - 1).astype(int)
            yi = np.clip((uv[:, 1] % 1) * ih, 0, ih - 1).astype(int)
            col = px[yi, xi, :3]
        pts.append(p)
        cols.append(col)
        ev.to_mesh_clear()
    P = np.concatenate(pts)
    C = (np.clip(np.concatenate(cols), 0, 1) ** (1 / 2.2) * 255).astype(np.uint8)
    with open(f"{OUT}/points3d.ply", "wb") as f:
        f.write(f"ply\nformat binary_little_endian 1.0\nelement vertex {len(P)}\nproperty float x\nproperty float y\nproperty float z\nproperty uchar red\nproperty uchar green\nproperty uchar blue\nend_header\n".encode())
        rec = np.zeros(len(P), dtype=[("x", "<f4"), ("y", "<f4"), ("z", "<f4"), ("r", "u1"), ("g", "u1"), ("b", "u1")])
        rec["x"], rec["y"], rec["z"] = P[:, 0], P[:, 1], P[:, 2]
        rec["r"], rec["g"], rec["b"] = C[:, 0], C[:, 1], C[:, 2]
        f.write(rec.tobytes())
    transforms["ply_file_path"] = "points3d.ply"
    print("POINTS", len(P))

with open(f"{OUT}/transforms.json", "w") as f:
    json.dump(transforms, f, indent=1)
print("DONE", len(frames), "views")
