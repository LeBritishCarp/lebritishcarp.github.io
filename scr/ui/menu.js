// src/ui/menu.js
export function setupMenu(onSelect) {
  const menu = document.getElementById('menu');
  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const emu = btn.dataset.emu;
      menu.style.display = 'none';
      onSelect(emu);
    });
  });
}
