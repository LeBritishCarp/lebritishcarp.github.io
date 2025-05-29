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
    this.cpsr  = 0;                     // [N Z C V _ T _ _]
    this.ime   = false;                 // Interrupt Master Enable
  }

  reset() {
    this.regs.fill(0);
    this.cpsr = 0;
    this.ime  = false;
  }

  step() {
    // align PC (bit0 = Thumb flag)
    const thumb = !!(this.cpsr & (1 << 5));
    let pc = this.regs[15] & (thumb ? 0xFFFFFFFE : 0xFFFFFFFC);
    let cycles = 0;

    if (thumb) {
      // ---- Thumb mode ----
      const insn16 = this.mem.read16(pc);
      this.regs[15] = (pc + 2) >>> 0;
      cycles = handleThumb(insn16, this);
    } else {
      // ---- ARM mode ----
      const insn32 = this.mem.read32(pc);
      this.regs[15] = (pc + 4) >>> 0;

      // Condition check (only “always” handled here)
      const cond = insn32 >>> 28;
      if (cond !== 0xF /* not “always” */ && !checkCondition(cond, this.cpsr)) {
        return 1; // predicate fail: 1 cycle penalty
      }

      const top2 = (insn32 >>> 26) & 0x3;
      if (top2 === 0b00) {
        // Data-Processing or Multiply
        if ((insn32 & 0x0FC000F0) === 0x00000090) {
          cycles = handleMul(insn32, this);
        } else {
          cycles = handleDP(insn32, this);
        }
      } else if (top2 === 0b01) {
        // LDR/STR
        cycles = handleMem(insn32, this);
      } else if (top2 === 0b10) {
        // Branch / Branch-with-link
        cycles = handleBranch(insn32, this);
      } else {
        // SWI or unimplemented
        if ((insn32 >>> 24) === 0xEF) cycles = handleSWI(insn32, this);
        else {
          console.warn(`Unimplemented ARM instr: 0x${insn32.toString(16)}`);
          cycles = 1;
        }
      }
    }

    // IRQ entry
    if (this.ime && this.io.timers.irq && !(this.cpsr & (1<<7))) {
      this.ime = false;
      // simple IRQ push
      this.regs[14] = this.regs[15];
      this.regs[15] = 0x18;
      this.cpsr |= (1<<7); // disable further IRQs
      cycles += 6;
    }

    return cycles;
  }
}

function checkCondition(cond, cpsr) {
  const N = (cpsr >>> 31) & 1;
  const Z = (cpsr >>> 30) & 1;
  const C = (cpsr >>> 29) & 1;
  const V = (cpsr >>> 28) & 1;
  switch (cond) {
    case 0x0: return Z === 1;            // EQ
    case 0x1: return Z === 0;            // NE
    case 0xA: return (N ^ V) === 0;      // GE
    case 0xB: return (N ^ V) === 1;      // LT
    case 0xC: return (Z === 0) && ((N ^ V) === 0); // GT
    case 0xD: return (Z === 1) || ((N ^ V) === 1); // LE
    case 0xE: return true;               // AL
    default:  return false;              // others unimplemented
  }
}
