# Humpback for AR: Hunyuan mesh -> decimated, skinned to a procedural spine, swimming a seamless lap.
# usage: blender -b --factory-startup -P ar/whale/whale_rig.py -- <mesh.glb> <out_dir> <tag> [--rigid]
# Writes <tag>-toy.{glb,usdz} (0.6 m) and <tag>-life.{glb,usdz} (15 m, a real adult humpback).
# --rigid: no bones; the whole body banks and pitches round the lap (Quick Look fallback if skinning fails).
import bpy, sys, math, os
import numpy as np
from mathutils import Vector, Matrix, Quaternion

argv = sys.argv[sys.argv.index("--") + 1:]
SRC, OUT, TAG = argv[0], argv[1], argv[2]
RIGID = "--rigid" in argv
os.makedirs(OUT, exist_ok=True)

FPS = 24
LOOP = 24 * FPS      # one lap
STROKE = 6 * FPS     # one fluke stroke; LOOP / STROKE whole, so the loop is seamless
BONES = 8            # spine bones, snout to tail stock

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start, scene.frame_end = 0, LOOP

bpy.ops.import_scene.gltf(filepath=SRC)
mesh = next(o for o in scene.objects if o.type == "MESH")
for o in list(scene.objects):
    if o is not mesh:
        bpy.data.objects.remove(o, do_unlink=True)
bpy.context.view_layer.objects.active = mesh
mesh.select_set(True)
bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

dec = mesh.modifiers.new("dec", "DECIMATE")
dec.ratio = 100_000 / len(mesh.data.polygons)
bpy.ops.object.modifier_apply(modifier="dec")
for img in bpy.data.images:
    if img.size[0] > 2048:
        img.scale(2048, 2048)

# Normalise: body along +X with the snout at +X, belly down, length 1, centred on the origin.
co = np.array([v.co[:] for v in mesh.data.vertices])
axis = int(np.argmax(co.max(0) - co.min(0)))
lo, hi = co[:, axis].min(), co[:, axis].max()
t = (co[:, axis] - lo) / (hi - lo)
up = 2  # Hunyuan GLBs import Z-up
fins = co[:, up] < np.percentile(co[:, up], 3)   # the pectoral fin tips hang lowest, near the head
head_at_hi = np.median(t[fins]) > 0.5
R = Matrix.Identity(4)
if axis == 1:
    R = Matrix.Rotation(-math.pi / 2, 4, "Z")
if not head_at_hi:
    R = Matrix.Rotation(math.pi, 4, "Z") @ R
mesh.data.transform(R)
co = np.array([v.co[:] for v in mesh.data.vertices])
center = (co.max(0) + co.min(0)) / 2
length = co[:, 0].max() - co[:, 0].min()
mesh.data.transform(Matrix.Scale(1 / length, 4) @ Matrix.Translation(Vector(-center)))
co = np.array([v.co[:] for v in mesh.data.vertices])
print("NORMALISED", co.min(0).round(3), co.max(0).round(3), "head at +X", "src axis", axis)

pivot = bpy.data.objects.new("pivot", None)
scene.collection.objects.link(pivot)
swim = bpy.data.objects.new("swim", None)
scene.collection.objects.link(swim)
swim.parent = pivot

if not RIGID:
    arm_data = bpy.data.armatures.new("rig")
    arm = bpy.data.objects.new("rig", arm_data)
    scene.collection.objects.link(arm)
    arm.parent = swim
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    xs = np.linspace(0.5, -0.42, BONES + 1)          # snout to tail stock; flukes get their own bone
    zc = [float(np.median(co[np.abs(co[:, 0] - x) < 0.03, 2])) for x in xs]
    chain = []
    for i in range(BONES):
        b = arm_data.edit_bones.new(f"spine{i}")
        b.head, b.tail = (xs[i], 0, zc[i]), (xs[i + 1], 0, zc[i + 1])
        if chain:
            b.parent, b.use_connect = chain[-1], True
        chain.append(b)
    fl = arm_data.edit_bones.new("flukes")
    fl.head, fl.tail, fl.parent, fl.use_connect = chain[-1].tail, (-0.5, 0, zc[-1]), chain[-1], True
    # Pectoral fins: root where the low fin tips meet the flank, one bone per side.
    fin_pts = co[co[:, 2] < np.percentile(co[:, 2], 3)]
    fin_x = float(np.median(fin_pts[:, 0]))
    fin_bones = {}
    for side, name in ((1, "fin.L"), (-1, "fin.R")):
        b = arm_data.edit_bones.new(name)
        b.head = (fin_x + 0.08, side * 0.06, zc[2] - 0.04)
        b.tail = (fin_x - 0.02, side * 0.20, co[:, 2].min())
        b.parent = chain[2]
        fin_bones[name] = side
    bpy.ops.object.mode_set(mode="OBJECT")

    # Procedural weights: linear blend along the spine; fins take vertices far outside the body radius.
    mesh.parent = arm
    mod = mesh.modifiers.new("rig", "ARMATURE")
    mod.object = arm
    groups = {b.name: mesh.vertex_groups.new(name=b.name) for b in arm_data.bones}
    seg = np.clip((xs[0] - co[:, 0]) / (xs[0] - xs[-1]) * BONES, 0, BONES + 0.999)
    radial = np.hypot(co[:, 1], co[:, 2] - np.interp(co[:, 0], xs[::-1], zc[::-1]))
    body_r = np.zeros(len(co))
    for x in np.linspace(-0.5, 0.5, 41):
        m = np.abs(co[:, 0] - x) < 0.0125
        if m.any():
            body_r[m] = np.percentile(radial[m], 60)
    fin_w = np.clip((radial / np.maximum(body_r, 1e-4) - 1.25) / 0.35, 0, 1)
    fin_w *= (np.abs(co[:, 0] - fin_x) < 0.2)
    for i, v in enumerate(mesh.data.vertices):
        if fin_w[i] > 0:
            name = "fin.L" if co[i, 1] > 0 else "fin.R"
            groups[name].add([i], float(fin_w[i]), "REPLACE")
        rest = 1 - fin_w[i]
        if rest <= 0:
            continue
        s = seg[i]
        k, f = int(s), s - int(s)
        names = [f"spine{j}" for j in range(BONES)] + ["flukes"]
        a, b = names[min(k, BONES)], names[min(k + 1, BONES)]
        groups[a].add([i], rest * (1 - f), "ADD")
        groups[b].add([i], rest * f, "ADD")
