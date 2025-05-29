// src/apu/index.js
export class APU {
  constructor(memory, io) {
    this.mem     = memory;
    this.io      = io;
    this.context = null;
    this.node    = null;
  }

  reset() {
    // Ensure audio is started when the emulator resets
    this._ensureAudio();
  }

  step(cycles) {
    // No per-cycle work for now; audio is driven in processAudio()
    this._ensureAudio();
  }

  _ensureAudio() {
    if (!this.context) {
      // Kick off Web Audio on first real work
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      // Create a ScriptProcessor to pull samples
      this.node = this.context.createScriptProcessor(1024, 0, 2);
      this.node.onaudioprocess = this._processAudio.bind(this);
      this.node.connect(this.context.destination);
    }
  }

  _processAudio(event) {
    const outL = event.outputBuffer.getChannelData(0);
    const outR = event.outputBuffer.getChannelData(1);

    // Read Direct-Sound FIFO A & B as 16-bit signed samples
    const fifoA = this.io.apu.FIFO_A; // Uint8Array[4]
    const fifoB = this.io.apu.FIFO_B; // Uint8Array[4]
    // sampleA = lower 16 bits; sampleB = next 16 bits
    const sampleA = ((fifoA[0] | (fifoA[1] << 8)) << 16) >> 16;
    const sampleB = ((fifoA[2] | (fifoA[3] << 8)) << 16) >> 16;
    const sampleC = ((fifoB[0] | (fifoB[1] << 8)) << 16) >> 16;
    const sampleD = ((fifoB[2] | (fifoB[3] << 8)) << 16) >> 16;

    // Mix: FIFO A → Left, FIFO B → Right (basic routing)
    // Normalize from [-32768,32767] → [-1,1]
    const left  = sampleA / 32768;
    const right = sampleC / 32768;

    for (let i = 0; i < outL.length; i++) {
      outL[i] = left;
      outR[i] = right;
    }
  }
}
