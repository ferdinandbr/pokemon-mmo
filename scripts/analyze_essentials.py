import os
import struct
from rubymarshal.reader import load

DATA_DIR = r"E:\Pokemon Essentials v17.2 - Kanto by DefaKS\Data"
GRAPHICS_DIR = r"E:\Pokemon Essentials v17.2 - Kanto by DefaKS\Graphics"

# Load Tilesets
with open(os.path.join(DATA_DIR, "Tilesets.rxdata"), "rb") as f:
    tilesets = load(f)

tileset_info = {}
for ts in tilesets:
    if not ts:
        continue
    tid = ts.attributes.get("@id")
    name = ts.attributes.get("@name").decode("utf-8", errors="ignore")
    img = ts.attributes.get("@tileset_name").decode("utf-8", errors="ignore")
    autotiles = [a.decode("utf-8", errors="ignore") for a in ts.attributes.get("@autotile_names", []) if a]
    
    # Passages table
    passages = ts.attributes.get("@passages")
    passages_raw = passages._private_data if passages else None
    
    # Priorities table
    priorities = ts.attributes.get("@priorities")
    priorities_raw = priorities._private_data if priorities else None
    
    tileset_info[tid] = {
        "name": name,
        "img": img,
        "autotiles": autotiles,
        "passages_len": len(passages_raw) if passages_raw else 0,
        "priorities_len": len(priorities_raw) if priorities_raw else 0
    }

print("=== TILESETS ===")
for tid, tinfo in tileset_info.items():
    print(f"ID {tid:2d}: {tinfo['name']:25s} | Image: {tinfo['img']:25s} | Autotiles: {tinfo['autotiles']}")

# Load MapInfos
with open(os.path.join(DATA_DIR, "MapInfos.rxdata"), "rb") as f:
    map_infos = load(f)

target_maps = [2, 5, 32, 42, 45, 46, 49, 50]
print("\n=== SELECTED MAPS ===")
for mid in target_maps:
    info = map_infos.get(mid)
    map_name = info.attributes["@name"].decode("utf-8", errors="ignore") if info else "Unknown"
    
    map_file = os.path.join(DATA_DIR, f"Map{mid:03d}.rxdata")
    if not os.path.exists(map_file):
        print(f"Map {mid:03d} ({map_name}): FILE NOT FOUND")
        continue
        
    with open(map_file, "rb") as f:
        m = load(f)
    
    w = m.attributes["@width"]
    h = m.attributes["@height"]
    tid = m.attributes["@tileset_id"]
    t_name = tileset_info.get(tid, {}).get("name", "Unknown")
    t_img = tileset_info.get(tid, {}).get("img", "Unknown")
    
    events = m.attributes.get("@events", {})
    transfers = []
    npcs = []
    
    for eid, ev in events.items():
        ename = ev.attributes.get("@name", b"").decode("utf-8", errors="ignore")
        ex = ev.attributes.get("@x")
        ey = ev.attributes.get("@y")
        
        for page in ev.attributes.get("@pages", []):
            # Check graphic
            graphic = page.attributes.get("@graphic")
            char_name = ""
            if graphic:
                cname = graphic.attributes.get("@character_name", b"")
                if isinstance(cname, bytes):
                    char_name = cname.decode("utf-8", errors="ignore")
            
            for cmd in page.attributes.get("@list", []):
                code = cmd.attributes.get("@code")
                params = cmd.attributes.get("@parameters", [])
                if code == 201: # Transfer Player
                    # params: [0, target_map_id, target_x, target_y, direction, fade]
                    target_map_id = params[1]
                    target_x = params[2]
                    target_y = params[3]
                    target_name = map_infos.get(target_map_id).attributes["@name"].decode("utf-8", errors="ignore") if map_infos.get(target_map_id) else f"Map {target_map_id}"
                    transfers.append({
                        "event_id": eid,
                        "name": ename,
                        "from": (ex, ey),
                        "to_map": target_map_id,
                        "to_map_name": target_name,
                        "to_pos": (target_x, target_y)
                    })
            if char_name:
                npcs.append({
                    "event_id": eid,
                    "name": ename,
                    "pos": (ex, ey),
                    "sprite": char_name
                })
                
    print(f"\nMap {mid:03d}: '{map_name}' | Size: {w}x{h} tiles ({w*32}x{h*32}px) | Tileset: {t_name} ({t_img})")
    print(f"  Warps / Transfers ({len(transfers)}):")
    for t in transfers:
        print(f"    - Event '{t['name']}' at ({t['from'][0]}, {t['from'][1]}) -> {t['to_map_name']} (ID {t['to_map']}) at ({t['to_pos'][0]}, {t['to_pos'][1]})")
    if npcs:
        print(f"  NPCs / Sprites ({len(npcs)}):")
        for npc in npcs[:6]:
            print(f"    - Event '{npc['name']}' at ({npc['pos'][0]}, {npc['pos'][1]}) sprite: {npc['sprite']}")
