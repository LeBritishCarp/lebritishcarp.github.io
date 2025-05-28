// src/input/index.js
export class Input {
  constructor(memory, io) {
    this.memory = memory;
    this.io     = io;
    this.state  = 0x03FF; // all released
  }
  reset() {
    this.state = 0x03FF;
  }
  step() {
    // TODO: poll keyboard or on-screen buttons,
    //       update this.state, write to IO register 0x04000130
  }
}
