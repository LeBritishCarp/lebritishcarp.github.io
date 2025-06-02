// src/util/log.js
export function log(...args) {
  // 1) Write to actual console
  console.log(...args);

  // 2) Also append to the on‐screen <div id="debug-log">
  const dbg = document.getElementById('debug-log');
  if (!dbg) return;
  const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ');
  dbg.textContent += msg + '\n';
  // keep scroll at bottom
  dbg.scrollTop = dbg.scrollHeight;
}
