import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('data/anime_update_drafts/library-audit-2026-10-13/visual-audit-tmp')
items = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
font_path = Path('C:/Windows/Fonts/msyh.ttc')
font = ImageFont.truetype(str(font_path), 15) if font_path.exists() else ImageFont.load_default()
cols, per_sheet, card_w, card_h = 4, 20, 235, 260
for start in range(0, len(items), per_sheet):
    page = Image.new('RGB', (cols * card_w, 5 * card_h), '#f3f3f3')
    draw = ImageDraw.Draw(page)
    for position, item in enumerate(items[start:start + per_sheet]):
        x = position % cols * card_w
        y = position // cols * card_h
        try:
            with Image.open(root / f"{item['id']}.img") as source:
                source = source.convert('RGB')
                source.thumbnail((220, 205))
                page.paste(source, (x + (card_w - source.width) // 2, y + 4))
        except Exception:
            draw.text((x + 8, y + 85), 'IMAGE UNAVAILABLE', font=font, fill='#b00020')
        draw.text((x + 6, y + 211), f"{item['id']} {item['name'][:8]}", font=font, fill='#111111')
        draw.text((x + 6, y + 233), ','.join(item['colorTraits'])[:25], font=font, fill='#b00020')
    file = root / f'sheet-{start // per_sheet + 1:02d}.jpg'
    page.save(file, quality=91)
    print(file)
