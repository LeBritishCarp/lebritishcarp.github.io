// src/ppu/index.js
export class PPU {
  constructor(memory, ctx) {
    this.memory = memory;
    this.ctx = ctx;
    // prepare an ImageData buffer for 240×160 pixels
    this.imageData = ctx.createImageData(240, 160);
  }

  render() {
    // For now: clear to solid magenta so you can see updates
    const data = this.imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i]   = 255; // R
      data[i+1] =   0; // G
      data[i+2] = 255; // B
      data[i+3] = 255; // A
    }
    // draw the buffer onto the canvas (scaled up automatically by CSS/HTML)
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
