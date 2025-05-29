// src/dma/index.js
export class DMA {
  constructor(memory, io) {
    this.mem = memory;
    this.io  = io;
  }

  reset() {
    // All state lives in IORegs; no extra reset logic needed here
  }

  step(cycles) {
    const channels = this.io.dma.ch;
    for (let i = 0; i < channels.length; i++) {
      const ch = channels[i];
      if (!ch.enable || ch.timing !== 0) continue;  // only immediate mode
      this._transferBlock(ch);
      ch.enable = ch.repeat;  // re-enable only if repeat flag set
    }
  }

  _transferBlock(ch) {
    const unit = ch.unit32 ? 4 : 2;
    const count = ch.count === 0 ? 0x10000 : ch.count;
    for (let n = 0; n < count; n++) {
      const data = ch.unit32
        ? this.mem.read32(ch.src)
        : this.mem.read16(ch.src);
      if (ch.unit32) this.mem.write32(ch.dst, data);
      else            this.mem.write16(ch.dst, data);
      ch.src += unit * ch.srcInc;
      ch.dst += unit * ch.dstInc;
    }
    if (ch.irq) this.io.timers.irq = true;
  }
}
