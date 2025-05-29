// src/dma/index.js
export class DMA {
  constructor(memory, io) {
    this.mem = memory;
    this.io  = io;
  }

  reset() {
    // nothing to persist beyond IORegs.reset()
  }

  step(cycles) {
    for (let i = 0; i < 4; i++) {
      const ch = this.io.dma.ch[i];
      if (!ch.enable) continue;

      // Immediate transfers
      if (ch.timing === 0) {
        this._transferBlock(ch);
        ch.enable = ch.repeat; // clear if no repeat
      }

      // HBlank/VBlank/FIFO modes can be hooked here:
      // if (ch.timing === 1 && inHBlank) this._transferBlock(ch);
      // if (ch.timing === 2 && inVBlank) this._transferBlock(ch);
      // if (ch.timing === 3) /* FIFO for sound DMA */
    }
  }

  _transferBlock(ch) {
    const unit = ch.unit32 ? 4 : 2;       // bytes per unit
    let n     = ch.count || 0x10000;      // zero count means 0x10000
    while (n--) {
      // read, write
      let data;
      if (unit === 4) data = this.mem.read32(ch.src);
      else            data = this.mem.read16(ch.src);
      if (unit === 4) this.mem.write32(ch.dst, data);
      else            this.mem.write16(ch.dst, data);

      // advance pointers
      ch.src += unit * ch.srcInc;
      ch.dst += unit * ch.dstInc;
    }
    if (ch.irq) this.io.timers.irq = true;
  }
}
