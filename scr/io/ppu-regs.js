// src/io/ppu-regs.js
export class PPURegs {
  constructor() { this.reset(); }

  reset() {
    // Display control & status
    this.DISPCNT   = 0x0080; // default: Mode 0, BG0 on
    this.DISPSTAT  = 0;
    this.VCOUNT    = 0;

    // BG control
    this.BG0CNT = 0; this.BG1CNT = 0;
    this.BG2CNT = 0; this.BG3CNT = 0;

    // BG scroll offsets
    this.BG0HOFS = 0; this.BG0VOFS = 0;
    this.BG1HOFS = 0; this.BG1VOFS = 0;
    this.BG2HOFS = 0; this.BG2VOFS = 0;
    this.BG3HOFS = 0; this.BG3VOFS = 0;

    // You can add more registers here (MOSAIC, BLDCNT, etc.)
  }

  read(addr) {
    switch (addr) {
      // DISPCNT
      case 0x04000000: return this.DISPCNT & 0xFF;
      case 0x04000001: return (this.DISPCNT >>> 8) & 0xFF;
      // DISPSTAT
      case 0x04000004: return this.DISPSTAT & 0xFF;
      case 0x04000005: return (this.DISPSTAT >>> 8) & 0xFF;
      // VCOUNT
      case 0x04000006: return this.VCOUNT & 0xFF;
      case 0x04000007: return (this.VCOUNT >>> 8) & 0xFF;
      // BG0CNT
      case 0x04000008: return this.BG0CNT & 0xFF;
      case 0x04000009: return (this.BG0CNT >>> 8) & 0xFF;
      // BG1CNT
      case 0x0400000A: return this.BG1CNT & 0xFF;
      case 0x0400000B: return (this.BG1CNT >>> 8) & 0xFF;
      // BG2CNT
      case 0x0400000C: return this.BG2CNT & 0xFF;
      case 0x0400000D: return (this.BG2CNT >>> 8) & 0xFF;
      // BG3CNT
      case 0x0400000E: return this.BG3CNT & 0xFF;
      case 0x0400000F: return (this.BG3CNT >>> 8) & 0xFF;
      // BG0HOFS/VOFS
      case 0x04000010: return this.BG0HOFS & 0xFF;
      case 0x04000011: return (this.BG0HOFS >>> 8) & 0xFF;
      case 0x04000012: return this.BG0VOFS & 0xFF;
      case 0x04000013: return (this.BG0VOFS >>> 8) & 0xFF;
      // BG1HOFS/VOFS
      case 0x04000014: return this.BG1HOFS & 0xFF;
      case 0x04000015: return (this.BG1HOFS >>> 8) & 0xFF;
      case 0x04000016: return this.BG1VOFS & 0xFF;
      case 0x04000017: return (this.BG1VOFS >>> 8) & 0xFF;
      // BG2HOFS/VOFS
      case 0x04000018: return this.BG2HOFS & 0xFF;
      case 0x04000019: return (this.BG2HOFS >>> 8) & 0xFF;
      case 0x0400001A: return this.BG2VOFS & 0xFF;
      case 0x0400001B: return (this.BG2VOFS >>> 8) & 0xFF;
      // BG3HOFS/VOFS
      case 0x0400001C: return this.BG3HOFS & 0xFF;
      case 0x0400001D: return (this.BG3HOFS >>> 8) & 0xFF;
      case 0x0400001E: return this.BG3VOFS & 0xFF;
      case 0x0400001F: return (this.BG3VOFS >>> 8) & 0xFF;
      default:
        console.warn(`PPURegs: Unhandled read @ 0x${addr.toString(16)}`);
        return 0;
    }
  }

