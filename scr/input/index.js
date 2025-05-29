// src/input/index.js
export class Input {
  constructor(mem, io) {
    this.io = io; this.mem = mem;
    this.state = 0x03FF;
    window.addEventListener('keydown', e => this.setKey(e.code, false));
    window.addEventListener('keyup',   e => this.setKey(e.code, true));
  }
  reset() { this.state = 0x03FF; this.io.keypad.irq=false; }
  setKey(code, released) {
    const maskMap = {
      ArrowUp:    0x0400,
      ArrowDown:  0x0800,
      ArrowLeft:  0x0200,
      ArrowRight: 0x0100,
      KeyZ:       0x0010, // A
      KeyX:       0x0020, // B
      Enter:      0x0004, // Start
      ShiftRight: 0x0008, // Select
    };
    if (!(code in maskMap)) return;
    const mask = maskMap[code];
    const old  = this.state;
    this.state = released ? this.state|mask : this.state&~mask;
    this.io.keypad.value = this.state;
    if ((old ^ this.state) & this.io.keypad.irqEnable) {
      this.io.keypad.irq = true;
    }
  }
  step() { /* nothing else needed */ }
}
