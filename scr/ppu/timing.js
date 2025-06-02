// src/ppu/timing.js
export class PPULine {
  constructor(io, dma, cpu) {
    this.io  = io;
    this.dma = dma;
    this.cpu = cpu;
    this.line = 0;
  }

  nextLine() {
    const regs = this.io.ppu;
    const stat = regs.DISPSTAT;

    // 1) Update VCOUNT
    regs.VCOUNT = this.line;

    // 2) VCOUNT=LYC compare → STAT bit2
    const LYC = (stat >>> 8) & 0xFF;
    if (this.line === LYC) {
      regs.DISPSTAT |=  (1 << 2);
      if (stat & (1 << 5)) this.io.timers.irq = true;
    } else {
      regs.DISPSTAT &= ~(1 << 2);
    }

    // 3) HBlank (visible lines only): STAT bit1 + DMA timing=1
    if (this.line < 160) {
      regs.DISPSTAT |=  (1 << 1);
      this._doDMA(1);
      if (stat & (1 << 4)) this.io.timers.irq = true;
      regs.DISPSTAT &= ~(1 << 1);
    }

    // 4) VBlank start/end: STAT bit0 + DMA timing=2
    if (this.line === 160) {
      regs.DISPSTAT |=  (1 << 0);
      this._doDMA(2);
      if (stat & (1 << 3)) this.io.timers.irq = true;
    } else if (this.line === 227) {
      regs.DISPSTAT &= ~(1 << 0);
    }

    // Advance
    this.line = (this.line + 1) % 228;
  }

  _doDMA(timingMode) {
    for (const ch of this.io.dma.ch) {
      if (ch.enable && ch.timing === timingMode) {
        // immediate HBlank/VBlank block transfer
        const unit = ch.unit32 ? 4 : 2;
        const count = ch.count === 0 ? 0x10000 : ch.count;
        for (let n = 0; n < count; n++) {
          const data = ch.unit32
            ? this.io.memory.read32(ch.src)
            : this.io.memory.read16(ch.src);
          if (ch.unit32) this.io.memory.write32(ch.dst, data);
          else            this.io.memory.write16(ch.dst, data);
          ch.src += unit * ch.srcInc;
          ch.dst += unit * ch.dstInc;
        }
        if (ch.irq) this.io.timers.irq = true;
        if (!ch.repeat) ch.enable = false;
      }
    }
  }
}
