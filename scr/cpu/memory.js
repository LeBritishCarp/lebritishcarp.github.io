// src/cpu/memory.js
export function handleMem(insn, cpu) {
  const L  = !!(insn & (1<<20));
  const Rn = (insn >>> 16) & 0xF;
  const Rd = (insn >>> 12) & 0xF;
  const U  = !!(insn & (1<<23));
  const P  = !!(insn & (1<<24));
  const W  = !!(insn & (1<<21));
  const offset = decodeOffset(insn, cpu);
  let addr = cpu.regs[Rn] + (U ? offset : -offset);

  if (P && W) cpu.regs[Rn] = addr; // write-back

  if (L) {
    // loads: byte/half/word based on bits 22:21 (simplified to word)
    cpu.regs[Rd] = cpu.mem.read32(addr);
  } else {
    // stores: same simplification
    cpu.mem.write32(addr, cpu.regs[Rd]);
  }

  return 2;
}

function decodeOffset(insn, cpu) {
  if (insn & (1<<25)) {
    // immediate offset
    return insn & 0xFFF;
  } else {
    // register + optional shift
    const Rm = insn & 0xF;
    const shiftType = (insn >>> 5) & 0x3;
    const shiftImm  = (insn >>> 7) & 0x1F;
    let val = cpu.regs[Rm];
    switch (shiftType) {
      case 0: return (val << shiftImm) >>> 0;           // LSL
      case 1: return (val >>> shiftImm) >>> 0;          // LSR
      case 2: return (val >> shiftImm) >>> 0;           // ASR
      case 3: // ROR / RRX
        return shiftImm
          ? (((val >>> shiftImm) | (val << (32-shiftImm))) >>> 0)
          : ((((cpu.cpsr>>>29)&1)<<31 | (val>>>1))>>>0);
    }
  }
}
