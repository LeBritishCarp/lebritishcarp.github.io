// src/io/apu-regs.js
export class APURegs {
  constructor() { this.reset(); }

  reset() {
    // Channel 1
    this.SOUND1CNT_L = 0;  // @0x04000060
    this.SOUND1CNT_H = 0;  // @0x04000062
    this.SOUND1CNT_X = 0;  // @0x04000064

    // Channel 2
    this.SOUND2CNT_L = 0;  // @0x04000068
    this.SOUND2CNT_H = 0;  // @0x0400006C

    // Channel 3
    this.SOUND3CNT_L = 0;         // @0x04000070
    this.SOUND3CNT_H = 0;         // @0x04000072
    this.SOUND3CNT_X = 0;         // @0x04000074
    this.WAVE_RAM    = new Uint8Array(32); // @0x04000090–0x0400009F

    // Channel 4
    this.SOUND4CNT_L = 0;  // @0x04000078
    this.SOUND4CNT_H = 0;  // @0x0400007C

    // Global sound control
    this.SOUNDCNT_L = 0;   // @0x04000080
    this.SOUNDCNT_H = 0;   // @0x04000082
    this.SOUNDCNT_X = 0;   // @0x04000084

    // PWM bias
    this.SOUNDBIAS  = 0;   // @0x04000088

    // Direct Sound FIFOs
    this.FIFO_A = new Uint8Array(4); // @0x040000A0–0x040000A3
    this.FIFO_B = new Uint8Array(4); // @0x040000A4–0x040000A7
  }

  read(addr) {
    switch (addr) {
      // CH1
      case 0x04000060: return  this.SOUND1CNT_L       & 0xFF;
      case 0x04000061: return (this.SOUND1CNT_L >>> 8) & 0xFF;
      case 0x04000062: return  this.SOUND1CNT_H       & 0xFF;
      case 0x04000063: return (this.SOUND1CNT_H >>> 8) & 0xFF;
      case 0x04000064: return  this.SOUND1CNT_X       & 0xFF;
      case 0x04000065: return (this.SOUND1CNT_X >>> 8) & 0xFF;
      // CH2
      case 0x04000068: return  this.SOUND2CNT_L       & 0xFF;
      case 0x04000069: return (this.SOUND2CNT_L >>> 8) & 0xFF;
      case 0x0400006C: return  this.SOUND2CNT_H       & 0xFF;
      case 0x0400006D: return (this.SOUND2CNT_H >>> 8) & 0xFF;
      // CH3
      case 0x04000070: return  this.SOUND3CNT_L       & 0xFF;
      case 0x04000071: return (this.SOUND3CNT_L >>> 8) & 0xFF;
      case 0x04000072: return  this.SOUND3CNT_H       & 0xFF;
      case 0x04000073: return (this.SOUND3CNT_H >>> 8) & 0xFF;
      case 0x04000074: return  this.SOUND3CNT_X       & 0xFF;
      case 0x04000075: return (this.SOUND3CNT_X >>> 8) & 0xFF;
      // Wave RAM
      default:
        if (addr >= 0x04000090 && addr < 0x040000A0) {
          return this.WAVE_RAM[addr - 0x04000090];
        }
        // CH4
        if (addr === 0x04000078)        return  this.SOUND4CNT_L       & 0xFF;
        if (addr === 0x04000079)        return (this.SOUND4CNT_L >>> 8) & 0xFF;
        if (addr === 0x0400007C)        return  this.SOUND4CNT_H       & 0xFF;
        if (addr === 0x0400007D)        return (this.SOUND4CNT_H >>> 8) & 0xFF;
        // Global
        if (addr === 0x04000080)        return  this.SOUNDCNT_L       & 0xFF;
        if (addr === 0x04000081)        return (this.SOUNDCNT_L >>> 8) & 0xFF;
        if (addr === 0x04000082)        return  this.SOUNDCNT_H       & 0xFF;
        if (addr === 0x04000083)        return (this.SOUNDCNT_H >>> 8) & 0xFF;
        if (addr === 0x04000084)        return  this.SOUNDCNT_X       & 0xFF;
        if (addr === 0x04000085)        return (this.SOUNDCNT_X >>> 8) & 0xFF;
        if (addr === 0x04000088)        return  this.SOUNDBIAS        & 0xFF;
        if (addr === 0x04000089)        return (this.SOUNDBIAS  >>> 8) & 0xFF;
        // FIFO A
        if (addr >= 0x040000A0 && addr < 0x040000A4) {
          return this.FIFO_A[addr - 0x040000A0];
        }
        // FIFO B
        if (addr >= 0x040000A4 && addr < 0x040000A8) {
          return this.FIFO_B[addr - 0x040000A4];
        }
        return 0;
    }
  }

