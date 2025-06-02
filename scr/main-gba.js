// src/main-gba.js
import { log }        from './util/log.js';
import { CPU }        from './cpu/index.js';
import { MemoryBus }  from './memory/index.js';
import { IO }         from './io/index.js';
import { PPU }        from './ppu/index.js';
import { DMA }        from './dma/index.js';
import { Timers }     from './timers/index.js';
import { Input }      from './input/index.js';
import { APU }        from './apu/index.js';
import { PPULine }    from './ppu/timing.js';
import { saveState, loadState } from './state.js';

export function startGBA() {
  log('startGBA() called—initializing emulator…');

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
  const raster = new PPULine(io, dma, cpu);

  // Add Save/Load buttons (below canvas)
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save State';
  document.body.appendChild(saveBtn);

  const loadBtn = document.createElement('button');
  loadBtn.textContent = 'Load State';
  document.body.appendChild(loadBtn);

  const fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = '.json'; fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  saveBtn.addEventListener('click', () => {
    log('Save State button clicked');
    saveState({ cpu, memory, io, ppu, dma, timers, input, apu, raster });
  });

  loadBtn.addEventListener('click', () => {
    log('Load State button clicked');
    fileInput.click();
  });

  fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    log('State file selected:', f);
    if (!f) return;
    const rdr = new FileReader();
    rdr.onload = () => {
      log('State JSON loaded, restoring state…');
      loadState({ cpu, memory, io, ppu, dma, timers, input, apu, raster }, rdr.result);
      log('State restored.');
    };
    rdr.readAsText(f);
  });

  function resetAll() {
    memory.reset();
    io.reset();
    cpu.reset();
    ppu.reset();
    dma.reset();
    timers.reset();
    input.reset();
    apu.reset();
    raster.line = 0;
    log('All subsystems reset.');
  }

  romInput.addEventListener('change', e => {
    const file = e.target.files[0];
    log('ROM file selected:', file);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      log('ROM loaded into FileReader, size:', reader.result.byteLength, 'bytes');
      resetAll();
      memory.loadROM(reader.result);
      cpu.regs[15] = 0x08000000; // reset vector
      log('Beginning frame loop…');
      runFrame();
    };
    reader.readAsArrayBuffer(file);
  });

  function runFrame() {
    const cyclesPerLine = 16780000 / 60 / 228;
    let currentLine = 0;

    function doLine() {
      let done = 0;
      while (done < cyclesPerLine) {
        const c = cpu.step();
        dma.step(c);
        timers.step(c);
        input.step();
        apu.step(c);
        done += c;
      }
      raster.nextLine();
      currentLine++;
      if (currentLine < 228) {
        requestAnimationFrame(doLine);
      } else {
        ppu.render();
        requestAnimationFrame(doLine);
      }
    }
    requestAnimationFrame(doLine);
  }
}
