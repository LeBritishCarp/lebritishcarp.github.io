// src/ppu/mode0.js
export function renderMode0(mem, io, imageData) {
  const data    = imageData.data;
  const dispcnt = io.ppu.readDISPCNT();

  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 240; x++) {
      // default backdrop (palette 0, never transparent)
      let r = 0, g = 0, b = 0, a = 255;

      // draw BG0..BG3 in priority order (0→3)
      for (let n = 0; n < 4; n++) {
        if (!(dispcnt & (1 << (8 + n)))) continue; // BGn disabled

        const bgcnt    = io.ppu['BG' + n + 'CNT'];
        const scx      = (io.ppu['BG' + n + 'HOFS'] + x) & 0x1FF;
        const scy      = (io.ppu['BG' + n + 'VOFS'] + y) & 0x1FF;
        const size     = (bgcnt >>> 14) & 0x3;
        const mapW     = (size & 1) ? 64 : 32;
        const mapH     = (size & 2) ? 64 : 32;
        const baseMap  = 0x06000000 + ((bgcnt >>> 8) & 0x1F) * 0x800;
        const baseChar = 0x06000000 + ((bgcnt >>> 2) & 0x3) * 0x4000;
        const bpp      = ((bgcnt >>> 7) & 1) ? 8 : 4;

        const tx       = scx & 7, ty = scy & 7;
        const col      = scx >>> 3, row = scy >>> 3;
        const entry    = mem.read16(baseMap + 2 * (row * mapW + col));
        const tileNum  = entry & 0x3FF;
        const vflip    = (entry >>> 10) & 1;
        const hflip    = (entry >>> 11) & 1;
        const pal      = (entry >>> 12) & 0xF;
        const ix       = hflip ? 7 - tx : tx;
        const iy       = vflip ? 7 - ty : ty;

        let pix;
        if (bpp === 4) {
          const off  = baseChar + tileNum * 32 + iy * 4 + (ix >>> 1);
          const byte = mem.read8(off);
          pix = (ix & 1) ? (byte >>> 4) : (byte & 0xF);
          if (pix === 0) continue; // transparent
          const col16 = mem.read16(0x05000000 + pal * 32 + pix * 2);
          r = ((col16 & 0x1F) << 3) | ((col16 & 0x1F) >>> 2);
          g = (((col16 >>> 5) & 0x1F) << 3) | (((col16 >>> 5) & 0x1F) >>> 2);
          b = (((col16 >>> 10) & 0x1F) << 3) | (((col16 >>> 10) & 0x1F) >>> 2);
        } else {
          const off = baseChar + tileNum * 64 + iy * 8 + ix;
          pix = mem.read8(off);
          if (pix === 0) continue;
          const col16 = mem.read16(0x05000000 + pix * 2);
          r = ((col16 & 0x1F) << 3) | ((col16 & 0x1F) >>> 2);
          g = (((col16 >>> 5) & 0x1F) << 3) | (((col16 >>> 5) & 0x1F) >>> 2);
          b = (((col16 >>> 10) & 0x1F) << 3) | (((col16 >>> 10) & 0x1F) >>> 2);
        }
      }

      const idx = (y * 240 + x) * 4;
      data[idx] = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = a;
    }
  }
}
