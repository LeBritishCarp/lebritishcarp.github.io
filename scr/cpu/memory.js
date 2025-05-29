// src/cpu/memory.js
export function handleMem(insn, cpu) {
  const L = !!(insn & (1<<20));
  const Rn = (insn >>> 16) & 0xF;
  const Rd = (insn >>> 12) & 0xF;
  const offset = decodeOffset(insn, cpu);
  const addr = (cpu.regs[Rn] + offset) >>> 0;

  if (L) {
    cpu.regs[Rd] = cpu.mem.read32(addr);
  } else {
    cpu.mem.write8(addr, cpu.regs[Rd] & 0xFF);
  }
  return 2;
}

function decodeOffset(insn, cpu) {
  if (insn & (1<<25)) {
    // immediate
    return insn & 0xFFF;
  } else {
    // register
    const Rm = insn & 0xF;
    return cpu.regs[Rm];
  }
}
