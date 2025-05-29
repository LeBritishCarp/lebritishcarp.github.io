// src/io/keypad.js
export class Keypad {
  constructor() { this.reset(); }

  reset() {
    this.value          = 0x03FF;     // bits0-9: 1=released, 0=pressed
    this.irqEnableMask  =    0;       // lower 10 bits mask for transitions
    this.irq            = false;     // set when a masked transition occurs
  }

  // Read KEYINPUT @ 0x04000130
  read() {
    // upper bits always read as 1
    return (this.value & 0x03FF) | 0xFC00;
  }

  // Read KEYCNT   @ 0x04000132
  readCNT() {
    return this.irqEnableMask & 0x03FF;
  }

  // Writes to KEYINPUT are ignored (read-only reg)
  writeInput(_value) {
    // no-op
  }

  // Write KEYCNT to set interrupt-on-change mask
  writeCNT(value) {
    this.irqEnableMask = value & 0x03FF;
  }
}
