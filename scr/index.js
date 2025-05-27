// src/index.js
import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';

const canvas = document.getElementById('screen');
const ctx    = canvas.getContext('2d');
const romInput = document.getElementById('romInput');

const memory = new MemoryBus();
const cpu    = new CPU(memory);

// main loop stub
function frame() {
  cpu.step();
  // ...later: render via ctx
  requestAnimationFrame(frame);
}

// when a .gba is selected, load it and kick off emulation
romInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    memory.loadROM(reader.result);

    // Set PC to the reset vector at 0x08000000
    cpu.regs[15] = 0x08000000;
    console.log('ROM loaded, starting at 0x08000000');

    requestAnimationFrame(frame);
  };
  reader.readAsArrayBuffer(file);
});
