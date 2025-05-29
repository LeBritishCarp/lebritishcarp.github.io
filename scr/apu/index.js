// src/apu/index.js
export class APU {
  constructor(memory, io) {
    this.mem = memory;
    this.io  = io;
    this.context = null;
    this.node    = null;
  }

  reset() {
    // If needed, tear down / restart WebAudio
    if (this.node) {
      this.node.disconnect();
      this.node = null;
    }
    if (this.context && this.context.state !== 'closed') {
      // keep context alive
    }
  }

  // Called by your main loop once per CPU step (or batch of cycles)
  step(cycles) {
    // TODO: implement frame-sequencer ticks (512 Hz) to clock sweeps, lengths, envelopes
    //       update DIV-APU counters and generate new samples
  }

  // Kick off audio when the user first interacts (Autoplay policy)
  startAudio() {
    if (!this.context) {
      this.context = new (window.AudioContext||window.webkitAudioContext)();
      this.node = this.context.createScriptProcessor(1024, 0, 2);
      this.node.onaudioprocess = this.processAudio.bind(this);
      this.node.connect(this.context.destination);
    }
  }

  // Fills the output buffer each time AudioContext requests more samples
  processAudio(e) {
    const outL = e.outputBuffer.getChannelData(0);
    const outR = e.outputBuffer.getChannelData(1);
    for (let i = 0; i < outL.length; i++) {
      // mix legacy channels and direct-sound here
      outL[i] = 0;
      outR[i] = 0;
      // e.g. read sample from FIFO_A/B when enabled, decrement timer, etc.
    }
  }
}
