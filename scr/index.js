// src/index.js
import { CPU } from './cpu/index.js';
import { MemoryBus } from './memory/index.js';

console.log('GBA emulator starting…');

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

// Instantiate core components
const memory = new MemoryBus();
const cpu = new CPU(memory);

function frame() {
  cpu.step();          // run one instruction
  // TODO: draw to `ctx` here
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
