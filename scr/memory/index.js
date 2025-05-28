// src/memory/index.js
import { IO } from '../io/index.js';

export class MemoryBus {
  constructor() {
    this.ram  = new Uint8Array(0x1000000);
    this.vram = new Uint8Array(0x18000);
    this.rom  = null;
    this.io   = new IO(this);
  }

  reset() {
    this.ram.fill(0);
    this.vram.fill(0);
    this.io.reset();
  }

  loadROM(buffer) {
    this.rom = new Uint8Array(buffer);
  }

  read8(addr) {
    addr = addr >>> 0;
    if (addr >= 0x06000000 && addr < 0x06000000 + this.vram.length) {
      return this.vram[addr - 0x06000000];
    }
    if (addr >= 0x08000000 && this.rom
        && addr < 0x08000000 + this.rom.length) {
      return this.rom[addr - 0x08000000];
    }
    if (addr >= 0x04000000 && addr < 0x04000400) {
      return this.io.read(addr);
    }
    return this.ram[addr & 0xFFFFFF];
  }

  write8(addr, value) {
    addr = addr >>> 0;
    value &= 0xFF;
    if (addr >= 0x06000000 && addr < 0x06000000 + this.vram.length) {
      this.vram[addr - 0x06000000] = value;
      return;
    }
    if (addr >= 0x04000000 && addr < 0x04000400) {
      this.io.write(addr, value);
      return;
    }
    if (addr >= 0x08000000 && this.rom) {
      console.warn(`Attempt to write ROM @ ${addr.toString(16)}`);
      return;
    }
    this.ram[addr & 0xFFFFFF] = value;
  }

  read16(addr) {
    return this.read8(addr) | (this.read8(addr + 1) << 8);
  }

  read32(addr) {
    return this.read16(addr) | (this.read16(addr + 2) << 16);
  }
}
