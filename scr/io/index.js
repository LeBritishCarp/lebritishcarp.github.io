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
    // dispatch to each submodule based on address
    if (addr < 0x04000100) return this.ppu.read(addr);
    if (addr < 0x04000400) return this.dma.read(addr);
    if (addr < 0x04000500) return this.timers.read(addr);
    if (addr === 0x04000130)    return this.keypad.read();
    if (addr < 0x04000800) return this.apu.read(addr);
    return 0;
  }

  write(addr, value) {
    if (addr < 0x04000100) return this.ppu.write(addr, value);
    if (addr < 0x04000400) return this.dma.write(addr, value);
    if (addr < 0x04000500) return this.timers.write(addr, value);
    if (addr === 0x04000130)    return this.keypad.write(value);
    if (addr < 0x04000800) return this.apu.write(addr, value);
  }
}
