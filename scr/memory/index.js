// src/memory/index.js
export class MemoryBus {
  constructor() {
    this.ram = new Uint8Array(0x1000000);
    this.rom = null;         // will hold the .gba data
  }

  loadROM(buffer) {
    this.rom = new Uint8Array(buffer);
  }

  read8(addr) {
    addr = addr >>> 0;       // force to 32-bit unsigned
    // Cartridge ROM region: 0x0800_0000–0x09FF_FFFF (up to 32 MB)
    if (this.rom && addr >= 0x08000000 && addr < 0x08000000 + this.rom.length) {
      return this.rom[addr - 0x08000000];
    }
    return this.ram[addr & 0xFFFFFF];
  }

  write8(addr, value) {
    addr = addr >>> 0;
    // ignore writes into ROM
    if (addr >= 0x08000000 && this.rom) {
      console.warn(`Attempt to write ROM @ ${addr.toString(16)}`);
      return;
    }
    this.ram[addr & 0xFFFFFF] = value & 0xFF;
  }

  read16(addr)  { return this.read8(addr) | (this.read8(addr+1)<<8); }
  read32(addr)  { return this.read16(addr) | (this.read16(addr+2)<<16); }
}
