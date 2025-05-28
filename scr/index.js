// src/index.js
import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';
import { IO }        from './io/index.js';
import { PPU }       from './ppu/index.js';
import { DMA }       from './dma/index.js';
import { Timers }    from './timers/index.js';
import { Input }     from './input/index.js';
import { APU }       from './apu/index.js';

const canvas   = document.getElementById('screen');
const ctx      = canvas.getContext('2d');
const romInput = document.getElementById('romInput');

const memory = new MemoryBus();
const io     = new IO(memory);
const cpu    = new CPU(memory, io);
const ppu    = new PPU(memory, io, ctx);
const dma    = new DMA(memory, io);
const timers = new Timers(memory, io);
const input  = new Input(memory, io);
const apu    = new APU(memory, io);

function frame() {
  // Approximate cycles per 60 Hz frame on a 16.78 MHz GBA
  const CYCLES_PER_FRAME = 16780000 / 60 | 0;
  let done = 0;
  while (done < CYCLES_PER_FRAME) {
    const cycles = cpu.step();    // fetch-decode-execute → returns cycles used
    dma.step(cycles);             // handle DMA timing
    timers.step(cycles);          // advance timers → may trigger IRQ
    input.step();                 // poll/update keypad state
    apu.step(cycles);             // advance audio channels
    done += cycles;
  }

  ppu.render();                  // draw one full frame
  requestAnimationFrame(frame);
}

romInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    memory.reset();
    io.reset();
    cpu.reset();
    ppu.reset();
    dma.reset();
    timers.reset();
    input.reset();
    apu.reset();

    memory.loadROM(reader.result);
    cpu.regs[15] = 0x08000000;   // reset vector
    console.log('ROM loaded, starting at 0x08000000');
    requestAnimationFrame(frame);
  };
  reader.readAsArrayBuffer(file);
});
