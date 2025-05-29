// src/cpu/branch.js
export function handleBranch(insn, cpu) {
  const L   = !!(insn & (1<<24));
  let offset = (insn & 0x00FFFFFF) << 2;
  if (offset & 0x02000000) offset |= 0xFC000000; // sign-extend
  const pc = cpu.regs[15];
  if (L) cpu.regs[14] = pc;
  cpu.regs[15] = (pc + offset) >>> 0;
  return 3;
}
