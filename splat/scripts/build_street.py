# Assemble the gunfight main street from the Hunyuan meshes.
# usage: blender -b --factory-startup -P scripts/build_street.py -- <meshes_dir> <out.blend>
# Street runs along X, 16 m between the boardwalk edges. North row (+Y) faces -Y, south row faces +Y.
import bpy, sys, math, random
import bmesh
from mathutils import Vector, noise

argv = sys.argv[sys.argv.index("--") + 1:]
MESHES, OUT = argv[0], argv[1]
STREET_HALF = 8.0
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
lib = bpy.data.collections.new("library")
scene.collection.children.link(lib)
set_col = bpy.data.collections.new("set")
scene.collection.children.link(set_col)


def load(name):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f"{MESHES}/{name}-v01.glb")
    new = [o for o in bpy.data.objects if o not in before]
    mesh = next(o for o in new if o.type == "MESH")
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    bpy.context.view_layer.objects.active = mesh
    bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    for o in new:
        if o is not mesh:
            bpy.data.objects.remove(o, do_unlink=True)
    for c in mesh.users_collection:
        c.objects.unlink(mesh)
    lib.objects.link(mesh)
    mesh.name = name
    xs = [v.co.x for v in mesh.data.vertices]
    ys = [v.co.y for v in mesh.data.vertices]
    zs = [v.co.z for v in mesh.data.vertices]
    mesh["bbox"] = [min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)]
    return mesh


HEIGHTS = {
    "saloon-green": 8.5, "plaster-brick": 4.6, "timber-two-storey": 8.0, "parapet-front": 5.8,
    "low-store": 4.6, "tall-timber-front": 7.5, "trough-rail": 1.2, "water-tower": 11.0,
}
src = {name: load(name) for name in HEIGHTS}
lib.hide_render = True
bpy.context.view_layer.layer_collection.children["library"].exclude = True


def place(name, x_center, row, mirror=False, jitter=0.04, y_front=None, yaw=None):
    """Put an instance so its front edge sits on the boardwalk line of its row."""
    s_obj = src[name]
    x0, x1, y0, y1, z0, z1 = s_obj["bbox"]
    s = HEIGHTS[name] / (z1 - z0) * (1 + random.uniform(-jitter, jitter))
    o = bpy.data.objects.new(f"{name}.{len(set_col.objects):02d}", s_obj.data)
    set_col.objects.link(o)
    sx = -s if mirror else s
    o.scale = (sx, s, s)
    cx = (x0 + x1) / 2
    front = STREET_HALF if y_front is None else y_front
    if row > 0:
        o.rotation_euler = (0, 0, 0 if yaw is None else yaw)
        o.location = (x_center - sx * cx, front - s * y0, -s * z0)
    else:
        o.rotation_euler = (0, 0, math.pi if yaw is None else yaw)
        o.location = (x_center + sx * cx, -front + s * y0, -s * z0)
    return o, abs(sx) * (x1 - x0)


def row(names, sign, start):
    x = start
    for name, mirror in names:
        x0, x1 = src[name]["bbox"][:2]
        w = HEIGHTS[name] / (src[name]["bbox"][5] - src[name]["bbox"][4]) * (x1 - x0)
        place(name, x + w / 2, sign, mirror)
        x += w + random.uniform(0.4, 1.4)


row([("tall-timber-front", False), ("parapet-front", False), ("low-store", False), ("saloon-green", False),
     ("plaster-brick", False), ("timber-two-storey", False), ("low-store", True)], +1, -34.0)
row([("low-store", False), ("timber-two-storey", True), ("plaster-brick", True), ("parapet-front", True),
     ("tall-timber-front", True), ("low-store", True), ("parapet-front", False)], -1, -33.0)
place("trough-rail", 6.0, +1, y_front=6.2)
place("trough-rail", -12.0, -1, mirror=True, y_front=6.2)
place("water-tower", -22.0, -1, y_front=24.0)

