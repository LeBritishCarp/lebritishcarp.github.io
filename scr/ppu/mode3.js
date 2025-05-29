// src/ppu/mode3.js
export function renderMode3(memory, imageData) {
  const data = imageData.data;
  const base = 0x06000000;
  for (let y = 0; y < 160; y++) {
    for (let x = 0; x < 240; x++) {
      const pix16 = memory.read16(base + 2 * (y * 240 + x));
      const r5 =  pix16        & 0x1F;
      const g5 = (pix16 >>>  5) & 0x1F;
      const b5 = (pix16 >>> 10) & 0x1F;
      const r8 = (r5 << 3) | (r5 >>> 2);
      const g8 = (g5 << 3) | (g5 >>> 2);
      const b8 = (b5 << 3) | (b5 >>> 2);
      const i = (y * 240 + x) * 4;
      data[i]   = r8;
      data[i+1] = g8;
      data[i+2] = b8;
      data[i+3] = 255;
    }
  }
}