  write(addr, value) {
    value &= 0xFF;
    switch (addr) {
      // DISPCNT
      case 0x04000000: this.DISPCNT = (this.DISPCNT & 0xFF00) | value; break;
      case 0x04000001: this.DISPCNT = (this.DISPCNT & 0x00FF) | (value << 8); break;
      // DISPSTAT
      case 0x04000004: this.DISPSTAT = (this.DISPSTAT & 0xFF00) | value; break;
      case 0x04000005: this.DISPSTAT = (this.DISPSTAT & 0x00FF) | (value << 8); break;
      // VCOUNT is read-only
      // BG0CNT
      case 0x04000008: this.BG0CNT = (this.BG0CNT & 0xFF00) | value; break;
      case 0x04000009: this.BG0CNT = (this.BG0CNT & 0x00FF) | (value << 8); break;
      // BG1CNT
      case 0x0400000A: this.BG1CNT = (this.BG1CNT & 0xFF00) | value; break;
      case 0x0400000B: this.BG1CNT = (this.BG1CNT & 0x00FF) | (value << 8); break;
      // BG2CNT
      case 0x0400000C: this.BG2CNT = (this.BG2CNT & 0xFF00) | value; break;
      case 0x0400000D: this.BG2CNT = (this.BG2CNT & 0x00FF) | (value << 8); break;
      // BG3CNT
      case 0x0400000E: this.BG3CNT = (this.BG3CNT & 0xFF00) | value; break;
      case 0x0400000F: this.BG3CNT = (this.BG3CNT & 0x00FF) | (value << 8); break;
      // BG0HOFS/VOFS
      case 0x04000010: this.BG0HOFS = (this.BG0HOFS & 0xFF00) | value; break;
      case 0x04000011: this.BG0HOFS = (this.BG0HOFS & 0x00FF) | (value << 8); break;
      case 0x04000012: this.BG0VOFS = (this.BG0VOFS & 0xFF00) | value; break;
      case 0x04000013: this.BG0VOFS = (this.BG0VOFS & 0x00FF) | (value << 8); break;
      // BG1HOFS/VOFS
      case 0x04000014: this.BG1HOFS = (this.BG1HOFS & 0xFF00) | value; break;
      case 0x04000015: this.BG1HOFS = (this.BG1HOFS & 0x00FF) | (value << 8); break;
      case 0x04000016: this.BG1VOFS = (this.BG1VOFS & 0xFF00) | value; break;
      case 0x04000017: this.BG1VOFS = (this.BG1VOFS & 0x00FF) | (value << 8); break;
      // BG2HOFS/VOFS
      case 0x04000018: this.BG2HOFS = (this.BG2HOFS & 0xFF00) | value; break;
      case 0x04000019: this.BG2HOFS = (this.BG2HOFS & 0x00FF) | (value << 8); break;
      case 0x0400001A: this.BG2VOFS = (this.BG2VOFS & 0xFF00) | value; break;
      case 0x0400001B: this.BG2VOFS = (this.BG2VOFS & 0x00FF) | (value << 8); break;
      // BG3HOFS/VOFS
      case 0x0400001C: this.BG3HOFS = (this.BG3HOFS & 0xFF00) | value; break;
      case 0x0400001D: this.BG3HOFS = (this.BG3HOFS & 0x00FF) | (value << 8); break;
      case 0x0400001E: this.BG3VOFS = (this.BG3VOFS & 0xFF00) | value; break;
      case 0x0400001F: this.BG3VOFS = (this.BG3VOFS & 0x00FF) | (value << 8); break;
      default:
        console.warn(`PPURegs: Unhandled write @ 0x${addr.toString(16)} = 0x${value.toString(16)}`);
    }
  }

  // Convenience getters for your PPU class
  readDISPCNT()  { return this.DISPCNT; }
  readDispStat() { return this.DISPSTAT; }
  readVCOUNT()   { return this.VCOUNT; }
  readBG0CNT()   { return this.BG0CNT; }
  readBG1CNT()   { return this.BG1CNT; }
  readBG2CNT()   { return this.BG2CNT; }
  readBG3CNT()   { return this.BG3CNT; }
  readBG0HOFS()  { return this.BG0HOFS; }
  readBG0VOFS()  { return this.BG0VOFS; }
  // …and so on for BG1–3 offsets as needed
}
