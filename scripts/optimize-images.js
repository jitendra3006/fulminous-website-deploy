/* Re-encode the page's oversized rasters to WebP at roughly twice the size
   they are actually drawn at, and repoint every reference.
   ------------------------------------------------------------------
   Two things were wrong with the originals, and they are separate problems:

   1. Dimensions. The navbar logo ships at 7286x1800 and is drawn at 223x44;
      the showcase slides ship at 1760x1760 and are drawn at 440. Nothing on
      this page needs more than 2x its CSS box, even on a 2x display.
   2. Format. Photographs stored as PNG cannot be compressed lossily, which is
      why four portraits alone come to 13 MB. WebP keeps the alpha channel
      those rounded-corner cut-outs rely on, so it is a drop-in for both the
      photos and the flat art.

   Caps are per family rather than global, because "2x its box" is a different
   number for a 150px badge and a 440px slide. Anything not listed falls back
   to 1200px on the long side, which is 2x the widest box on the page.

   Originals are moved to .image-originals/ at the repo root — out of public/,
   so they stop being deployed, but still on disk to re-run this from. */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const sharp = require("sharp");
const ASSETS = path.join(ROOT, "public/assets");
const KEEP = path.join(ROOT, ".image-originals");

const CAPS = [
  [/^Fulminous-Logo\.png$/i, 600],
  [/(manifest|certified|badge|PF\.png|TOP-FIRM|Top-DevOps|TechReviewer|RankWatch|GoodFirms|AppFirms|BestWeb|SelectedFirms|BusinessFirms|TopSoftware)/i, 400],
  [/-IMG\.png$/i, 880],
  [/^(Brett|Carla|Heung|Kwame)/i, 760],
  [/^Blog-/i, 900],
  [/Office\.png$/i, 520],
  [/^(HotelOps|Trailmates|Bingo|Game-Development|Software-Development-Banner|Tech-Powered|twilight)/i, 1000],
];

const capFor = (name) => {
  for (const [re, cap] of CAPS) if (re.test(name)) return cap;
  return 1200;
};

/* Reference scan. Quoted strings only, so filenames containing spaces —
   "Carla Vernón.png", "IND Office.png" — are captured whole. */
const CODE = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      walk(p);
    } else if (/\.(tsx|ts|css|mjs)$/.test(e.name)) CODE.push(p);
  }
};
walk(ROOT);

const referenced = new Map();
for (const file of CODE) {
  const s = fs.readFileSync(file, "utf8");
  for (const m of s.matchAll(/\/assets\/([^"'`)]+?\.(?:png|jpe?g))/gi)) {
    const name = decodeURIComponent(m[1]);
    if (!referenced.has(name)) referenced.set(name, []);
    referenced.get(name).push(file);
  }
}

(async () => {
  fs.mkdirSync(KEEP, { recursive: true });
  const renames = new Map();
  let before = 0;
  let after = 0;
  const rows = [];

  for (const [name] of referenced) {
    const src = path.join(ASSETS, name);
    if (!fs.existsSync(src)) continue;
    const size = fs.statSync(src).size;
    if (size < 30 * 1024) continue;

    const meta = await sharp(src).metadata();
    const cap = capFor(name);
    const long = Math.max(meta.width || 0, meta.height || 0);
    const resize = long > cap ? { width: meta.width >= meta.height ? cap : null, height: meta.height > meta.width ? cap : null } : null;

    let pipe = sharp(src);
    if (resize) pipe = pipe.resize({ ...resize, fit: "inside", withoutEnlargement: true });

    const outName = name.replace(/\.(png|jpe?g)$/i, ".webp");
    const outPath = path.join(ASSETS, outName);
    const buf = await pipe.webp({ quality: 82, effort: 6, alphaQuality: 90 }).toBuffer();
    fs.writeFileSync(outPath, buf);

    fs.renameSync(src, path.join(KEEP, name));

    before += size;
    after += buf.length;
    renames.set(name, outName);
    const outMeta = await sharp(buf).metadata();
    rows.push(
      `${String(Math.round(size / 1024)).padStart(6)}KB -> ${String(Math.round(buf.length / 1024)).padStart(5)}KB  ` +
        `${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}  ${name}`
    );
  }

  // Repoint every reference, URI-encoded or not.
  let edits = 0;
  for (const file of CODE) {
    let s = fs.readFileSync(file, "utf8");
    const original = s;
    for (const [from, to] of renames) {
      for (const variant of [from, encodeURIComponent(from).replace(/%2F/g, "/"), from.replace(/ /g, "%20")]) {
        if (s.includes(variant)) {
          s = s.split(variant).join(variant === from ? to : to.replace(/ /g, "%20"));
        }
      }
    }
    if (s !== original) {
      fs.writeFileSync(file, s);
      edits++;
    }
  }

  console.log(rows.sort().join("\n"));
  console.log(
    `\n${renames.size} files: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB ` +
      `(${Math.round((1 - after / before) * 100)}% smaller), ${edits} source files repointed`
  );
})();
