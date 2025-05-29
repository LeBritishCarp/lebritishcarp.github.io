// src/cpu/swi.js
export function handleSWI(insn, cpu) {
  const swiNum = insn & 0x00FFFFFF;
  // vector to BIOS routine table at 0x00000008
  cpu.regs[14] = cpu.regs[15];
  cpu.regs[15] = 0x00000008;
  cpu.ime = false;
  return 5;
}
