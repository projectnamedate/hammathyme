from pathlib import Path
import json
import math

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public" / "work" / "vfx-cgi" / "blender-lookdev-pipeline"
ASSET_PATH = PUBLIC_DIR / "source-asset.glb"

VARIANTS = [
    {
        "slug": "variant-01-cinnamon",
        "label": "cinnamon ceramic",
        "base": (0.95, 0.36, 0.31, 1.0),
        "metallic": 0.0,
        "roughness": 0.32,
        "key": (1.0, 0.78, 0.68),
        "world": (0.82, 0.70, 0.64),
    },
    {
        "slug": "variant-02-graphite",
        "label": "graphite metal",
        "base": (0.035, 0.032, 0.034, 1.0),
        "metallic": 0.82,
        "roughness": 0.22,
        "key": (0.72, 0.80, 1.0),
        "world": (0.10, 0.09, 0.11),
    },
    {
        "slug": "variant-03-cream",
        "label": "warm cream",
        "base": (0.98, 0.89, 0.84, 1.0),
        "metallic": 0.0,
        "roughness": 0.58,
        "key": (1.0, 0.86, 0.74),
        "world": (0.95, 0.86, 0.80),
    },
    {
        "slug": "variant-04-bloodlust",
        "label": "bloodlust lacquer",
        "base": (0.35, 0.11, 0.10, 1.0),
        "metallic": 0.0,
        "roughness": 0.18,
        "key": (1.0, 0.62, 0.54),
        "world": (0.22, 0.08, 0.07),
    },
    {
        "slug": "variant-05-chrome",
        "label": "polished chrome",
        "base": (0.82, 0.82, 0.78, 1.0),
        "metallic": 1.0,
        "roughness": 0.12,
        "key": (0.80, 0.92, 1.0),
        "world": (0.52, 0.48, 0.44),
    },
    {
        "slug": "variant-06-clay",
        "label": "production clay",
        "base": (0.62, 0.42, 0.35, 1.0),
        "metallic": 0.0,
        "roughness": 0.72,
        "key": (1.0, 0.72, 0.58),
        "world": (0.70, 0.56, 0.50),
    },
]


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)


def enable_gltf():
    try:
        bpy.ops.preferences.addon_enable(module="io_scene_gltf2")
    except Exception:
        pass


def set_principled_input(shader, name, value):
    if name in shader.inputs:
        shader.inputs[name].default_value = value


def material(name, base, metallic, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        set_principled_input(bsdf, "Base Color", base)
        set_principled_input(bsdf, "Metallic", metallic)
        set_principled_input(bsdf, "Roughness", roughness)
    return mat


def make_source_asset():
    reset_scene()
    enable_gltf()
    mat = material("source matte", (0.8, 0.78, 0.72, 1.0), 0.0, 0.45)

    bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, 1.0))
    body = bpy.context.object
    body.name = "imported_hero_body"
    body.dimensions = (2.4, 0.64, 1.8)
    body.data.materials.append(mat)
    bevel = body.modifiers.new("wide bevel", "BEVEL")
    bevel.width = 0.12
    bevel.segments = 8
    body.modifiers.new("weighted normals", "WEIGHTED_NORMAL")

    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=64,
        ring_count=32,
        radius=0.42,
        location=(-0.68, -0.38, 1.48),
    )
    dot = bpy.context.object
    dot.name = "imported_cinnamon_dot"
    dot.scale.z = 0.22
    dot.data.materials.append(mat)
    dot.modifiers.new("dot normals", "WEIGHTED_NORMAL")

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.58, -0.38, 1.08))
    fin = bpy.context.object
    fin.name = "imported_offset_fin"
    fin.dimensions = (0.32, 0.28, 1.25)
    fin.rotation_euler[2] = math.radians(-9)
    fin.data.materials.append(mat)
    fin.modifiers.new("fin bevel", "BEVEL").width = 0.05
    fin.modifiers.new("fin normals", "WEIGHTED_NORMAL")

    bpy.ops.export_scene.gltf(filepath=str(ASSET_PATH), export_format="GLB")


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def set_camera():
    bpy.ops.object.camera_add(location=(4.4, -5.2, 3.0), rotation=(0, 0, 0))
    cam = bpy.context.object
    look_at(cam, (0, 0, 1.0))
    cam.data.lens = 58
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 6.0
    cam.data.dof.aperture_fstop = 5.6
    bpy.context.scene.camera = cam


def set_lighting(variant):
    if bpy.context.scene.world is None:
        bpy.context.scene.world = bpy.data.worlds.new("lookdev_world")
    bpy.context.scene.world.color = variant["world"][:3]

    bpy.ops.object.light_add(type="AREA", location=(-3.5, -4.0, 5.2))
    key = bpy.context.object
    key.name = "key_area"
    key.data.energy = 620
    key.data.size = 4.8
    key.data.color = variant["key"]

    bpy.ops.object.light_add(type="POINT", location=(3.4, 2.6, 2.8))
    rim = bpy.context.object
    rim.name = "rim_point"
    rim.data.energy = 115
    rim.data.color = (1.0, 0.48, 0.43)

    bpy.ops.object.light_add(type="AREA", location=(0, 3.8, 1.4))
    fill = bpy.context.object
    fill.name = "front_fill"
    fill.data.energy = 70
    fill.data.size = 5.5


def set_render():
    scene = bpy.context.scene
    engines = {item.identifier for item in scene.render.bl_rna.properties["engine"].enum_items}
    scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in engines else "BLENDER_EEVEE"
    if hasattr(scene, "eevee"):
        scene.eevee.taa_render_samples = 64
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "Filmic"
    scene.view_settings.look = "Medium High Contrast"
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0


def render_variant(variant):
    reset_scene()
    enable_gltf()
    bpy.ops.import_scene.gltf(filepath=str(ASSET_PATH))

    mat = material(variant["label"], variant["base"], variant["metallic"], variant["roughness"])
    accent = material("cinnamon accent", (0.95, 0.36, 0.31, 1.0), 0.0, 0.28)
    floor_mat = material("warm studio floor", (0.98, 0.90, 0.86, 1.0), 0.0, 0.62)

    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.data.materials.clear()
            obj.data.materials.append(accent if "dot" in obj.name else mat)

    bpy.ops.mesh.primitive_plane_add(size=7.0, location=(0, 0, 0))
    floor = bpy.context.object
    floor.name = "matte_studio_floor"
    floor.data.materials.append(floor_mat)

    set_lighting(variant)
    set_camera()
    set_render()

    out_path = PUBLIC_DIR / f"{variant['slug']}.png"
    bpy.context.scene.render.filepath = str(out_path)
    bpy.ops.render.render(write_still=True)
    return str(out_path.relative_to(ROOT))


def main():
    make_source_asset()
    outputs = [render_variant(variant) for variant in VARIANTS]
    manifest = {
        "tool": "Blender",
        "version": bpy.app.version_string,
        "source_asset": str(ASSET_PATH.relative_to(ROOT)),
        "outputs": outputs,
        "variants": [{"slug": variant["slug"], "label": variant["label"]} for variant in VARIANTS],
    }
    (PUBLIC_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


if __name__ == "__main__":
    main()
