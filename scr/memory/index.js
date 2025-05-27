// src/memory/index.js
export class MemoryBus {
  constructor() {
    // 16 MB address space (0x00000000–0x00FFFFFF)
    this.ram = new Uint8Array(0x1000000);
  }

  read8(addr) {
    return this.ram[addr & 0xFFFFFF];
  }

  write8(addr, value) {
    this.ram[addr & 0xFFFFFF] = value & 0xFF;
  }

  // helpers for 16/32-bit accesses
  read16(addr) {
    const lo = this.read8(addr);
    const hi = this.read8(addr + 1);
    return lo | (hi << 8);
  }

  read32(addr) {
    const w0 = this.read16(addr);
    const w1 = this.read16(addr + 2);
    return w0 | (w1 << 16);
  }
}
