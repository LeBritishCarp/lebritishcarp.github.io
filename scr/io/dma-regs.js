// src/io/dma-regs.js
export class DMARegs {
  constructor() { this.reset(); }
  reset() {
    // Four DMA channels, each with: src, dst, count, control + decoded flags
    this.ch = Array.from({ length: 4 }, () => ({
      src:       0,
      dst:       0,
      count:     0,
      control:   0,
      enable:    false,
      timing:    0,    // 0=immediate,1=HBlank,2=VBlank,3=FIFO
      srcInc:    1,    // +1 word or byte?
      dstInc:    1,
      repeat:    false,
      irq:       false,
      unit32:    false // false=16-bit, true=32-bit
    }));
  }

  read(addr) {
    // Map 0x0400_0100–0x0400_03FF → channels 0–3, 16 bytes each
    if (addr >= 0x04000100 && addr < 0x04000400) {
      const off   = addr - 0x04000100;
      const chIdx = off >>> 4;       // 0..3
      const reg   = off & 0xF;       // 0..15
      const ch    = this.ch[chIdx];
      switch (reg) {
        case 0:  return  ch.src & 0xFF;
        case 1:  return (ch.src >>>  8) & 0xFF;
        case 2:  return (ch.src >>> 16) & 0xFF;
        case 3:  return (ch.src >>> 24) & 0xFF;
        case 4:  return  ch.dst & 0xFF;
        case 5:  return (ch.dst >>>  8) & 0xFF;
        case 6:  return (ch.dst >>> 16) & 0xFF;
        case 7:  return (ch.dst >>> 24) & 0xFF;
        case 8:  return  ch.count & 0xFF;
        case 9:  return (ch.count >>>  8) & 0xFF;
        case 10: return  ch.control & 0xFF;
        case 11: return (ch.control >>>  8) & 0xFF;
        // reg 12–15 unused
      }
    }
    return 0;
  }

  write(addr, value) {
    if (addr >= 0x04000100 && addr < 0x04000400) {
      value &= 0xFF;
      const off   = addr - 0x04000100;
      const chIdx = off >>> 4;
      const reg   = off & 0xF;
      const ch    = this.ch[chIdx];
      switch (reg) {
        case 0:  ch.src     = (ch.src & ~0xFF)       | value; break;
        case 1:  ch.src     = (ch.src & ~0xFF00)     | (value << 8); break;
        case 2:  ch.src     = (ch.src & ~0xFF0000)   | (value << 16); break;
        case 3:  ch.src     = (ch.src & ~0xFF000000) | (value << 24); break;
        case 4:  ch.dst     = (ch.dst & ~0xFF)       | value; break;
        case 5:  ch.dst     = (ch.dst & ~0xFF00)     | (value << 8); break;
        case 6:  ch.dst     = (ch.dst & ~0xFF0000)   | (value << 16); break;
        case 7:  ch.dst     = (ch.dst & ~0xFF000000) | (value << 24); break;
        case 8:  ch.count   = (ch.count & ~0xFF)     | value; break;
        case 9:  ch.count   = (ch.count & ~0xFF00)   | (value << 8); break;
        case 10: ch.control = (ch.control & ~0xFF)   | value;
                 this._decodeControl(ch);
                 break;
        case 11: ch.control = (ch.control & ~0xFF00) | (value << 8);
                 this._decodeControl(ch);
                 break;
        // reg 12–15 ignored
      }
    }
  }

  _decodeControl(ch) {
    const c = ch.control;
    ch.enable    = !!(c & (1 << 15));
    ch.timing    = (c >>> 12) & 0x3;
    ch.repeat    = !!(c & (1 << 9));
    ch.unit32    = !!(c & (1 << 10));
    ch.irq       = !!(c & (1 << 14));
    // source increment: bits 7-8 (00=+,01=-,10=fixed,11=+)
    const s = (c >>> 7) & 0x3;
    ch.srcInc = s === 1 ? -1 : (s === 2 ? 0 : 1);
    // dest increment: bits 5-6
    const d = (c >>> 5) & 0x3;
    ch.dstInc = d === 1 ? -1 : (d === 2 ? 0 : 1);
  }
}
