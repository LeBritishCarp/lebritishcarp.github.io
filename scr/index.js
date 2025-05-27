// src/index.js
console.log('GBA emulator starting…');

// Grab our canvas
const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');

// Main loop stub
function frame() {
  // TODO: step CPU, render to ctx, handle input…
  requestAnimationFrame(frame);
}

// Kick off the loop
requestAnimationFrame(frame);
