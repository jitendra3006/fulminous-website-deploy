/* Count the accent-coloured runs along a scanline. */
const sharp = require('sharp');
(async () => {
  const file = process.argv[2];
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i+1], data[i+2]]; };
  const isAccent = (p) => p[0] > 190 && p[1] > 95 && p[1] < 215 && p[0] - p[2] > 40;
  /* every scanline, tally the runs; report the widths seen per run position */
  const byX = new Map();
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      if (!isAccent(at(x, y))) { x++; continue; }
      let e = x; while (e + 1 < w && isAccent(at(e + 1, y))) e++;
      const n = e - x + 1;
      if (n <= 8) {
        const key = Math.round((x + e) / 2 / 4) * 4;   // bucket by position
        if (!byX.has(key)) byX.set(key, new Map());
        const t = byX.get(key); t.set(n, (t.get(n) || 0) + 1);
      }
      x = e + 1;
    }
  }
  const rows = [...byX.entries()].filter(([, t]) => [...t.values()].reduce((a, b) => a + b, 0) > 40).sort((a, b) => a[0] - b[0]);
  console.log('  ' + file.split(/[\/]/).pop());
  for (const [x, t] of rows) {
    const parts = [...t.entries()].sort((a, b) => b[1] - a[1]).map(([n, k]) => n + 'px x' + k);
    console.log('    x~' + String(x).padStart(4) + '   ' + parts.join(', '));
  }
})();
