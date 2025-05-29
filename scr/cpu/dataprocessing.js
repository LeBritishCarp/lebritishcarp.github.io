// src/cpu/dataprocessing.js
export function handleDP(insn, cpu) {
  const cond = insn >>> 28;
  // TODO: condition check

  const opcode = (insn >>> 21) & 0xF;
  const S      = !!(insn & (1<<20));
  const Rn     = (insn >>> 16) & 0xF;
  const Rd     = (insn >>> 12) & 0xF;
  const op2    = insn & 0xFFF;

  let operand1 = cpu.regs[Rn], operand2 = decodeOperand2(insn, cpu);
  let result = 0;

  switch (opcode) {
    case 0x4: // ADD
      result = (operand1 + operand2) >>> 0;
      cpu.regs[Rd] = result;
      if (S) setFlags(cpu, operand1, operand2, result, 'ADD');
      break;
    case 0x2: // SUB
      result = (operand1 - operand2) >>> 0;
      cpu.regs[Rd] = result;
      if (S) setFlags(cpu, operand1, operand2, result, 'SUB');
      break;
    case 0xA: // CMP
      result = (operand1 - operand2) >>> 0;
      if (S) setFlags(cpu, operand1, operand2, result, 'SUB');
      break;
    case 0xD: // MOV
      result = operand2;
      cpu.regs[Rd] = result;
      if (S) setNZ(cpu, result);
      break;
    default:
      console.warn(`DP opcode ${opcode.toString(16)} unimplemented`);
  }
  return 1;
}

function decodeOperand2(insn, cpu) {
  if (insn & (1<<25)) {
    // immediate rotate
    const imm = insn & 0xFF;
    const rot = ((insn >>> 8) & 0xF) * 2;
    return (imm >>> rot) | (imm << (32-rot));
  } else {
    // register plus optional shift
    const Rm = insn & 0xF;
    // TODO: implement register-shift variants
    return cpu.regs[Rm];
  }
}

function setFlags(cpu, a, b, res, op) {
  // N
  cpu.cpsr = (cpu.cpsr & ~(1<<31)) | ((res >>> 31) << 31);
  // Z
  cpu.cpsr = (cpu.cpsr & ~(1<<30)) | ((res === 0 ? 1:0) << 30);
  // C/V for ADD/SUB omit for brevity
}

function setNZ(cpu, res) {
  // Only N/Z
  cpu.cpsr = (cpu.cpsr & ~((1<<31)|(1<<30)))
           | ((res>>>31)<<31)
           | ((res===0?1:0)<<30);
}
