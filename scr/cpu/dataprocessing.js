// src/cpu/dataprocessing.js
export function handleDP(insn, cpu) {
  const opcode = (insn >>> 21) & 0xF;
  const S      = !!(insn & (1<<20));
  const Rn     = (insn >>> 16) & 0xF;
  const Rd     = (insn >>> 12) & 0xF;
  const op2    = decodeOperand2(insn, cpu);

  const A = cpu.regs[Rn];
  let result;

  switch (opcode) {
    case 0x0: // AND
      result = A & op2;
      cpu.regs[Rd] = result;
      if (S) setNZC(cpu, result, cpu.cpsr>>29&1);
      break;
    case 0x1: // EOR
      result = A ^ op2;
      cpu.regs[Rd] = result;
      if (S) setNZC(cpu, result, cpu.cpsr>>29&1);
      break;
    case 0x2: // SUB
      result = (A - op2) >>> 0;
      cpu.regs[Rd] = result;
      if (S) setNZCV(cpu, A, op2, result, 'SUB');
      break;
    case 0x4: // ADD
      result = (A + op2) >>> 0;
      cpu.regs[Rd] = result;
      if (S) setNZCV(cpu, A, op2, result, 'ADD');
      break;
    case 0xA: // CMP
      result = (A - op2) >>> 0;
      setNZCV(cpu, A, op2, result, 'SUB');
      break;
    case 0xD: // MOV
      result = op2;
      cpu.regs[Rd] = result;
      if (S) setNZC(cpu, result, cpu.cpsr>>29&1);
      break;
    default:
      console.warn(`Unimplemented DP opcode: 0x${opcode.toString(16)}`);
  }
  return 1;
}

function decodeOperand2(insn, cpu) {
  if (insn & (1<<25)) {
    // immediate
    const imm = insn & 0xFF;
    const rot = ((insn >>> 8) & 0xF) * 2;
    return (imm >>> rot) | ((imm << (32 - rot)) >>> 0);
  } else {
    // register + shift (no shift here)
    const Rm = insn & 0xF;
    return cpu.regs[Rm];
  }
}

function setNZC(cpu, res, oldC) {
  cpu.cpsr = (cpu.cpsr & ~((1<<31)|(1<<30)|(1<<29)))
           | ((res>>>31)<<31)
           | ((res===0?1:0)<<30)
           | ((oldC?1:0)<<29);
}

function setNZCV(cpu, A, B, res, op) {
  setNZC(cpu, res, (op==='ADD'? (A+B>0xFFFFFFFF): (A>=B)));
  // V flag omitted for brevity
}
