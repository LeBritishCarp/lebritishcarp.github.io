// src/ppu/effects.js

/**
 * Apply Mosaic effect to the framebuffer.
 * mosaic: 8-bit value, low nibble = hSize, high nibble = vSize.
 */
export function applyMosaic(imageData, mosaic) {
  const hSize = (mosaic & 0xF) + 1;
  const vSize = ((mosaic >>> 4) & 0xF) + 1;

  if (hSize === 1 && vSize === 1) return;

  const { data, width, height } = imageData;
  const orig = data.slice();

  for (let by = 0; by < height; by += vSize) {
    for (let bx = 0; bx < width; bx += hSize) {
      const i0 = (by * width + bx) * 4;
      const r0 = orig[i0], g0 = orig[i0+1], b0 = orig[i0+2], a0 = orig[i0+3];
      for (let y = by; y < by + vSize && y < height; y++) {
        for (let x = bx; x < bx + hSize && x < width; x++) {
          const i = (y * width + x) * 4;
          data[i] = r0; data[i+1] = g0; data[i+2] = b0; data[i+3] = a0;
        }
      }
    }
  }
}

/**
 * Apply brightness increase (mode=2) or decrease (mode=3).
 * bldCnt: 16-bit BLD control, bldy: 8-bit brightness factor.
 */
export function applyBrightness(imageData, bldCnt, bldy) {
  const mode = (bldCnt >>> 6) & 0x3;
  if (mode !== 2 && mode !== 3) return;

  const Y       = bldy & 0x1F;
  const factor  = Y / 16;
  const inv     = (16 - Y) / 16;
  const data    = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];
    if (mode === 2) {
      data[i]   = r + Math.round((255 - r) * factor);
      data[i+1] = g + Math.round((255 - g) * factor);
      data[i+2] = b + Math.round((255 - b) * factor);
    } else {
      data[i]   = Math.round(r * inv);
      data[i+1] = Math.round(g * inv);
      data[i+2] = Math.round(b * inv);
    }
  }
}