# Terrain: flat dirt street out to ~55 m, rising into a ring of clay hills.
size, n = 360.0, 241
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=n - 1, y_segments=n - 1, size=size / 2)
for v in bm.verts:
    r = math.hypot(v.co.x, v.co.y)
    t = min(max((r - 55.0) / 70.0, 0.0), 1.0)
    t = t * t * (3 - 2 * t)
    h = noise.fractal(Vector((v.co.x / 70.0, v.co.y / 70.0, 0.3)), 0.6, 2.2, 5)
    v.co.z = t * (9.0 + 14.0 * (h + 0.5)) + 0.04 * noise.noise(Vector((v.co.x * 0.7, v.co.y * 0.7, 1.1)))
me = bpy.data.meshes.new("terrain")
bm.to_mesh(me)
bm.free()
for p in me.polygons:
    p.use_smooth = True
terrain = bpy.data.objects.new("terrain", me)
set_col.objects.link(terrain)

mat = bpy.data.materials.new("dirt")
mat.use_nodes = True
nt = mat.node_tree
bsdf = nt.nodes["Principled BSDF"]
bsdf.inputs["Roughness"].default_value = 0.95
geo = nt.nodes.new("ShaderNodeNewGeometry")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
nt.links.new(geo.outputs["Position"], sep.inputs[0])
hill = nt.nodes.new("ShaderNodeMapRange")
hill.inputs["From Min"].default_value = 1.0
hill.inputs["From Max"].default_value = 12.0
nt.links.new(sep.outputs["Z"], hill.inputs["Value"])
nz = nt.nodes.new("ShaderNodeTexNoise")
nz.inputs["Scale"].default_value = 0.35
nz.inputs["Detail"].default_value = 8.0
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.50, 0.40, 0.29, 1)
ramp.color_ramp.elements[1].color = (0.70, 0.60, 0.45, 1)
nt.links.new(nz.outputs["Fac"], ramp.inputs["Fac"])
mix = nt.nodes.new("ShaderNodeMix")
mix.data_type = "RGBA"
mix.inputs["B"].default_value = (0.74, 0.54, 0.36, 1)
nt.links.new(hill.outputs["Result"], mix.inputs["Factor"])
nt.links.new(ramp.outputs["Color"], mix.inputs["A"])
nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
pebble = nt.nodes.new("ShaderNodeTexVoronoi")
pebble.inputs["Scale"].default_value = 9.0
fine = nt.nodes.new("ShaderNodeTexNoise")
fine.inputs["Scale"].default_value = 3.0
fine.inputs["Detail"].default_value = 12.0
add = nt.nodes.new("ShaderNodeMath")
add.operation = "ADD"
nt.links.new(pebble.outputs["Distance"], add.inputs[0])
nt.links.new(fine.outputs["Fac"], add.inputs[1])
bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.35
nt.links.new(add.outputs["Value"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
me.materials.append(mat)

# Golden hour: low warm sun raking across the north row's fronts from the -Y side.
sun_data = bpy.data.lights.new("sun", "SUN")
sun_data.energy = 9.0
sun_data.color = (1.0, 0.60, 0.32)
sun_data.angle = math.radians(1.2)
sun = bpy.data.objects.new("sun", sun_data)
set_col.objects.link(sun)
elev, azim = math.radians(20.0), math.radians(-35.0)
direction = Vector((math.sin(azim) * math.cos(elev), -math.cos(azim) * math.cos(elev), math.sin(elev)))
sun.rotation_euler = (-direction).to_track_quat("-Z", "Y").to_euler()

world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.62, 0.66, 0.78, 1)
bg.inputs["Strength"].default_value = 0.32

scene.render.engine = "CYCLES"
scene.cycles.device = "GPU"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = True
scene.cycles.samples = 64
scene.cycles.adaptive_threshold = 0.02
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.sample_clamp_indirect = 8.0
scene.render.film_transparent = True
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Punchy"
scene.view_settings.exposure = -0.3
scene.render.resolution_x, scene.render.resolution_y = 1600, 900
bpy.ops.wm.save_as_mainfile(filepath=OUT)
print("SAVED", OUT, len(set_col.objects), "objects")
