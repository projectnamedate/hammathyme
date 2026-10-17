"""Cut the welded Hunyuan hero into a torso and two lower legs so the game can walk it without a rig.
Below z = CUT the legs stand apart (no vertices near x = 0), so a plane cut there and a split at x = 0 separate them.
Each leg's origin goes to the top centre of the leg (the knee), where the game swings it.
Usage: blender -b --python-exit-code 1 -P split_hero.py -- in.glb out.glb"""
import bpy, bmesh, sys
from mathutils import Vector

CUT = 0.17
src, dst = sys.argv[sys.argv.index("--") + 1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
hero = [o for o in bpy.context.scene.objects if o.type == "MESH"][0]
bpy.context.view_layer.objects.active = hero
hero.select_set(True)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def keep(obj, test):
    """Delete every face whose centre fails `test`, after slicing along the cut planes."""
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, CUT), plane_no=(0, 0, 1))
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, 0), plane_no=(1, 0, 0))
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if not test(f.calc_center_median())], context="FACES")
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    bm.to_mesh(obj.data)
    bm.free()


def copy(name):
    o = hero.copy()
    o.data = hero.data.copy()
    o.name = name
    bpy.context.collection.objects.link(o)
    return o


leg_l, leg_r = copy("legL"), copy("legR")
keep(leg_l, lambda c: c.z < CUT and c.x < 0)
keep(leg_r, lambda c: c.z < CUT and c.x >= 0)
keep(hero, lambda c: c.z >= CUT)
hero.name = "torso"

for leg in (leg_l, leg_r):
    vs = [leg.matrix_world @ v.co for v in leg.data.vertices]
    knee = Vector(((min(v.x for v in vs) + max(v.x for v in vs)) / 2, (min(v.y for v in vs) + max(v.y for v in vs)) / 2, CUT))
    bpy.context.scene.cursor.location = knee
    bpy.ops.object.select_all(action="DESELECT")
    leg.select_set(True)
    bpy.context.view_layer.objects.active = leg
    bpy.ops.object.origin_set(type="ORIGIN_CURSOR")
    print("LEG", leg.name, "faces", len(leg.data.polygons), "knee", [round(k, 3) for k in knee])
print("TORSO faces", len(hero.data.polygons))

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=dst, export_format="GLB", export_image_format="JPEG", export_yup=True, use_selection=True)
