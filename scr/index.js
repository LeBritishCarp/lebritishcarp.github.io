// src/index.js
import { log }        from './util/log.js';
import { setupMenu }  from './ui/menu.js';
import { startGBA }   from './main-gba.js';

log('index.js loaded, setting up menu…');

setupMenu(selected => {
  log('Menu button clicked, selected:', selected);
  if (selected === 'gba') {
    startGBA();
  }
});
