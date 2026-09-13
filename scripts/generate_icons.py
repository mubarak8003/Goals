import zlib
import struct
import math
import os

def create_png(width, height, draw_fn, filepath):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_fn(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    compressed = zlib.compress(bytes(raw_data), 9)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b'IHDR', ihdr))
    png.extend(chunk(b'IDAT', compressed))
    png.extend(chunk(b'IEND', b''))
    
    with open(filepath, 'wb') as f:
        f.write(png)
    print(f"Generated {filepath} ({width}x{height})")

def draw_icon(x, y, w, h, maskable=False):
    # Center coords normalized -1 to 1
    nx = (x - w / 2) / (w / 2)
    ny = (y - h / 2) / (h / 2)
    dist = math.sqrt(nx * nx + ny * ny)

    # Base background: Deep Slate Blue #18232A
    bg_r, bg_g, bg_b = 0x18, 0x23, 0x2A

    # Gold Accent: #F5B041
    gold_r, gold_g, gold_b = 0xF5, 0xB0, 0x41
    # White
    w_r, w_g, w_b = 0xFF, 0xFF, 0xFF

    if not maskable:
        # Rounded squircle for non-maskable
        corner_limit = 0.95
        if abs(nx) > 0.98 or abs(ny) > 0.98:
            return (0, 0, 0, 0)
        # Smooth corner clipping
        corner_d = max(0, abs(nx) - 0.6) ** 2 + max(0, abs(ny) - 0.6) ** 2
        if corner_d > 0.12:
            return (0, 0, 0, 0)

    # Outer golden ring
    ring_radius = 0.65 if maskable else 0.72
    ring_thickness = 0.08
    if abs(dist - ring_radius) < ring_thickness:
        edge = abs(dist - ring_radius) / ring_thickness
        alpha = int(255 * max(0, 1 - edge * edge))
        return (gold_r, gold_g, gold_b, alpha)

    # Inner circular badge: #344B5A
    inner_radius = ring_radius - ring_thickness
    if dist < inner_radius:
        # Concentric rings / Target symbol for Goals
        target1 = 0.35
        if abs(dist - target1) < 0.05:
            return (gold_r, gold_g, gold_b, 255)
        # Center bullseye
        if dist < 0.18:
            return (gold_r, gold_g, gold_b, 255)
        # Inside inner badge
        return (0x28, 0x38, 0x44, 255)

    return (bg_r, bg_g, bg_b, 255)

os.makedirs('public', exist_ok=True)
create_png(192, 192, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/pwa-192x192.png')
create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/pwa-512x512.png')
create_png(512, 512, lambda x, y, w, h: draw_icon(x, y, w, h, True), 'public/pwa-maskable-512x512.png')
create_png(180, 180, lambda x, y, w, h: draw_icon(x, y, w, h, False), 'public/apple-touch-icon.png')
