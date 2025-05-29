// src/ppu/index.js
import { renderMode0 }   from './mode0.js';
import { renderMode1 }   from './mode1.js';
import { renderMode2 }   from './mode2.js';
import { renderMode3 }   from './mode3.js';
import { renderMode4 }   from './mode4.js';
import { renderMode5 }   from './mode5.js';
import { renderSprites } from './sprites.js';
import { applyMosaic, applyBrightness } from './effects.js';

export class PPU {
  constructor(memory, io, ctx) {
    this.mem       = memory;
    this.io        = io;
    this.ctx       = ctx;
    this.imageData = ctx.createImageData(240, 160);
  }

  reset() {}

  render() {
    const dispcnt = this.io.ppu.readDISPCNT();
    const mode    = dispcnt & 0x7;

    switch (mode) {
      case 0: renderMode0(this.mem, this.io, this.imageData); break;
      case 1: renderMode1(this.mem, this.io, this.imageData); break;
      case 2: renderMode2(this.mem, this.io, this.imageData); break;
      case 3: renderMode3(this.mem,             this.imageData); break;
      case 4: renderMode4(this.mem, this.io,    this.imageData); break;
      case 5: renderMode5(this.mem, this.io,    this.imageData); break;
      default: this._clear();
    }

    renderSprites(this.mem, this.io, this.imageData);

    // Special Effects: Mosaic then Brightness
    applyMosaic(this.imageData, this.io.ppu.readMosaic());
    const bldCnt = this.io.ppu.readBldCnt();
    applyBrightness(this.imageData, bldCnt, this.io.ppu.readBldY());

    this.ctx.putImageData(this.imageData, 0, 0);
  }

  _clear() {
    const d = this.imageData.data;
    for (let i = 0; i < d.length; i += 4) d[i+3] = 0;
  }
}
