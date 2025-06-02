// src/state.js
export function saveState(mods) {
  const {
    cpu, memory, io, ppu, dma, timers, input, apu, raster
  } = mods;

  // Serialize buffer-backed state as arrays
  const state = {
    cpu: { regs: Array.from(cpu.regs), cpsr: cpu.cpsr, ime: cpu.ime },
    memory: {
      bios: Array.from(memory.bios),
      eram: Array.from(memory.eram),
      iram: Array.from(memory.iram),
      palette: Array.from(memory.palette),
      vram: Array.from(memory.vram),
      oam: Array.from(memory.oam),
      rom: Array.from(memory.rom || []),
      sram: Array.from(memory.sram),
      openBus: memory.openBus
    },
    io: {
      ppu: { ...io.ppu },
      dma: io.dma.ch.map(ch => ({ ...ch })),
      timers: {
        ch: io.timers.ch.map(t => ({ ...t })),
        irq: io.timers.irq
      },
      keypad: {
        value: io.keypad.value,
        irqEnableMask: io.keypad.irqEnableMask
      },
      apu: {
        SOUND1CNT_L: io.apu.SOUND1CNT_L,
        SOUND1CNT_H: io.apu.SOUND1CNT_H,
        SOUND1CNT_X: io.apu.SOUND1CNT_X,
        SOUND2CNT_L: io.apu.SOUND2CNT_L,
        SOUND2CNT_H: io.apu.SOUND2CNT_H,
        SOUND3CNT_L: io.apu.SOUND3CNT_L,
        SOUND3CNT_H: io.apu.SOUND3CNT_H,
        SOUND3CNT_X: io.apu.SOUND3CNT_X,
        WAVE_RAM: Array.from(io.apu.WAVE_RAM),
        SOUND4CNT_L: io.apu.SOUND4CNT_L,
        SOUND4CNT_H: io.apu.SOUND4CNT_H,
        SOUNDCNT_L: io.apu.SOUNDCNT_L,
        SOUNDCNT_H: io.apu.SOUNDCNT_H,
        SOUNDCNT_X: io.apu.SOUNDCNT_X,
        SOUNDBIAS: io.apu.SOUNDBIAS,
        FIFO_A: Array.from(io.apu.FIFO_A),
        FIFO_B: Array.from(io.apu.FIFO_B)
      }
    },
    ppu: {
      DISPCNT: io.ppu.DISPCNT,
      DISPSTAT: io.ppu.DISPSTAT,
      VCOUNT: io.ppu.VCOUNT,
      BG0CNT: io.ppu.BG0CNT, BG1CNT: io.ppu.BG1CNT,
      BG2CNT: io.ppu.BG2CNT, BG3CNT: io.ppu.BG3CNT,
      BG0HOFS: io.ppu.BG0HOFS, BG0VOFS: io.ppu.BG0VOFS,
      BG1HOFS: io.ppu.BG1HOFS, BG1VOFS: io.ppu.BG1VOFS,
      BG2HOFS: io.ppu.BG2HOFS, BG2VOFS: io.ppu.BG2VOFS,
      BG3HOFS: io.ppu.BG3HOFS, BG3VOFS: io.ppu.BG3VOFS,
      WIN0H: io.ppu.WIN0H, WIN1H: io.ppu.WIN1H,
      WIN0V: io.ppu.WIN0V, WIN1V: io.ppu.WIN1V,
      WININ: io.ppu.WININ, WINOUT: io.ppu.WINOUT,
      MOSAIC: io.ppu.MOSAIC,
      BLDCNT: io.ppu.BLDCNT,
      BLDALPHA: io.ppu.BLDALPHA,
      BLDY: io.ppu.BLDY
    },
    raster: { line: raster.line }
  };

  const json = JSON.stringify(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'omega-state.json'; a.click();
  URL.revokeObjectURL(url);
}

export function loadState(mods, json) {
  const state = JSON.parse(json);
  const {
    cpu, memory, io, ppu, dma, timers, input, apu, raster
  } = mods;

  // CPU
  cpu.regs.set(state.cpu.regs);
  cpu.cpsr = state.cpu.cpsr;
  cpu.ime  = state.cpu.ime;

  // Memory
  memory.bios.set(state.memory.bios);
  memory.eram.set(state.memory.eram);
  memory.iram.set(state.memory.iram);
  memory.palette.set(state.memory.palette);
  memory.vram.set(state.memory.vram);
  memory.oam.set(state.memory.oam);
  memory.rom = Uint8Array.from(state.memory.rom);
  memory.sram.set(state.memory.sram);
  memory.openBus = state.memory.openBus;

  // IO.PPU
  Object.assign(io.ppu, state.ppu);

  // DMA
  for (let i = 0; i < 4; i++) Object.assign(io.dma.ch[i], state.io.dma[i]);

  // Timers
  for (let i = 0; i < 4; i++) Object.assign(io.timers.ch[i], state.io.timers.ch[i]);
  io.timers.irq = state.io.timers.irq;

  // Keypad
  io.keypad.value         = state.io.keypad.value;
  io.keypad.irqEnableMask = state.io.keypad.irqEnableMask;

  // APU regs
  Object.assign(io.apu, state.io.apu);
  apu.reset(); // re-initialize audio engine with new regs

  // PPU registers
  Object.assign(io.ppu, state.ppu);

  // Raster
  raster.line = state.raster.line;
}
