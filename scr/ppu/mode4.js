// src/ppu/mode4.js
export function renderMode4(mem, io, imageData) {
  const data    = imageData.data;
  const dispcnt = io.ppu.readDISPCNT();
  const page    = (dispcnt >>> 4) & 1;
  const base    = 0x06000000 + page * 0xA000; // page size = 40KB

  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 240; x++) {
      const idx   = y * 240 + x;
      const palIx = mem.read8(base + idx);
      const col16 = mem.read16(0x05000000 + palIx * 2);
      const r = ((col16 & 0x1F) << 3) | ((col16 & 0x1F) >>> 2);
      const g = (((col16 >>> 5) & 0x1F) << 3) | (((col16 >>> 5) & 0x1F) >>> 2);
      const b = (((col16 >>> 10) & 0x1F) << 3) | (((col16 >>> 10) & 0x1F) >>> 2);
      const off = idx * 4;
      data[off] = r;
      data[off+1] = g;
      data[off+2] = b;
      data[off+3] = 255;
    }
  }
}
