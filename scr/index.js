// src/index.js
import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';

const canvas   = document.getElementById('screen');
const ctx      = canvas.getContext('2d');
const romInput = document.getElementById('romInput');

const memory = new MemoryBus();
const cpu    = new CPU(memory);

function frame() {
  cpu.step();

  // Draw a solid background each frame as a visual check
  ctx.fillStyle = '#004';          
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: replace with real PPU rendering
  requestAnimationFrame(frame);
}

romInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    memory.loadROM(reader.result);

    // Initialize PC to the GBA reset vector
    cpu.regs[15] = 0x08000000;

    // Confirm that the ROM loaded successfully
    alert('✅ ROM loaded! Starting emulation at PC=0x08000000');

    // Start the emulation loop
    requestAnimationFrame(frame);
  };
  reader.readAsArrayBuffer(file);
});
