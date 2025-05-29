// src/index.js
import { setupMenu } from './ui/menu.js';
import { startGBA }  from './main-gba.js';

setupMenu(selected => {
  if (selected === 'gba') {
    startGBA();
  }
  // else if (selected === 'gb') { /* future GB init */ }
});
