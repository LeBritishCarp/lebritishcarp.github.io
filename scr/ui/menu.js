// src/ui/menu.js
export function setupMenu(onSelect) {
  const menu = document.getElementById('menu');
  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      onSelect(btn.dataset.emu);
    });
  });
}
