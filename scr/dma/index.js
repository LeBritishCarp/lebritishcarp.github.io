// src/dma/index.js
export class DMA {
  constructor(mem, io) {
    this.mem = mem; this.io = io;
  }
  reset() { /* clear DMA regs */ }
  step(cycles) {
    for (let ch = 0; ch < 4; ch++) {
      const reg = this.io.dma.ch[ch];
      if (!reg.enable) continue;
      if (reg.timing === 0) {
        // immediate
        for (let i = 0; i < reg.count; i++) {
          const val = this.mem.read32(reg.src + i*4);
          this.mem.write8(reg.dst + i*4, val);
        }
        reg.enable = false;
      }
      // TODO: HBlank/VBlank/FIFO
    }
  }
}
