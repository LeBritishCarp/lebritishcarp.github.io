// src/io/timers-regs.js
export class TimerRegs {
  constructor() {
    this.reset();
  }

  reset() {
    this.ch = Array.from({ length: 4 }, () => ({
      reload:      0,
      count:       0,
      control:     0,
      enable:      false,
      irqEnable:   false,
      cascade:     false,
      prescaler:   1,
      divisorAcc:  0
    }));
    // global IRQ flag for timers
    this.irq = false;
  }

  read(addr) {
    // 0x0400_0400–0x0400_040F handled here
    if (addr >= 0x04000400 && addr < 0x04000500) {
      const off   = addr - 0x04000400;
      const idx   = off >>> 2;  // channel 0..3
      const reg   = off & 0x3;  // 0=LOW,1=HIGH
      const t     = this.ch[idx];
      if (reg === 0)      return  t.reload & 0xFF;
      else if (reg === 1) return (t.reload >>> 8) & 0xFF;
      else if (reg === 2) return  t.control & 0xFF;
      else                return (t.control >>> 8) & 0xFF;
    }
    return 0;
  }

  write(addr, value) {
    if (addr >= 0x04000400 && addr < 0x04000500) {
      value &= 0xFF;
      const off   = addr - 0x04000400;
      const idx   = off >>> 2;
      const reg   = off & 0x3;
      const t     = this.ch[idx];
      if (reg === 0) {
        t.reload = (t.reload & ~0xFF) | value;
      } else if (reg === 1) {
        t.reload = (t.reload & ~0xFF00) | (value << 8);
      } else if (reg === 2) {
        t.control = (t.control & ~0xFF) | value;
        this._decodeControl(t);
      } else {
        t.control = (t.control & ~0xFF00) | (value << 8);
        this._decodeControl(t);
      }
    }
  }

  _decodeControl(t) {
    const c = t.control;
    t.enable     = !!(c & (1 << 7));
    t.irqEnable  = !!(c & (1 << 6));
    t.cascade    = !!(c & (1 << 2));
    // prescaler: bits 0-1 => 0=>1,1=>64,2=>256,3=>1024
    switch (c & 0x3) {
      case 0: t.prescaler = 1; break;
      case 1: t.prescaler = 64; break;
      case 2: t.prescaler = 256; break;
      case 3: t.prescaler = 1024; break;
    }
    // when (re)started, reload into count
    if (t.enable) t.count = t.reload;
  }
}
