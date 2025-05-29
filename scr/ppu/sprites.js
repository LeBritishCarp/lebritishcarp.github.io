// src/ppu/sprites.js
export function renderSprites(mem, io, imageData) {
  const data        = imageData.data;
  const paletteBG   = 0x05000000; // BG palette base
  const paletteOBJ  = 0x05000200; // OBJ palette base
  const vramBase    = 0x06000000; // VRAM base for tiles

  for (let i = 0; i < 128; i++) {
    const oamBase = 0x07000000 + i * 8;
    const attr0   = mem.read16(oamBase);
    const attr1   = mem.read16(oamBase + 2);
    const attr2   = mem.read16(oamBase + 4);

    const y = attr0 & 0xFF;
    if (y >= 160) continue; // off-screen

    // skip rotated/scaled sprites for now
    if (attr0 & (1 << 8)) continue;

    const color256 = !!(attr0 & (1 << 9)); // 0=4bpp,1=8bpp
    const shape    = (attr0 >>> 14) & 0x3;
    const size     = (attr1 >>> 14) & 0x3;
    // only support square-size=0 (8×8)
    if (shape !== 0 || size !== 0) continue;

    const x = attr1 & 0x1FF;
    if (x >= 240) continue;

    const tileNum = attr2 & 0x3FF;
    const palBank = (attr2 >>> 12) & 0xF;

    // flipping
    const hflip = !!(attr1 & (1 << 13));
    const vflip = !!(attr1 & (1 << 12));

    const tileSize = color256 ? 64 : 32; // bytes per 8×8 tile
    const tileBase = vramBase + tileNum * tileSize;

    for (let py = 0; py < 8; py++) {
      const sy = y + py;
      if (sy < 0 || sy >= 160) continue;
      for (let px = 0; px < 8; px++) {
        const sx = x + px;
        if (sx < 0 || sx >= 240) continue;

        // compute tile pixel coords
        const tx = hflip ? 7 - px : px;
        const ty = vflip ? 7 - py : py;

        let pix;
        if (color256) {
          pix = mem.read8(tileBase + ty * 8 + tx);
          if (pix === 0) continue;
          var col16 = mem.read16(paletteOBJ + pix * 2);
        } else {
          const off = tileBase + ty * 4 + (tx >>> 1);
          const b   = mem.read8(off);
          pix = (tx & 1) ? (b >>> 4) : (b & 0xF);
          if (pix === 0) continue;
          var col16 = mem.read16(paletteOBJ + (palBank * 16 + pix) * 2);
        }

        const r = ((col16 & 0x1F) << 3) | ((col16 & 0x1F) >>> 2);
        const g = (((col16 >>> 5) & 0x1F) << 3) | (((col16 >>> 5) & 0x1F) >>> 2);
        const b = (((col16 >>> 10) & 0x1F) << 3) | (((col16 >>> 10) & 0x1F) >>> 2);

        const idx = (sy * 240 + sx) * 4;
        data[idx]   = r;
        data[idx+1] = g;
        data[idx+2] = b;
        data[idx+3] = 255;
      }
    }
  }
}
