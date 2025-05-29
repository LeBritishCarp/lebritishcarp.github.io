// src/ppu/mode1.js
import { renderMode0 } from './mode0.js';

export function renderMode1(mem, io, imageData) {
  // Mode 1 supports one affine BG (1) and one regular BG (0),
  // plus optional BG2 tile layer. For now we fallback to Mode0
  renderMode0(mem, io, imageData);
}
