// src/cpu/index.js
import { handleDP }      from './dataprocessing.js';
import { handleMem }     from './memory.js';
import { handleMul }     from './multiply.js';
import { handleBranch }  from './branch.js';
import { handleSWI }     from './swi.js';

export class CPU {
  constructor(memory, io) {
    this.mem   = memory;
    this.io    = io;
    this.regs  = new Uint32Array(16); // R0–R15
    this.cpsr  = 0;                   // flags & T bit at bit 5
    this.ime   = false;               // Interrupt Master Enable
  }

  reset() {
    this.regs.fill(0);
    this.cpsr = 0;
    this.ime  = false;
  }

  step() {
    const pc = this.regs[15] & 0xFFFFFFFC;
    // Fetch
    let insn, isThumb = !!(this.cpsr & (1 << 5));
    if (isThumb) {
      insn = this.mem.read16(pc);
      this.regs[15] = pc + 2;
    } else {
      insn = this.mem.read32(pc);
      this.regs[15] = pc + 4;
    }

    // Decode & Execute
    let cycles = 0;
    const opclass = (insn >>> (isThumb ? 10 : 25)) & (isThumb ? 0x3F : 0x7); 

    // simplified dispatch (by opcode patterns)
    if (!isThumb && (insn & 0x0C000000) >>> 26 === 0b00) {
      // Data-Processing or miscellaneous
      cycles = handleDP(insn, this);
    } else if (!isThumb && (insn & 0x0C000000) >>> 26 === 0b01) {
      // LDR/STR
      cycles = handleMem(insn, this);
    } else if (!isThumb && (insn & 0x0FC000F0) === 0x00000090) {
      // Multiply or Multiply-Accumulate
      cycles = handleMul(insn, this);
    } else if (!isThumb && ((insn & 0x0E000000) >>> 25) === 0b101) {
      // B, BL
      cycles = handleBranch(insn, this);
    } else if (!isThumb && ((insn >>> 24) === 0xEF)) {
      // SWI
      cycles = handleSWI(insn, this);
    } else {
      // TODO: Thumb decoding & other classes
      console.warn(`Unhandled instruction ${insn.toString(16)}`);
      cycles = 1;
    }

    // Check IRQ
    if (this.ime && this.io.timers.irq && !(this.cpsr & (1<<7))) {
      // Enter IRQ: push CPSR & PC onto stack, switch to IRQ mode, vector
      this.ime = false;
      // TODO: implement full IRQ stacking
      this.regs[14] = this.regs[15];
      this.regs[15] = 0x00000018;
      this.cpsr |= (1<<7); // disable further IRQs
      cycles += 6;
    }

    return cycles;
  }
}
