import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('data/anime_update_drafts/library-audit-2026-10-13/visual-audit-round23')
items = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
font_path = Path('C:/Windows/Fonts/msyh.ttc')
font = ImageFont.truetype(str(font_path), 15) if font_path.exists() else ImageFont.load_default()
small = ImageFont.truetype(str(font_path), 13) if font_path.exists() else ImageFont.load_default()
cols, per_sheet, card_w, card_h = 4, 20, 260, 310

for start in range(0, len(items), per_sheet):
    page = Image.new('RGB', (cols * card_w, 5 * card_h), '#f3f3f3')
    draw = ImageDraw.Draw(page)
    for position, item in enumerate(items[start:start + per_sheet]):
        x = position % cols * card_w
        y = position // cols * card_h
        image_path = root / f"{item['id']}.img"
        try:
            with Image.open(image_path) as source:
                source = source.convert('RGB')
                source.thumbnail((244, 244))
                page.paste(source, (x + (card_w - source.width) // 2, y + 3))
        except Exception:
            draw.text((x + 8, y + 100), 'IMAGE UNAVAILABLE', font=font, fill='#b00020')
        name = str(item['name'])[:12]
        anime = str(item['anime'])[:16]
        traits = '；'.join(item['colorTraits'])[:24] or '无颜色特征标签'
        draw.text((x + 6, y + 250), f"{item['id']} {name}", font=font, fill='#111111')
        draw.text((x + 6, y + 274), anime, font=small, fill='#333333')
        draw.text((x + 6, y + 292), traits, font=small, fill='#a00020')
    out = root / f"sheet-{start // per_sheet + 1:02d}.jpg"
    page.save(out, quality=92)
    print(out)
