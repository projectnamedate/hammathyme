# Hero loop for the site: the life-size skinned whale from whale_rig.py, swimming its lap in open water.
# usage: blender -b <humpback-skin-vNN.blend> -P ar/whale/render_loop.py -- <frames_dir> [--preview]
# Renders frames 0..LOOP-1; frame LOOP equals frame 0, so the video loops without a seam.
import bpy, sys, math, os, random
import bmesh

argv = sys.argv[sys.argv.index("--") + 1:]
OUT = argv[0]
PREVIEW = "--preview" in argv
os.makedirs(OUT, exist_ok=True)
random.seed(4)

sc = bpy.context.scene
pivot, swim = bpy.data.objects["pivot"], bpy.data.objects["swim"]
radius = swim.location[0]   # pivot-local units; the pivot carries the 15 m scale

sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x, sc.render.resolution_y = (960, 540) if PREVIEW else (1920, 1080)
sc.render.image_settings.file_format = "PNG"
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"
sc.eevee.taa_render_samples = 16 if PREVIEW else 64

# Open water. No world volume: Eevee treats it as infinite and it absorbs the background to black.
world = bpy.data.worlds.new("water")
sc.world = world
world.use_nodes = True
nt = world.node_tree
nt.nodes["Background"].inputs["Color"].default_value = (0.03, 0.17, 0.26, 1)
nt.nodes["Background"].inputs["Strength"].default_value = 1.4

sun = bpy.data.objects.new("sun", bpy.data.lights.new("sun", "SUN"))
sun.data.energy = 3.2
sun.data.color = (0.86, 0.95, 1.0)
sun.data.angle = math.radians(8)
sun.rotation_euler = (math.radians(12), math.radians(-8), 0)
sc.collection.objects.link(sun)
# Light scattered back up from deeper water, so the belly is not lost against the blue.
fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "SUN"))
fill.data.energy = 0.8
fill.data.color = (0.45, 0.75, 0.9)
fill.rotation_euler = (math.radians(170), 0, 0)
sc.collection.objects.link(fill)

# Marine snow fixed in the world, so it streams past the moving camera.
bm = bmesh.new()
for _ in range(900):
    a = random.uniform(0, 2 * math.pi)
    r = random.uniform(4, 22) / 15
    z = random.uniform(-0.25, 0.45)
    s = random.uniform(0.0005, 0.002)   # 7-30 mm once the pivot scale applies
    m = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=s)
    bmesh.ops.translate(bm, verts=m["verts"], vec=(r * math.cos(a), r * math.sin(a), z))
snow_me = bpy.data.meshes.new("snow")
bm.to_mesh(snow_me)
bm.free()
snow_mat = bpy.data.materials.new("snow")
snow_mat.use_nodes = True
em = snow_mat.node_tree.nodes["Principled BSDF"]
em.inputs["Base Color"].default_value = (0.85, 0.93, 1.0, 1)
em.inputs["Emission Color"].default_value = (0.7, 0.85, 1.0, 1)
em.inputs["Emission Strength"].default_value = 0.6
snow_me.materials.append(snow_mat)
snow = bpy.data.objects.new("snow", snow_me)
sc.collection.objects.link(snow)
snow.scale = pivot.scale
snow.location = pivot.location

# Camera rides the lap (not the body), ahead on the whale's right and just below it, so the whole
# animal passes through frame.
aim = bpy.data.objects.new("aim", None)
sc.collection.objects.link(aim)
aim.parent = pivot
aim.location = (radius, 0.0, 0.0)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
sc.collection.objects.link(cam)
cam.parent = pivot
cam.location = (radius + 0.8, 0.62, -0.06)
cam.data.lens = 28
cam.data.clip_end = 400
track = cam.constraints.new("TRACK_TO")
track.target = aim
track.track_axis = "TRACK_NEGATIVE_Z"
track.up_axis = "UP_Y"
sc.camera = cam

loop = sc.frame_end
frames = range(0, loop, 24) if PREVIEW else range(0, loop)
for f in frames:
    sc.frame_set(f)
    sc.render.filepath = f"{OUT}/f{f:04d}.png"
    bpy.ops.render.render(write_still=True)
print("RENDERED", len(frames), "frames to", OUT)
