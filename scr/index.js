// src/index.js
import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';

const canvas       = document.getElementById('screen');
const ctx          = canvas.getContext('2d');
const romInput     = document.getElementById('romInput');
const loadRomButton = document.getElementById('loadRomButton');

const memory = new MemoryBus();
const cpu    = new CPU(memory);

// simple frame‐loop that just draws a test background
function frame() {
  cpu.step();

  ctx.fillStyle = '#004';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(frame);
}

loadRomButton.addEventListener('click', () => {
  const file = romInput.files[0];
  if (!file) {
    alert('⚠️  Please choose a .gba file first');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    memory.loadROM(reader.result);

    // Set PC to the reset vector
    cpu.regs[15] = 0x08000000;

    alert('✅ ROM loaded! Starting emulation at PC=0x08000000');
    requestAnimationFrame(frame);
  };
  reader.readAsArrayBuffer(file);
});
