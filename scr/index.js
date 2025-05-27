// src/index.js
import { CPU } from './cpu/index.js';
import { MemoryBus } from './memory/index.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('⚙️  DOM loaded, initializing emulator…');

  const canvas        = document.getElementById('screen');
  const ctx           = canvas.getContext('2d');
  const romInput      = document.getElementById('romInput');
  const loadRomButton = document.getElementById('loadRomButton');

  console.log({ romInput, loadRomButton });

  const memory = new MemoryBus();
  const cpu    = new CPU(memory);

  function frame() {
    cpu.step();

    // simple visual to prove the loop runs
    ctx.fillStyle = '#004';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(frame);
  }

  loadRomButton.addEventListener('click', () => {
    console.log('▶️  Load ROM button clicked');
    if (!romInput.files || romInput.files.length === 0) {
      alert('⚠️  Please select a .gba file first.');
      return;
    }

    const file = romInput.files[0];
    console.log('📁  Selected file:', file.name);

    const reader = new FileReader();
    reader.onload = () => {
      console.log('✅  FileReader loaded, byteLength =', reader.result.byteLength);
      memory.loadROM(reader.result);

      // reset the PC to the GBA start address
      cpu.regs[15] = 0x08000000;
      console.log('🔁  CPU PC set to 0x08000000');

      alert('✅  ROM loaded! Starting emulation…');
      requestAnimationFrame(frame);
    };
    reader.onerror = (err) => {
      console.error('❌  FileReader error', err);
      alert('❌  Error reading ROM file');
    };
    reader.readAsArrayBuffer(file);
  });
});
