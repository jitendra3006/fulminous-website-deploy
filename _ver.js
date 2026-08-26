const puppeteer = require('C:/Users/hp/AppData/Local/Temp/claude/D--all-projects-claude-wala-fulminous-home-1/cb309789-0233-4556-91d0-c8af4d79167e/scratchpad/node_modules/puppeteer-core');
const sharp = require('sharp');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const S = 'C:/Users/hp/AppData/Local/Temp/claude/D--all-projects-claude-wala-fulminous-home-1/cb309789-0233-4556-91d0-c8af4d79167e/scratchpad/';
const CONFIGS = [[1536,1.25],[1920,1.25],[1600,1.25],[1440,1.25],[1440,1],[1366,1.25],[1280,1.25],[1024,1.25],[1536,1],[1536,2],[900,1],[430,2]];

async function centre(p, sel) {
  for (let i = 0; i < 10; i++) {
    const d = await p.evaluate((s) => {
      const e = document.querySelector(s); if (!e) return 0;
      const r = e.getBoundingClientRect();
      return (r.top + r.height / 2) - window.innerHeight / 2;
    }, sel);
    if (Math.abs(d) < 4) return true;
    await p.evaluate((dy) => window.scrollBy(0, dy), d);
    await new Promise(r => setTimeout(r, 320));
  }
  return false;
}
async function measure(file, xs) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i+1], data[i+2]]; };
  const acc = (p) => p[0] > 185 && p[1] > 90 && p[1] < 220 && p[0] - p[2] > 35;
  return xs.map((cx) => {
    const t = new Map();
    for (let y = 0; y < h; y++) {
      let hit = -1;
      for (let o = -6; o <= 6; o++) { const x = Math.round(cx) + o; if (x > 0 && x < w && acc(at(x, y))) { hit = x; break; } }
      if (hit < 0) continue;
      let l = hit, r = hit;
      while (l > 0 && acc(at(l - 1, y))) l--;
      while (r < w - 1 && acc(at(r + 1, y))) r++;
      const n = r - l + 1; if (n <= 10) t.set(n, (t.get(n) || 0) + 1);
    }
    const top = [...t.entries()].sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : 0;
  });
}
(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  for (const [sel, rule, label] of [
    ['.reviews-bar__card', '.reviews-bar__divider', 'ratings row'],
    ['.footer__offices', '.office-divider', 'offices panel'],
  ]) {
    console.log('== ' + label + ' ==');
    for (const [vw, dsf] of CONFIGS) {
      const p = await b.newPage();
      await p.setViewport({ width: vw, height: 900, deviceScaleFactor: dsf });
      await p.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
      await centre(p, sel);
      await new Promise(r => setTimeout(r, 700));
      const xs = await p.evaluate((r) => [...document.querySelectorAll(r)]
        .filter(e => getComputedStyle(e).display !== 'none')
        .map(e => { const b = e.getBoundingClientRect(); return (b.x + b.width / 2) * window.devicePixelRatio; }), rule);
      if (!xs.length) { console.log('  ' + String(vw).padStart(4) + '@' + dsf + '   hidden'); await p.close(); continue; }
      const f = S + 'v.png';
      await p.screenshot({ path: f });
      const r = await measure(f, xs);
      const same = new Set(r).size === 1 && r[0] > 0;
      console.log('  ' + String(vw).padStart(4) + '@' + dsf + '   ' + (same ? 'SAME  ' : 'DIFFER') + '  ' + r.map(n => n + 'px').join(' / '));
      await p.close();
    }
  }
  await b.close();
})();
