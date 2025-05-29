// src/cpu/index.js
import { handleDP }     from './dataprocessing.js';
import { handleMem }    from './memory.js';
import { handleMul }    from './multiply.js';
import { handleBranch } from './branch.js';
import { handleSWI }    from './swi.js';
import { handleThumb }  from './thumb.js';

export class CPU {
  constructor(memory, io) {
    this.mem   = memory;
    this.io    = io;
    this.regs  = new Uint32Array(16);  // R0–R15
    this.cpsr  = 0;                    // N Z C V flags + T bit (5)
    this.ime   = false;                // Interrupt Master Enable
  }

  reset() {
    this.regs.fill(0);
    this.cpsr = 0;
    this.ime  = false;
  }

  step() {
    // align PC
    let pc = this.regs[15] & (this.cpsr & (1<<5) ? 0xFFFFFFFE : 0xFFFFFFFC);
    let cycles;

    if (this.cpsr & (1 << 5)) {
      // Thumb mode: 16-bit opcodes
      const insn16 = this.mem.read16(pc);
      this.regs[15] = pc + 2;
      cycles = handleThumb(insn16, this);
    } else {
      // ARM mode: 32-bit opcodes
      const insn32 = this.mem.read32(pc);
      this.regs[15] = pc + 4;

      // classify and dispatch
      const top2 = (insn32 >>> 26) & 0x3;
      if ((insn32 >>> 28) !== 0xF) { // condition pass (TODO: full cond check)
        if (top2 === 0b00) {
          // Data-Processing / misc
          if ((insn32 & 0x0FC000F0) === 0x00000090) {
            cycles = handleMul(insn32, this);
          } else {
            cycles = handleDP(insn32, this);
          }
        } else if (top2 === 0b01) {
          // LDR/STR
          cycles = handleMem(insn32, this);
        } else if (top2 === 0b10) {
          // Branch with link?
          cycles = handleBranch(insn32, this);
        } else {
          // SWI?
          if ((insn32 >>> 24) === 0xEF) cycles = handleSWI(insn32, this);
          else {
            console.warn(`Unimplemented ARM insn: 0x${insn32.toString(16)}`);
            cycles = 1;
          }
        }
      } else {
        // Always condition: SWI is 0xEF…
        if ((insn32 >>> 24) === 0xEF) cycles = handleSWI(insn32, this);
        else {
          console.warn(`Condition failed or unhandled insn: 0x${insn32.toString(16)}`);
          cycles = 1;
        }
      }
    }

    // IRQ check
    if (this.ime && this.io.timers.irq && !(this.cpsr & (1<<7))) {
      this.ime = false;
      // simple IRQ entry
      this.regs[14] = this.regs[15];
      this.regs[15] = 0x18;
      this.cpsr |= (1<<7);
      cycles += 6;
    }

    return cycles;
  }
}
