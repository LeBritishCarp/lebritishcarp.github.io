// src/cpu/thumb.js
export function handleThumb(insn16, cpu) {
  // TODO: full 16-bit Thumb decoder (move/add, ALU, branches, etc.)
  console.warn(`Thumb mode unimplemented: 0x${insn16.toString(16)}`);
  return 1;
}
