// src/apu/index.js
export class APU {
  constructor(mem, io) {
    this.io  = io; this.mem = mem;
    this.ctx = new AudioContext();
    this.ch1 = this.ctx.createOscillator();
    this.ch1.frequency.value = 440;
    this.ch1.connect(this.ctx.destination);
    this.ch1.start();
  }
  reset() {
    // TODO: stop/start channels based on registers
  }
  step(cycles) {
    // TODO: clock envelopes & length, update oscillator frequencies
  }
}
