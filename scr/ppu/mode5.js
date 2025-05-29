// src/ppu/mode5.js
export function renderMode5(mem, io, imageData) {
  const data    = imageData.data;
  const dispcnt = io.ppu.readDISPCNT();
  const page    = (dispcnt >>> 4) & 1;
  const base    = 0x06000000 + page * 0x20000; // page size = 128KB

  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 240; x++) {
      let r = 0, g = 0, b = 0;
      if (y < 128 && x < 160) {
        const idx   = y * 160 + x;
        const palIx = mem.read8(base + idx);
        const col16 = mem.read16(0x05000000 + palIx * 2);
        r = ((col16 & 0x1F) << 3) | ((col16 & 0x1F) >>> 2);
        g = (((col16 >>> 5) & 0x1F) << 3) | (((col16 >>> 5) & 0x1F) >>> 2);
        b = (((col16 >>> 10) & 0x1F) << 3) | (((col16 >>> 10) & 0x1F) >>> 2);
      }
      const off = (y * 240 + x) * 4;
      data[off] = r;
      data[off+1] = g;
      data[off+2] = b;
      data[off+3] = 255;
    }
  }
}
