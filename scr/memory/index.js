// src/memory/index.js
import { IO } from '../io/index.js';

export class MemoryBus {
  constructor() {
    this.bios    = new Uint8Array(0x4000);    // 16 KB
    this.eram    = new Uint8Array(0x40000);   // 256 KB
    this.iram    = new Uint8Array(0x8000);    // 32 KB
    this.palette = new Uint16Array(0x200);    // 512 B
    this.vram    = new Uint8Array(0x18000);   // 96 KB
    this.oam     = new Uint8Array(0x400);     // 1 KB
    this.rom     = null;                      // up to 32 MB
    this.sram    = new Uint8Array(0x10000);   // 64 KB
    this.io      = new IO(this);
    this.openBus = 0;
  }

  reset() {
    this.eram.fill(0);
    this.iram.fill(0);
    this.palette.fill(0);
    this.vram.fill(0);
    this.oam.fill(0);
    this.sram.fill(0);
    this.openBus = 0;
    this.io.reset();
  }

  loadBIOS(buffer) {
    this.bios.set(new Uint8Array(buffer.slice(0,0x4000)));
  }

  loadROM(buffer) {
    this.rom = new Uint8Array(buffer);
  }

  read8(addr) {
    addr >>>= 0;
    let val;
    if (addr < 0x00004000) {
      val = this.bios[addr];
    } else if (addr < 0x02040000 && addr >= 0x02000000) {
      val = this.eram[addr - 0x02000000];
    } else if (addr < 0x03008000 && addr >= 0x03000000) {
      val = this.iram[addr - 0x03000000];
    } else if (addr < 0x04000400 && addr >= 0x04000000) {
      val = this.io.read(addr);
    } else if (addr < 0x05000400 && addr >= 0x05000000) {
      // palette is 16-bit, return low byte
      val = this.palette[(addr - 0x05000000) >>> 1] & 0xFF;
    } else if (addr < 0x06018000 && addr >= 0x06000000) {
      val = this.vram[addr - 0x06000000];
    } else if (addr < 0x07000400 && addr >= 0x07000000) {
      val = this.oam[addr - 0x07000000];
    } else if (addr < 0x0A000000 && addr >= 0x08000000 && this.rom) {
      val = this.rom[addr - 0x08000000];
    } else if (addr < 0x0E010000 && addr >= 0x0E000000) {
      val = this.sram[addr - 0x0E000000];
    } else {
      val = this.openBus & 0xFF;  // open-bus fallback
    }
    this.openBus = val;
    return val;
  }

  write8(addr, value) {
    addr >>>= 0;
    value &= 0xFF;
    if (addr < 0x00004000) {
      // BIOS read-only
    } else if (addr < 0x02040000 && addr >= 0x02000000) {
      this.eram[addr - 0x02000000] = value;
    } else if (addr < 0x03008000 && addr >= 0x03000000) {
      this.iram[addr - 0x03000000] = value;
    } else if (addr < 0x04000400 && addr >= 0x04000000) {
      this.io.write(addr, value);
    } else if (addr < 0x05000400 && addr >= 0x05000000) {
      // write low or high byte
      const i = (addr - 0x05000000) >>> 1;
      if (addr & 1) {
        this.palette[i] = (this.palette[i] & 0x00FF) | (value << 8);
      } else {
        this.palette[i] = (this.palette[i] & 0xFF00) | value;
      }
    } else if (addr < 0x06018000 && addr >= 0x06000000) {
      this.vram[addr - 0x06000000] = value;
    } else if (addr < 0x07000400 && addr >= 0x07000000) {
      this.oam[addr - 0x07000000] = value;
    } else if (addr < 0x0A000000 && addr >= 0x08000000) {
      // ROM is read-only
    } else if (addr < 0x0E010000 && addr >= 0x0E000000) {
      this.sram[addr - 0x0E000000] = value;
    }
    this.openBus = value;
  }

  read16(addr) {
    return this.read8(addr) | (this.read8(addr+1)<<8);
  }
  read32(addr) {
    return this.read16(addr) | (this.read16(addr+2)<<16);
  }
  write16(addr, v) {
    this.write8(addr, v & 0xFF);
    this.write8(addr+1, (v>>>8)&0xFF);
  }
  write32(addr, v) {
    this.write16(addr, v & 0xFFFF);
    this.write16(addr+2, (v>>>16)&0xFFFF);
  }
}
