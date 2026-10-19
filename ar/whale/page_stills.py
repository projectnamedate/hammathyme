# Step images for the site: the raw Hunyuan mesh, and the rigged whale mid-stroke with its bones drawn on.
# usage: blender -b <humpback-skin-vNN.blend> -P ar/whale/page_stills.py -- <mesh.glb> <out_dir>
import bpy, sys, math, os
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--") + 1:]
MESH, OUT = argv[0], argv[1]
os.makedirs(OUT, exist_ok=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sc.view_settings.view_transform = "AgX"


def studio(color):
    w = bpy.data.worlds.new("studio")
    sc.world = w
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (*color, 1)
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0
    key = bpy.data.objects.new("key", bpy.data.lights.new("key", "SUN"))
    key.data.energy = 3.5
    key.rotation_euler = (math.radians(35), 0, math.radians(30))
    sc.collection.objects.link(key)


def camera(loc, target, lens):
    cam = bpy.data.objects.new("still_cam", bpy.data.cameras.new("still_cam"))
    sc.collection.objects.link(cam)
    cam.data.lens = lens
    cam.location = loc
    cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    return cam


# 03: the rig, mid-stroke, from the whale's left side.
studio((0.62, 0.66, 0.70))
sc.frame_set(85)
swim, arm = bpy.data.objects["swim"], bpy.data.objects["rig"]
c = swim.matrix_world.translation
side = (swim.matrix_world.to_3x3() @ Vector((0, 1, 0))).normalized()   # matrix carries the 15x scale
cam = camera(c + side * 26 + Vector((0, 0, 1.5)), c, 50)
sc.render.filepath = f"{OUT}/rig-base.png"
bpy.ops.render.render(write_still=True)
pts = []
for b in arm.pose.bones:
    for p in (b.head, b.tail):
        q = world_to_camera_view(sc, cam, arm.matrix_world @ p)
        pts.append((b.name, round(q.x * 1280), round((1 - q.y) * 720)))
with open(f"{OUT}/rig-bones.txt", "w") as f:
    for i in range(0, len(pts), 2):
        f.write(f"{pts[i][0]} {pts[i][1]} {pts[i][2]} {pts[i + 1][1]} {pts[i + 1][2]}\n")

# 02: the raw Hunyuan mesh as it came back, three-quarter studio view.
for o in list(sc.objects):
    o.hide_render = True
bpy.ops.import_scene.gltf(filepath=MESH)
raw = [o for o in sc.objects if o.type == "MESH" and not o.hide_render][0]
raw.location = (0, 0, 0)
dims = raw.dimensions
size = max(dims)
raw.scale = (1 / size,) * 3
bpy.context.view_layer.update()
centre = sum((raw.matrix_world @ Vector(v) for v in raw.bound_box), Vector()) / 8
studio((0.55, 0.57, 0.6))
camera(centre + Vector((0.62, -1.55, 0.5)), centre, 50)
sc.render.filepath = f"{OUT}/mesh.png"
bpy.ops.render.render(write_still=True)
print("STILLS", OUT)
