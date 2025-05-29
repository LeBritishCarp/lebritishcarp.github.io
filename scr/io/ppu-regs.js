// src/io/ppu-regs.js
export class PPURegs {
  constructor() { this.reset(); }

  reset() {
    // Display control & status
    this.DISPCNT  = 0x0080; // Mode0, BG0 on
    this.DISPSTAT = 0;
    this.VCOUNT   = 0;

    // BG control
    this.BG0CNT = 0; this.BG1CNT = 0;
    this.BG2CNT = 0; this.BG3CNT = 0;

    // BG scroll
    this.BG0HOFS = 0; this.BG0VOFS = 0;
    this.BG1HOFS = 0; this.BG1VOFS = 0;
    this.BG2HOFS = 0; this.BG2VOFS = 0;
    this.BG3HOFS = 0; this.BG3VOFS = 0;

    // Window registers
    this.WIN0H  = 0;  // horizontal extents for Window0
    this.WIN1H  = 0;  // horizontal extents for Window1
    this.WIN0V  = 0;  // vertical extents for Window0
    this.WIN1V  = 0;  // vertical extents for Window1
    this.WININ  = 0;  // which layers appear inside windows
    this.WINOUT = 0;  // which layers appear outside windows

    // (You can add MOSAIC, BLDCNT, etc. here later)
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
      // BGnCNT
      case 0x04000008: return this.BG0CNT & 0xFF;
      case 0x04000009: return (this.BG0CNT >>> 8) & 0xFF;
      case 0x0400000A: return this.BG1CNT & 0xFF;
      case 0x0400000B: return (this.BG1CNT >>> 8) & 0xFF;
      case 0x0400000C: return this.BG2CNT & 0xFF;
      case 0x0400000D: return (this.BG2CNT >>> 8) & 0xFF;
      case 0x0400000E: return this.BG3CNT & 0xFF;
      case 0x0400000F: return (this.BG3CNT >>> 8) & 0xFF;
      // BGnHOFS/VOFS
      case 0x04000010: return this.BG0HOFS & 0xFF;
      case 0x04000011: return (this.BG0HOFS >>> 8) & 0xFF;
      case 0x04000012: return this.BG0VOFS & 0xFF;
      case 0x04000013: return (this.BG0VOFS >>> 8) & 0xFF;
      case 0x04000014: return this.BG1HOFS & 0xFF;
      case 0x04000015: return (this.BG1HOFS >>> 8) & 0xFF;
      case 0x04000016: return this.BG1VOFS & 0xFF;
      case 0x04000017: return (this.BG1VOFS >>> 8) & 0xFF;
      case 0x04000018: return this.BG2HOFS & 0xFF;
      case 0x04000019: return (this.BG2HOFS >>> 8) & 0xFF;
      case 0x0400001A: return this.BG2VOFS & 0xFF;
      case 0x0400001B: return (this.BG2VOFS >>> 8) & 0xFF;
      case 0x0400001C: return this.BG3HOFS & 0xFF;
      case 0x0400001D: return (this.BG3HOFS >>> 8) & 0xFF;
      case 0x0400001E: return this.BG3VOFS & 0xFF;
      case 0x0400001F: return (this.BG3VOFS >>> 8) & 0xFF;
      // Window horizontal
      case 0x04000040: return this.WIN0H & 0xFF;
      case 0x04000041: return (this.WIN0H >>> 8) & 0xFF;
      case 0x04000042: return this.WIN1H & 0xFF;
      case 0x04000043: return (this.WIN1H >>> 8) & 0xFF;
      // Window vertical
      case 0x04000044: return this.WIN0V & 0xFF;
      case 0x04000045: return (this.WIN0V >>> 8) & 0xFF;
      case 0x04000046: return this.WIN1V & 0xFF;
      case 0x04000047: return (this.WIN1V >>> 8) & 0xFF;
      // Window enable
      case 0x04000048: return this.WININ & 0xFF;
      case 0x04000049: return (this.WININ >>> 8) & 0xFF;
      case 0x0400004A: return this.WINOUT & 0xFF;
      case 0x0400004B: return (this.WINOUT >>> 8) & 0xFF;
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
      // VCOUNT (read-only)
      // BGnCNT
      case 0x04000008: this.BG0CNT = (this.BG0CNT & 0xFF00) | value; break;
      case 0x04000009: this.BG0CNT = (this.BG0CNT & 0x00FF) | (value << 8); break;
      case 0x0400000A: this.BG1CNT = (this.BG1CNT & 0xFF00) | value; break;
      case 0x0400000B: this.BG1CNT = (this.BG1CNT & 0x00FF) | (value << 8); break;
      case 0x0400000C: this.BG2CNT = (this.BG2CNT & 0xFF00) | value; break;
      case 0x0400000D: this.BG2CNT = (this.BG2CNT & 0x00FF) | (value << 8); break;
      case 0x0400000E: this.BG3CNT = (this.BG3CNT & 0xFF00) | value; break;
      case 0x0400000F: this.BG3CNT = (this.BG3CNT & 0x00FF) | (value << 8); break;
      // BGnHOFS/VOFS
      case 0x04000010: this.BG0HOFS = (this.BG0HOFS & 0xFF00) | value; break;
      case 0x04000011: this.BG0HOFS = (this.BG0HOFS & 0x00FF) | (value << 8); break;
      case 0x04000012: this.BG0VOFS = (this.BG0VOFS & 0xFF00) | value; break;
      case 0x04000013: this.BG0VOFS = (this.BG0VOFS & 0x00FF) | (value << 8); break;
      case 0x04000014: this.BG1HOFS = (this.BG1HOFS & 0xFF00) | value; break;
      case 0x04000015: this.BG1HOFS = (this.BG1HOFS & 0x00FF) | (value << 8); break;
      case 0x04000016: this.BG1VOFS = (this.BG1VOFS & 0xFF00) | value; break;
      case 0x04000017: this.BG1VOFS = (this.BG1VOFS & 0x00FF) | (value << 8); break;
      case 0x04000018: this.BG2HOFS = (this.BG2HOFS & 0xFF00) | value; break;
      case 0x04000019: this.BG2HOFS = (this.BG2HOFS & 0x00FF) | (value << 8); break;
      case 0x0400001A: this.BG2VOFS = (this.BG2VOFS & 0xFF00) | value; break;
      case 0x0400001B: this.BG2VOFS = (this.BG2VOFS & 0x00FF) | (value << 8); break;
      case 0x0400001C: this.BG3HOFS = (this.BG3HOFS & 0xFF00) | value; break;
      case 0x0400001D: this.BG3HOFS = (this.BG3HOFS & 0x00FF) | (value << 8); break;
      case 0x0400001E: this.BG3VOFS = (this.BG3VOFS & 0xFF00) | value; break;
      case 0x0400001F: this.BG3VOFS = (this.BG3VOFS & 0x00FF) | (value << 8); break;
      // Window horizontal
      case 0x04000040: this.WIN0H = (this.WIN0H & 0xFF00) | value; break;
      case 0x04000041: this.WIN0H = (this.WIN0H & 0x00FF) | (value << 8); break;
      case 0x04000042: this.WIN1H = (this.WIN1H & 0xFF00) | value; break;
      case 0x04000043: this.WIN1H = (this.WIN1H & 0x00FF) | (value << 8); break;
      // Window vertical
      case 0x04000044: this.WIN0V = (this.WIN0V & 0xFF00) | value; break;
      case 0x04000045: this.WIN0V = (this.WIN0V & 0x00FF) | (value << 8); break;
      case 0x04000046: this.WIN1V = (this.WIN1V & 0xFF00) | value; break;
      case 0x04000047: this.WIN1V = (this.WIN1V & 0x00FF) | (value << 8); break;
      // Window enable
      case 0x04000048: this.WININ  = (this.WININ  & 0xFF00) | value; break;
      case 0x04000049: this.WININ  = (this.WININ  & 0x00FF) | (value << 8); break;
      case 0x0400004A: this.WINOUT = (this.WINOUT & 0xFF00) | value; break;
      case 0x0400004B: this.WINOUT = (this.WINOUT & 0x00FF) | (value << 8); break;
      default:
        console.warn(`PPURegs: Unhandled write @ 0x${addr.toString(16)}`);
    }
  }

  // Convenience getters
  readDISPCNT()  { return this.DISPCNT; }
  readDispStat() { return this.DISPSTAT; }
  readVCOUNT()   { return this.VCOUNT; }
  readBG0CNT()   { return this.BG0CNT; }
  readBG1CNT()   { return this.BG1CNT; }
  readBG2CNT()   { return this.BG2CNT; }
  readBG3CNT()   { return this.BG3CNT; }
  readBG0HOFS()  { return this.BG0HOFS; }
  readBG0VOFS()  { return this.BG0VOFS; }
  readWIN0H()    { return this.WIN0H; }
  readWIN1H()    { return this.WIN1H; }
  readWIN0V()    { return this.WIN0V; }
  readWIN1V()    { return this.WIN1V; }
  readWININ()    { return this.WININ; }
  readWINOUT()   { return this.WINOUT; }
}
