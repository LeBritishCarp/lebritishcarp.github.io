// src/cpu/multiply.js
export function handleMul(insn, cpu) {
  const A  = !!(insn & (1<<21));    // accumulate?
  const S  = !!(insn & (1<<20));    // set flags?
  const Rd = (insn >>> 16) & 0xF;
  const Rn = (insn >>> 12) & 0xF;
  const Rs = (insn >>> 8)  & 0xF;
  const Rm = insn & 0xF;

  let result = (cpu.regs[Rm] * cpu.regs[Rs]) >>> 0;
  if (A) result = (result + cpu.regs[Rn]) >>> 0;
  cpu.regs[Rd] = result;
  if (S) {
    cpu.cpsr = (cpu.cpsr & ~((1<<31)|(1<<30)))
             | ((result>>>31)<<31)
             | ((result===0?1:0)<<30);
  }
  return 3;
}
