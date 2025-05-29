// src/timers/index.js
export class Timers {
  constructor(mem, io) {
    this.io = io; this.mem = mem;
  }
  reset() {
    this.io.timers.reset();
  }
  step(cycles) {
    for (let i = 0; i < 4; i++) {
      const t = this.io.timers.ch[i];
      if (!t.enable) continue;
      t.count += cycles / t.prescaler;
      if (t.count >= 0x10000) {
        t.count -= 0x10000;
        this.io.timers.irq = true;
      }
    }
  }
}
