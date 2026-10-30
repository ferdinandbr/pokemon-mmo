import os
from PIL import Image
from collections import deque

output_dir = os.path.abspath('client/public/assets/battle/icons/moves')
os.makedirs(output_dir, exist_ok=True)

sheets = [
    ('media_1793291079446_cbec852f.jpg', ['normal', 'fighting', 'grass']),
    ('media_1793291156669_bee85cba.jpg', ['psychic', 'fire', 'water']),
    ('media_1793291198236_e4287ccb.jpg', ['bug', 'electric', 'dark']),
    ('media_1793291222715_2229530a.jpg', ['poison', 'flying', 'ground']),
    ('media_1793291236734_1c24f152.jpg', ['ice', 'steel', 'rock']),
    ('media_1793304672705_9896f00b.jpg', ['ghost', 'dragon', 'fairy'])
]

categories = ['dash', 'projectile', 'beam', 'status']

def find_intervals(flags):
    intervals = []
    in_block = False
    start = 0
    for i, f in enumerate(flags):
        if f and not in_block:
            in_block = True
            start = i
        elif not f and in_block:
            in_block = False
            intervals.append((start, i - 1))
    if in_block:
        intervals.append((start, len(flags) - 1))
    return intervals

def make_corners_transparent(img_crop, threshold=225):
    rgba = img_crop.convert('RGBA')
    w, h = rgba.size
    pix = rgba.load()
    visited = set()
    queue = deque()
    
    for start in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        r, g, b, a = pix[start]
        if r >= threshold and g >= threshold and b >= threshold:
            queue.append(start)
            visited.add(start)
            
    while queue:
        cx, cy = queue.popleft()
        pix[cx, cy] = (0, 0, 0, 0)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pix[nx, ny]
                if r >= threshold and g >= threshold and b >= threshold:
                    visited.add((nx, ny))
                    queue.append((nx, ny))
    return rgba

count = 0
for filename, types in sheets:
    path = os.path.join(r'C:/Users/fer/.gemini/antigravity/brain/808f643f-f1d0-4554-a795-2b40d2af7fd6/.user_uploaded', filename)
    im = Image.open(path).convert('RGB')
    w, h = im.size
    
    row_flags = [False] * h
    for y in range(h):
        for x in range(0, w, 2):
            r, g, b = im.getpixel((x, y))
            if not (r > 235 and g > 235 and b > 235):
                row_flags[y] = True
                break
                
    col_flags = [False] * w
    for x in range(w):
        for y in range(0, h, 2):
            r, g, b = im.getpixel((x, y))
            if not (r > 235 and g > 235 and b > 235):
                col_flags[x] = True
                break
                
    y_ints = find_intervals(row_flags)
    x_ints = find_intervals(col_flags)
    
    for r_idx, type_name in enumerate(types):
        y0, y1 = y_ints[r_idx]
        for c_idx, cat_name in enumerate(categories):
            x0, x1 = x_ints[c_idx]
            crop = im.crop((x0, y0, x1 + 1, y1 + 1))
            rgba = make_corners_transparent(crop)
            
            # Resize to standardized square 128x128
            resized = rgba.resize((128, 128), Image.Resampling.LANCZOS)
            
            # Save standard file
            out_file = os.path.join(output_dir, f"{type_name}_{cat_name}.png")
            resized.save(out_file, "PNG")
            
            # If cat_name is status, also save buff alias
            if cat_name == 'status':
                buff_file = os.path.join(output_dir, f"{type_name}_buff.png")
                resized.save(buff_file, "PNG")
                
            count += 1

print(f"Successfully exported {count} move icons to {output_dir}")

