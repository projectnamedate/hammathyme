# Clockwork whale for AR: rigid brass segments on a parent chain, every motion a transform,
# because Quick Look does not reliably play skinned USDZ animation.
# usage: blender -b --factory-startup -P ar/clockwork-whale/whale.py -- <out_dir> <tag>
# Writes <tag>-toy.{glb,usdz} (0.5 m whale) and <tag>-life.{glb,usdz} (14 m whale).
import bpy, sys, math, os

argv = sys.argv[sys.argv.index("--") + 1:]
OUT, TAG = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)

FPS = 24
LOOP = 24 * FPS          # one lap of the circle
STROKE = 4 * FPS         # one tail stroke; LOOP / STROKE must be whole for a seamless loop
L = 1.0                  # body length in build units; exports scale it

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start, scene.frame_end = 0, LOOP


def material(name, color, metallic, roughness):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    return m


BRASS = material("brass", (0.78, 0.55, 0.22), 1.0, 0.32)
COPPER = material("copper", (0.72, 0.36, 0.22), 1.0, 0.38)
IRON = material("iron", (0.10, 0.10, 0.11), 0.9, 0.45)
ENAMEL = material("enamel", (0.05, 0.22, 0.26), 0.2, 0.30)


def profile(s):
    """Half-width and half-height of the body at s (0 = snout, 1 = fluke tips), humpback proportions."""
    if s < 0.08:
        k = s / 0.08
        w = 0.035 + 0.055 * math.sin(k * math.pi / 2)
    elif s < 0.35:
        w = 0.09 + 0.02 * math.sin((s - 0.08) / 0.27 * math.pi / 2)
    else:
        k = min((s - 0.35) / 0.55, 1.0)
        w = 0.11 * (1 - k) ** 1.4 + 0.012
    return w, w * 0.92


def section(s0, s1, mat, rings=6, n=24, flare=1.06):
    """A body plate from s0 to s1 along -X, origin at its front joint so it hinges there."""
    verts, faces = [], []
    for r in range(rings):
        s = s0 + (s1 - s0) * r / (rings - 1)
        w, h = profile(s)
        if r == 0:
            w, h = w * flare, h * flare   # the plate lip overlaps the one in front, like armour
        x = -(s - s0) * L
        for i in range(n):
            a = 2 * math.pi * i / n
            verts.append((x, w * math.cos(a), h * math.sin(a)))
    for r in range(rings - 1):
        for i in range(n):
            j = (i + 1) % n
            faces.append((r * n + i, r * n + j, (r + 1) * n + j, (r + 1) * n + i))
    faces.append(tuple(range(n))[::-1])
    faces.append(tuple(range((rings - 1) * n, rings * n)))
    me = bpy.data.meshes.new(f"seg_{s0:.2f}")
    me.from_pydata(verts, [], faces)
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(mat)
    return me


def obj(name, data, parent=None, loc=(0, 0, 0), rot=(0, 0, 0)):
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    o.parent = parent
    o.location = loc
    o.rotation_euler = rot
    return o


