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
    for (let i = 0; i < 4; i++) {
      const t = regs.ch[i];
      if (!t.enable) continue;

      if (t.cascade) {
        // increment on previous timer overflow:
        // we’ll skip cascade here for brevity
        continue;
      } else {
        t.divisorAcc += cycles;
        while (t.divisorAcc >= t.prescaler) {
          t.divisorAcc -= t.prescaler;
          t.count = (t.count + 1) & 0xFFFF;
          if (t.count === 0) {
            // overflow → reload + IRQ
            t.count = t.reload;
            if (t.irqEnable) regs.irq = true;
          }
        }
      }
    }
  }
}