else:
    mesh.parent = swim


def key(o, path, idx, f, val, bone=None):
    tgt = o.pose.bones[bone] if bone else o
    getattr(tgt, path)[idx] = val
    tgt.keyframe_insert(data_path=path, index=idx, frame=f)


AMP = [0.0, 0.0, 0.015, 0.03, 0.05, 0.08, 0.11, 0.15]   # pitch per spine joint, rising to the tail
for f in range(0, LOOP + 1, 2):
    ph = f / STROKE * 2 * math.pi
    lap = f / LOOP * 2 * math.pi
    key(pivot, "rotation_euler", 2, f, lap + math.pi / 2)   # lap starts on +Y, which exports as away from the viewer
    key(swim, "location", 0, f, 1.0)
    key(swim, "location", 2, f, 0.03 * math.sin(ph))
    key(swim, "rotation_euler", 2, f, math.pi / 2)          # snout along the direction of travel
    key(swim, "rotation_euler", 0, f, -0.12)                # bank into the turn
    key(swim, "rotation_euler", 1, f, 0.04 * math.sin(ph + 0.6))
    if not RIGID:
        for i in range(BONES):
            arm.pose.bones[f"spine{i}"].rotation_mode = "XYZ"
            key(arm, "rotation_euler", 0, f, AMP[i] * math.sin(ph - i * 0.45), f"spine{i}")
        arm.pose.bones["flukes"].rotation_mode = "XYZ"
        key(arm, "rotation_euler", 0, f, 0.22 * math.sin(ph - BONES * 0.45), "flukes")
        for name, side in fin_bones.items():
            # A small flap about the body axis, mapped into the bone's rest frame so roll doesn't matter.
            # Keep it small: the fin root blends into the flank, and big swings tear it there.
            pb = arm.pose.bones[name]
            pb.rotation_mode = "QUATERNION"
            to_bone = arm_data.bones[name].matrix_local.to_3x3().inverted()
            pb.rotation_quaternion = Quaternion(to_bone @ Vector((1, 0, 0)), side * 0.10 * math.sin(ph + 1.0))
            pb.keyframe_insert(data_path="rotation_quaternion", frame=f)


def export(size, body_m, radius_m, height_m):
    pivot.scale = (body_m,) * 3
    pivot.location = (0, 0, height_m)
    for f in range(0, LOOP + 1, 2):
        swim.location[0] = radius_m / body_m
        swim.keyframe_insert(data_path="location", index=0, frame=f)
    base = f"{OUT}/{TAG}-{size}"
    bpy.ops.export_scene.gltf(filepath=f"{base}.glb", export_format="GLB", export_animations=True,
                              export_force_sampling=True, export_yup=True, export_image_format="JPEG")
    bpy.ops.wm.usd_export(filepath=f"{base}.usdz", export_animation=True, export_armatures=not RIGID,
                          generate_preview_surface=True, convert_orientation=True,
                          export_global_forward_selection="NEGATIVE_Z", export_global_up_selection="Y",
                          convert_scene_units="METERS", usdz_downscale_size="2048")
    print("EXPORTED", base)


export("toy", 0.6, 0.5, 0.35)
export("life", 15.0, 9.0, 2.5)
bpy.ops.wm.save_as_mainfile(filepath=f"{OUT}/{TAG}.blend")
