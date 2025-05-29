// src/timers/index.js
export class Timers {
  constructor(memory, io) {
    this.mem = memory;
    this.io  = io;
  }

  reset() {
    this.io.timers.reset();
  }

  step(cycles) {
    const regs = this.io.timers;
    for (let i = 0; i < regs.ch.length; i++) {
      const t = regs.ch[i];
      if (!t.enable || t.cascade) continue;  // cascade timers not supported
      t.divisorAcc += cycles;
      const p = t.prescaler;
      while (t.divisorAcc >= p) {
        t.divisorAcc -= p;
        t.count = (t.count + 1) & 0xFFFF;
        if (t.count === 0) {
          t.count = t.reload;
          if (t.irqEnable) regs.irq = true;
        }
      }
    }
  }
}
