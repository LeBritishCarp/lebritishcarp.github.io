// src/io/index.js
import { PPURegs }    from './ppu-regs.js';
import { DMARegs }    from './dma-regs.js';
import { TimerRegs }  from './timers-regs.js';
import { Keypad }     from './keypad.js';
import { APURegs }    from './apu-regs.js';

export class IO {
  constructor(memory) {
    this.memory = memory;
    this.ppu    = new PPURegs();
    this.dma    = new DMARegs();
    this.timers = new TimerRegs();
    this.keypad = new Keypad();
    this.apu    = new APURegs();
  }

  reset() {
    this.ppu.reset();
    this.dma.reset();
    this.timers.reset();
    this.keypad.reset();
    this.apu.reset();
  }

  read(addr) {
    addr >>>= 0;
    // PPU registers: 0x0400_0000–0x0400_00FF
    if (addr >= 0x04000000 && addr < 0x04000100) {
      return this.ppu.read(addr);
    }
    // Keypad input: 0x0400_0130
    if (addr === 0x04000130) {
      return this.keypad.read();
    }
    // DMA channels 0–3: 0x0400_0100–0x0400_03FF
    if (addr >= 0x04000100 && addr < 0x04000400) {
      return this.dma.read(addr);
    }
    // Timers 0–3: 0x0400_0400–0x0400_04FF
    if (addr >= 0x04000400 && addr < 0x04000500) {
      return this.timers.read(addr);
    }
    // APU FIFO:    0x0400_0500–0x0400_05FF
    if (addr >= 0x04000500 && addr < 0x04000600) {
      return this.apu.readFIFO(addr);
    }
    // APU channels:0x0400_0600–0x0400_07FF
    if (addr >= 0x04000600 && addr < 0x04000800) {
      return this.apu.read(addr);
    }
    // All other IO addresses return open-bus (0 if untracked)
    return 0;
  }

  write(addr, value) {
    addr >>>= 0;
    value &= 0xFF;

    // PPU registers
    if (addr >= 0x04000000 && addr < 0x04000100) {
      this.ppu.write(addr, value);
      return;
    }
    // Keypad input
    if (addr === 0x04000130) {
      this.keypad.write(value);
      return;
    }
    // DMA channels
    if (addr >= 0x04000100 && addr < 0x04000400) {
      this.dma.write(addr, value);
      return;
    }
    // Timers 0–3
    if (addr >= 0x04000400 && addr < 0x04000500) {
      this.timers.write(addr, value);
      return;
    }
    // APU FIFO
    if (addr >= 0x04000500 && addr < 0x04000600) {
      this.apu.writeFIFO(addr, value);
      return;
    }
    // APU channels
    if (addr >= 0x04000600 && addr < 0x04000800) {
      this.apu.write(addr, value);
      return;
    }
    // Writes to other IO registers are ignored
  }
}
