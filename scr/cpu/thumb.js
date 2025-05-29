// src/cpu/thumb.js
// Basic Thumb decoder: moves, ALU, and branches
export function handleThumb(insn, cpu) {
  const op = insn >>> 11;
  // 000xx: shift by imm
  if (op <= 0x03) {
    const rd = (insn >>> 0) & 0x7;
    const rm = (insn >>> 3) & 0x7;
    const imm = (insn >>> 6) & 0x1F;
    switch ((insn >>> 5) & 0x3) {
      case 0: cpu.regs[rd] = (cpu.regs[rm] << imm) >>> 0; break; // LSL
      case 1: cpu.regs[rd] = cpu.regs[rm] >>> imm; break;        // LSR
      case 2: cpu.regs[rd] = cpu.regs[rm] >> imm; break;         // ASR
    }
    return 1;
  }
  // 11100 = unconditional branch
  if ((insn & 0xF800) === 0xE000) {
    const offset = ((insn & 0x07FF) << 1);
    cpu.regs[15] = (cpu.regs[15] + offset) >>> 0;
    return 3;
  }
  console.warn(`Thumb unimpl: 0x${insn.toString(16)}`);
  return 1;
}
