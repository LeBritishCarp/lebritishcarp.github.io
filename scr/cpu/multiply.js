// src/cpu/multiply.js
export function handleMul(insn, cpu) {
  const A  = !!(insn & (1<<21));    // accumulate
  const S  = !!(insn & (1<<20));
  const Rd = (insn>>>16)&0xF;
  const Rn = (insn>>>12)&0xF;
  const Rm = insn & 0xF;
  const Rs = (insn>>>8)&0xF;
  let res = cpu.regs[Rm] * cpu.regs[Rs];
  if (A) res = (res + cpu.regs[Rn])>>>0;
  cpu.regs[Rd] = res>>>0;
  if (S) {
    cpu.cpsr = (cpu.cpsr & ~((1<<31)|(1<<30)))
             | ((res>>>31)<<31)
             | ((res===0?1:0)<<30);
  }
  return 3;
}
