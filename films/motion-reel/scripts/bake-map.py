# bake-map.py: world land (world-atlas 110m) -> halftone dot grid for the map panel, plus city coordinates.
# Equirectangular, lon -170..180, lat -58..80, into a W x H box. Output: build/map-dots.json
import json, math
W, H, STEP = 1600, 760, 13
LON0, LON1, LAT0, LAT1 = -170, 180, -58, 80
topo = json.load(open('build/land-110m.json'))
sx, sy = topo['transform']['scale']; tx, ty = topo['transform']['translate']
arcs = []
for arc in topo['arcs']:
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy; pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)
def ring(idx):
    out = []
    for i in idx:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(a if not out else a[1:])
    return out
polys = []
for g in topo['objects']['land']['geometries']:
    ps = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
    for p in ps:
        # Unwrap each ring edge by edge so a ring crossing the antimeridian (Russia, Fiji) stays continuous past 180.
        rings = []
        for r in (ring(r) for r in p):
            out, shift = [r[0]], 0
            for (x0, _), (x1, y1) in zip(r, r[1:]):
                if x1 - x0 > 180: shift -= 360
                elif x0 - x1 > 180: shift += 360
                out.append((x1 + shift, y1))
            rings.append(out)
        polys.append(rings)
def inside(lon, lat, r):
    c = False; n = len(r)
    for i in range(n):
        x1, y1 = r[i]; x2, y2 = r[i - 1]
        if (y1 > lat) != (y2 > lat) and lon < (x2 - x1) * (lat - y1) / (y2 - y1) + x1: c = not c
    return c
def land(lon, lat):
    for p in polys:
        for L in (lon, lon + 360, lon - 360):
            if inside(L, lat, p[0]) and not any(inside(L, lat, h) for h in p[1:]): return True
    return False
proj = lambda lon, lat: ((lon - LON0) / (LON1 - LON0) * W, (LAT1 - lat) / (LAT1 - LAT0) * H)
dots = []
for j in range(0, H, STEP):
    for i in range(0, W, STEP):
        ox = (STEP / 2) if (j // STEP) % 2 else 0
        x = i + ox; y = j
        lon = LON0 + x / W * (LON1 - LON0); lat = LAT1 - y / H * (LAT1 - LAT0)
        if land(lon, lat): dots.append([round(x, 1), y])
# Globe dots: an even grid on the sphere (about 2.2 degrees apart), land only, as [lon, lat].
globe = []
lat = -56.0
while lat <= 80:
    stepLon = 2.2 / max(0.2, math.cos(math.radians(lat)))
    lon = -180.0 + (int(round(lat * 10)) % 7) * 0.1
    while lon < 180:
        if land(lon, lat): globe.append([round(lon, 2), round(lat, 2)])
        lon += stepLon
    lat += 2.2
cities = {'SFO': (-122.4, 37.8), 'NYC': (-74.0, 40.7), 'LDN': (-0.1, 51.5), 'CAI': (31.2, 30.0), 'TYO': (139.7, 35.7)}
json.dump({'w': W, 'h': H, 'step': STEP, 'dots': dots, 'globe': globe, 'cityLL': {k: list(v) for k, v in cities.items()}, 'cities': {k: [round(v, 1) for v in proj(*c)] for k, c in cities.items()}}, open('build/map-dots.json', 'w'))
print(len(dots), 'dots', {k: [round(v) for v in proj(*c)] for k, c in cities.items()})
