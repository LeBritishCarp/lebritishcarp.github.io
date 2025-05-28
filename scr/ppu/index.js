// src/ppu/index.js
import { renderMode0 } from './mode0.js';
import { renderMode3 } from './mode3.js';

export class PPU {
  constructor(mem, io, ctx) {
    this.memory    = mem;
    this.io        = io;
    this.ctx       = ctx;
    this.imageData = ctx.createImageData(240, 160);
  }

  reset() {
    // nothing to clear here yet
  }

  render() {
    const dispcnt = this.io.ppu.readDISPCNT();
    const mode    = dispcnt & 0x7;
    switch (mode) {
      case 0:
        renderMode0(this.memory, this.io, this.imageData);
        break;
      case 3:
        renderMode3(this.memory, this.imageData);
        break;
      default:
        // clear to black
        const d = this.imageData.data;
        for (let i = 0; i < d.length; i += 4) d[i + 3] = 0;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