def flat(name, outline, thick, mat):
    """Extruded flat plate from a 2D outline in the XY plane (fins, flukes)."""
    n = len(outline)
    verts = [(x, y, -thick / 2) for x, y in outline] + [(x, y, thick / 2) for x, y in outline]
    faces = [tuple(range(n))[::-1], tuple(range(n, 2 * n))]
    faces += [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.materials.append(mat)
    return me


def gear(name, radius, width, teeth, mat):
    pts = []
    for k in range(teeth * 4):
        r = radius * (1.18 if k % 4 in (1, 2) else 1.0)
        a = 2 * math.pi * k / (teeth * 4)
        pts.append((r * math.cos(a), r * math.sin(a)))
    return flat(name, pts, width, mat)


# Hierarchy: pivot (laps the anchor) > swim root (radius, height, bob) > head > body plates > flukes.
pivot = obj("pivot", None)
root = obj("swim", None, pivot)

CUTS = [0.0, 0.20, 0.34, 0.47, 0.58, 0.68, 0.77, 0.85, 0.91]
plates = []
parent, prev_s = root, 0.0
for i in range(len(CUTS) - 1):
    s0, s1 = CUTS[i], CUTS[i + 1]
    mat = ENAMEL if i == 0 else (BRASS if i % 2 else COPPER)
    p = obj(f"plate_{i}", section(s0, s1, mat), parent, loc=(-(s0 - prev_s) * L, 0, 0))
    plates.append(p)
    parent, prev_s = p, s0

# Lower jaw: hinged under the head plate, opens twice a lap.
# Outline runs forward (+X) from the hinge at the back of the mouth.
jaw_out = [(0.0, -0.07), (0.15, -0.05), (0.18, 0.0), (0.15, 0.05), (0.0, 0.07)]
jaw = obj("jaw", flat("jaw", [(x * L, y * L) for x, y in jaw_out], 0.02, BRASS), plates[0], loc=(-0.18 * L, 0, -0.06 * L))

# Pectoral fins: long and narrow, the humpback signature.
fin_out = [(0.0, 0.0), (0.04, 0.02), (0.10, 0.16), (0.12, 0.30), (0.09, 0.31), (0.03, 0.12), (-0.02, 0.01)]
fins = []
for side in (1, -1):
    pts = [(-x * L, side * y * L) for x, y in fin_out]
    f = obj(f"fin_{'l' if side > 0 else 'r'}", flat(f"fin{side}", pts, 0.012, BRASS), plates[1],
            loc=(-0.04 * L, side * 0.10 * L, -0.03 * L))
    fins.append((f, side))

# Flukes on the last plate.
fl_out = [(0.0, 0.0), (0.05, 0.10), (0.12, 0.17), (0.10, 0.10), (0.08, 0.0), (0.10, -0.10), (0.12, -0.17), (0.05, -0.10)]
flukes = obj("flukes", flat("flukes", [(-x * L, y * L) for x, y in fl_out], 0.012, COPPER), plates[-1],
             loc=(-(CUTS[-1] - CUTS[-2]) * L, 0, 0))

# Gear drums at three joints, half sunk into the flank.
gears = []
for i, (pl, r) in enumerate(((plates[2], 0.05), (plates[4], 0.04), (plates[6], 0.025))):
    w, _ = profile(CUTS[[2, 4, 6][i]])
    for side in (1, -1):
        g = obj(f"gear_{i}{'l' if side > 0 else 'r'}", gear(f"gear{i}{side}", r * L, 0.012, 12, IRON), pl,
                loc=(0, side * w * L * 0.98, 0), rot=(math.pi / 2, 0, 0))
        g.rotation_mode = "ZXY"   # Rx(90) then Rz spins the gear about its own axle
        gears.append((g, side))


def key(o, f, attr, idx, val):
    getattr(o, attr)[idx] = val
    o.keyframe_insert(data_path=attr, index=idx, frame=f)


AMP = [0.0, 0.03, 0.05, 0.07, 0.10, 0.14, 0.18, 0.24]   # pitch per joint (rad), growing to the tail
for f in range(0, LOOP + 1, 2):
    t = f / STROKE * 2 * math.pi
    lap = f / LOOP * 2 * math.pi
    key(pivot, f, "rotation_euler", 2, lap)
    key(root, f, "location", 0, 1.0)            # radius in build units; set per export by pivot scale
    key(root, f, "location", 2, 0.04 * math.sin(lap * 2))
    key(root, f, "rotation_euler", 2, math.pi / 2)   # head along the direction of travel
    key(root, f, "rotation_euler", 1, 0.05 * math.sin(t))
    for i, p in enumerate(plates):
        key(p, f, "rotation_euler", 1, AMP[i] * math.sin(t - i * 0.55))
    key(flukes, f, "rotation_euler", 1, 0.30 * math.sin(t - 8 * 0.55))
    for fin, side in fins:
        key(fin, f, "rotation_euler", 0, side * (-0.10 + 0.30 * math.sin(t + 1.2)))
    open_amt = max(0.0, math.sin(lap * 2)) ** 6
    key(jaw, f, "rotation_euler", 1, 0.35 * open_amt)
    for g, side in gears:
        key(g, f, "rotation_euler", 2, side * lap * 3)


def export(size, body_m, radius_m, height_m):
    s = body_m / L
    pivot.scale = (s, s, s)
    pivot.location = (0, 0, height_m)
    for f in range(0, LOOP + 1, 2):
        root.location[0] = radius_m / s
        root.keyframe_insert(data_path="location", index=0, frame=f)
    base = f"{OUT}/{TAG}-{size}"
    bpy.ops.export_scene.gltf(filepath=f"{base}.glb", export_format="GLB", export_animations=True,
                              export_frame_range=True, export_anim_single_armature=False,
                              export_force_sampling=True, export_yup=True)
    bpy.ops.wm.usd_export(filepath=f"{base}.usdz", export_animation=True, generate_preview_surface=True,
                          convert_orientation=True, export_global_forward_selection="NEGATIVE_Z",
                          export_global_up_selection="Y", convert_scene_units="METERS")
    print("EXPORTED", base)


export("toy", 0.5, 0.45, 0.30)
export("life", 14.0, 12.0, 4.0)
bpy.ops.wm.save_as_mainfile(filepath=f"{OUT}/{TAG}.blend")
