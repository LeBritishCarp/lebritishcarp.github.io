// src/cpu/swi.js
export function handleSWI(insn, cpu) {
  cpu.regs[14] = cpu.regs[15];
  cpu.regs[15] = 0x08;   // BIOS SWI vector
  cpu.ime = false;
  return 5;
}
