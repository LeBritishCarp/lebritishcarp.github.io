// src/cpu/index.js
export class CPU {
  constructor(memory, io) {
    this.memory = memory;
    this.io     = io;
    this.regs   = new Uint32Array(16); // R0–R15
    this.cpsr   = 0;                   // status flags & mode bits
  }

  reset() {
    this.regs.fill(0);
    this.cpsr = 0;
  }

  step() {
    const pc = this.regs[15] & 0xFFFFFFFC;
    // fetch 32-bit instruction (ARM) or 16-bit (Thumb) depending on CPSR.T
    const insn = (this.cpsr & (1<<5))
      ? this.memory.read16(pc)
      : this.memory.read32(pc);

    // TODO: decode `insn` into opcode class (Data-Processing, Branch, LDR/STR, etc.)
    // TODO: execute it, updating regs, CPSR flags, possibly raising SWI/IRQ
    // For now, stub: just advance PC by 4 and return 1 cycle
    this.regs[15] = pc + 4;
    return 1;
  }
}
