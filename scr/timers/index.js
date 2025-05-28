// src/timers/index.js
export class Timers {
  constructor(memory, io) {
    this.memory = memory;
    this.io     = io;
  }
  reset() {
    // clear timer control & counters
  }
  step(cycles) {
    // TODO: increment each timer based on its input clock, if overflow trigger IRQ
  }
}
