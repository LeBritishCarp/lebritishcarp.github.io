// src/ppu/mode1.js
import { renderMode0 } from './mode0.js';

export function renderMode1(mem, io, imageData) {
  renderMode0(mem, io, imageData);
}
