// src/ppu/mode2.js
import { renderMode0 } from './mode0.js';

export function renderMode2(mem, io, imageData) {
  // Mode 2 has two affine BGs (0 & 1). As a placeholder,
  // we render them like regular tile layers.
  renderMode0(mem, io, imageData);
}
