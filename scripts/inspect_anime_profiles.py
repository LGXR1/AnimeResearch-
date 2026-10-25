"""Create local contact sheets of source portraits for visual fact checking."""
import json
import math
import sys
import time
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

root = Path('data/anime_update_drafts/profile_images')
root.mkdir(parents=True, exist_ok=True)
for media_id in sys.argv[1:]:
    source = json.loads(Path(f'data/anime_update_drafts/anime-source-{media_id}.json').read_text(encoding='utf-8'))
    entries = [e['node'] for e in source['characters'] if e['node']['image']['large'] and e.get('role') != 'BACKGROUND']
    for start in range(0, len(entries), 18):
        page = entries[start:start + 18]
        sheet = Image.new('RGB', (6 * 190, math.ceil(len(page) / 6) * 240), '#eeeeee')
        draw = ImageDraw.Draw(sheet)
        for offset, node in enumerate(page):
            target = root / f"inspect-{node['id']}.png"
            if not target.exists():
                time.sleep(0.8)
                request = urllib.request.Request(node['image']['large'], headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(request, timeout=25) as response:
                    target.write_bytes(response.read())
            with Image.open(target) as img:
                thumb = ImageOps.contain(img.convert('RGB'), (182, 205))
                x, y = (offset % 6) * 190, (offset // 6) * 240
                sheet.paste(thumb, (x + (190 - thumb.width) // 2, y))
                draw.text((x + 4, y + 208), str(node['id']), fill='black')
                draw.text((x + 4, y + 222), node['name']['full'], fill='black')
        output = root / f'contact-{media_id}-{start // 18 + 1}.jpg'
        sheet.save(output, quality=95)
        print(output, flush=True)