  write(addr, value) {
    value &= 0xFF;
    switch (addr) {
      // CH1
      case 0x04000060: this.SOUND1CNT_L = (this.SOUND1CNT_L & 0xFF00) | value; break;
      case 0x04000061: this.SOUND1CNT_L = (this.SOUND1CNT_L & 0x00FF) | (value << 8); break;
      case 0x04000062: this.SOUND1CNT_H = (this.SOUND1CNT_H & 0xFF00) | value; break;
      case 0x04000063: this.SOUND1CNT_H = (this.SOUND1CNT_H & 0x00FF) | (value << 8); break;
      case 0x04000064: this.SOUND1CNT_X = (this.SOUND1CNT_X & 0xFF00) | value; break;
      case 0x04000065: this.SOUND1CNT_X = (this.SOUND1CNT_X & 0x00FF) | (value << 8); break;
      // CH2
      case 0x04000068: this.SOUND2CNT_L = (this.SOUND2CNT_L & 0xFF00) | value; break;
      case 0x04000069: this.SOUND2CNT_L = (this.SOUND2CNT_L & 0x00FF) | (value << 8); break;
      case 0x0400006C: this.SOUND2CNT_H = (this.SOUND2CNT_H & 0xFF00) | value; break;
      case 0x0400006D: this.SOUND2CNT_H = (this.SOUND2CNT_H & 0x00FF) | (value << 8); break;
      // CH3
      case 0x04000070: this.SOUND3CNT_L = (this.SOUND3CNT_L & 0xFF00) | value; break;
      case 0x04000071: this.SOUND3CNT_L = (this.SOUND3CNT_L & 0x00FF) | (value << 8); break;
      case 0x04000072: this.SOUND3CNT_H = (this.SOUND3CNT_H & 0xFF00) | value; break;
      case 0x04000073: this.SOUND3CNT_H = (this.SOUND3CNT_H & 0x00FF) | (value << 8); break;
      case 0x04000074: this.SOUND3CNT_X = (this.SOUND3CNT_X & 0xFF00) | value; break;
      case 0x04000075: this.SOUND3CNT_X = (this.SOUND3CNT_X & 0x00FF) | (value << 8); break;
      // Wave RAM
      default:
        if (addr >= 0x04000090 && addr < 0x040000A0) {
          this.WAVE_RAM[addr - 0x04000090] = value;
          break;
        }
        // CH4
        if (addr === 0x04000078) { this.SOUND4CNT_L = (this.SOUND4CNT_L & 0xFF00) | value; break; }
        if (addr === 0x04000079) { this.SOUND4CNT_L = (this.SOUND4CNT_L & 0x00FF) | (value << 8); break; }
        if (addr === 0x0400007C) { this.SOUND4CNT_H = (this.SOUND4CNT_H & 0xFF00) | value; break; }
        if (addr === 0x0400007D) { this.SOUND4CNT_H = (this.SOUND4CNT_H & 0x00FF) | (value << 8); break; }
        // Global
        if (addr === 0x04000080) { this.SOUNDCNT_L = (this.SOUNDCNT_L & 0xFF00) | value; break; }
        if (addr === 0x04000081) { this.SOUNDCNT_L = (this.SOUNDCNT_L & 0x00FF) | (value << 8); break; }
        if (addr === 0x04000082) { this.SOUNDCNT_H = (this.SOUNDCNT_H & 0xFF00) | value; break; }
        if (addr === 0x04000083) { this.SOUNDCNT_H = (this.SOUNDCNT_H & 0x00FF) | (value << 8); break; }
        if (addr === 0x04000084) { this.SOUNDCNT_X = (this.SOUNDCNT_X & 0xFF00) | value; break; }
        if (addr === 0x04000085) { this.SOUNDCNT_X = (this.SOUNDCNT_X & 0x00FF) | (value << 8); break; }
        if (addr === 0x04000088) { this.SOUNDBIAS  = (this.SOUNDBIAS  & 0xFF00) | value; break; }
        if (addr === 0x04000089) { this.SOUNDBIAS  = (this.SOUNDBIAS  & 0x00FF) | (value << 8); break; }
        // FIFOs
        if (addr >= 0x040000A0 && addr < 0x040000A4) {
          this.FIFO_A[addr - 0x040000A0] = value; break;
        }
        if (addr >= 0x040000A4 && addr < 0x040000A8) {
          this.FIFO_B[addr - 0x040000A4] = value; break;
        }
    }
  }
}
