// src/main-gba.js
import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';
import { IO }        from './io/index.js';
import { PPU }       from './ppu/index.js';
import { DMA }       from './dma/index.js';
import { Timers }    from './timers/index.js';
import { Input }     from './input/index.js';
import { APU }       from './apu/index.js';

export function startGBA() {
  const menu     = document.getElementById('menu');
  const canvas   = document.getElementById('screen');
  const ctx      = canvas.getContext('2d');
  const romInput = document.getElementById('romInput');

  // Show emulator UI
  menu.style.display     = 'none';
  canvas.style.display   = 'block';
  romInput.style.display = 'block';

  // Instantiate subsystems
  const memory = new MemoryBus();
  const io     = new IO(memory);
  const cpu    = new CPU(memory, io);
  const ppu    = new PPU(memory, io, ctx);
  const dma    = new DMA(memory, io);
  const timers = new Timers(memory, io);
  const input  = new Input(memory, io);
  const apu    = new APU(memory, io);

  function resetAll() {
    memory.reset();
    io.reset();
    cpu.reset();
    ppu.reset();
    dma.reset();
    timers.reset();
    input.reset();
    apu.reset();
  }

  function frame() {
    const CYCLES_PER_FRAME = Math.floor(16780000 / 60);
    let done = 0;
    while (done < CYCLES_PER_FRAME) {
      const c = cpu.step();    // fetch/decode/execute → cycles
      dma.step(c);
      timers.step(c);
      input.step();
      apu.step(c);
      done += c;
    }
    ppu.render();
    requestAnimationFrame(frame);
  }

  romInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      resetAll();
      memory.loadROM(reader.result);
      cpu.regs[15] = 0x08000000;  // reset vector
      console.log('GBA ROM loaded; starting emulation.');
      requestAnimationFrame(frame);
    };
    reader.readAsArrayBuffer(file);
  });
}
