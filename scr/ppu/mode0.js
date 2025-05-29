// src/ppu/mode0.js
export function renderMode0(mem, io, imageData) {
  const data = imageData.data;
  const bg0cnt = io.ppu.readBG0CNT();
  const baseTile = (bg0cnt & 0x3FF) * 0x800; // tile data base
  const mapBase  = ((bg0cnt>>>8)&0x1F) * 0x800;
  const palBase  = 0x05000000;
  for (let y = 0; y < 160; y++) {
    const mapRow = ((y + ((bg0cnt>>>8)&0xFF)) >>> 3) & 31;
    for (let x = 0; x < 240; x++) {
      const mapCol = ((x + ((bg0cnt>>>8)&0xFF)) >>> 3) & 31;
      const mapAddr = 0x06000000 + mapBase + 2*(32*mapRow + mapCol);
      const tileInfo = mem.read16(mapAddr);
      const tile    = tileInfo & 0x3FF;
      const palette = (tileInfo>>>12)&0xF;
      const px      = ((y%8)*8 + (x%8));
      const tilePixel = mem.read16(0x06000000 + baseTile + tile*32 + px*2) & 0xF;
      const col16  = mem.read16(palBase + palette*32 + tilePixel*2);
      // expand 5-bit to 8-bit
      const r = ((col16&0x1F)<<3)|(col16&0x1F>>>2);
      const g = (((col16>>>5)&0x1F)<<3)|(((col16>>>5)&0x1F)>>>2);
      const b = (((col16>>>10)&0x1F)<<3)|(((col16>>>10)&0x1F)>>>2);
      const i = (y*240 + x)*4;
      data[i] = r; data[i+1]=g; data[i+2]=b; data[i+3]=255;
    }
  }
}
