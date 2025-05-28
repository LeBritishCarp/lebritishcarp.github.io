// src/apu/index.js
export class APU {
  constructor(memory, io) {
    this.memory = memory;
    this.io     = io;
    // TODO: create Web Audio API context and channel nodes
  }
  reset() {
    // reset channel state
  }
  step(cycles) {
    // TODO: clock channel envelopes, length counters, sweep, mix output
  }
}
