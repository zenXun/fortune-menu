#!/usr/bin/env python3
"""Generate icon.png using only stdlib. 192x192 PNG with simple shopping list look."""
import struct, zlib, math

W, H = 192, 192
BG = (0xA2, 0x9B, 0xD9)        # lavender
CARD = (0xFF, 0xFF, 0xFF)      # white
LINE = (0xC5, 0xB9, 0xE8)      # light lavender for list lines
ACCENT = (0xFF, 0xF0, 0xF5)    # lavenderblush
ACCENT_DOT = (0xB2, 0x5B, 0x7C)  # rosy

# Draw: lavender background + centered white rounded "card" + 3 list lines + small pink dot
cx, cy = W // 2, H // 2
card_w, card_h = 132, 132
card_r = 22

# list line specs: y_offset_from_card_top, length, height
lines = [
    (32, 80, 8),
    (54, 70, 8),
    (76, 50, 8),
]

# Small dot top-right of card
dot_cx = cx + 38
dot_cy = cy - 38
dot_r = 14

def in_rounded_rect(x, y, rx, ry, w, h, r):
    if abs(x - rx) > w / 2 or abs(y - ry) > h / 2:
        return False
    dx = abs(x - rx) - (w / 2 - r)
    dy = abs(y - ry) - (h / 2 - r)
    if dx <= 0 or dy <= 0:
        return True
    return (dx * dx + dy * dy) ** 0.5 <= r

def in_circle(x, y, ccx, ccy, cr):
    return (x - ccx) ** 2 + (y - ccy) ** 2 <= cr * cr

raw = bytearray()
card_left = cx - card_w // 2
card_top = cy - card_h // 2
for y in range(H):
    raw.append(0)  # filter
    for x in range(W):
        color = BG
        # accent dot (drawn topmost)
        if in_circle(x, y, dot_cx, dot_cy, dot_r):
            color = ACCENT_DOT
        elif in_rounded_rect(x, y, cx, cy, card_w, card_h, card_r):
            color = CARD
            # draw list lines on top of the card
            for (oy, llen, lh) in lines:
                ly = card_top + oy
                lx_start = card_left + 26
                lx_end = lx_start + llen
                if ly <= y < ly + lh and lx_start <= x < lx_end:
                    color = LINE
                    break
                # small checkbox circle on left of each line
                cb_cx = lx_start - 14
                cb_cy = ly + lh // 2
                if (x - cb_cx) ** 2 + (y - cb_cy) ** 2 <= 6 * 6:
                    if (x - cb_cx) ** 2 + (y - cb_cy) ** 2 >= 3 * 3:
                        color = LINE
                        break
        raw.extend(color)

ihdr = struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)
idat = zlib.compress(bytes(raw), 9)

def chunk(typ, data):
    return struct.pack(">I", len(data)) + typ + data + struct.pack(">I", zlib.crc32(typ + data))

png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
with open("icon.png", "wb") as f:
    f.write(png)
print("Wrote icon.png", len(png), "bytes")
