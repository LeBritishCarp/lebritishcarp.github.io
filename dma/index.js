// src/dma/index.js
export class DMA {
  constructor(memory, io) {
    this.memory = memory;
    this.io     = io;
  }
  reset() {
    // clear channel registers
  }
  step(cycles) {
    // TODO: for each channel, if enabled and timing match (imm/HBlank/VBlank),
    //       perform transfer of N words from src→dst, decrement count.
  }
}
