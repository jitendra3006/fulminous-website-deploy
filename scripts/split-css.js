#!/usr/bin/env node
/* Cuts a small first-paint stylesheet out of the one `next build` emits, and
   rewrites the prerendered HTML so that is the only sheet blocking the render.
   The full sheet still loads, immediately and in parallel, but asynchronously.
   ------------------------------------------------------------------
   Why bother: the sheet is the page's only render-blocking resource and it is
   34 kB over the wire. Blocking it outright in a Lighthouse run moved FCP
   1662 -> 1091 ms and LCP 2964 -> 2384 ms, more LCP than removing every byte of
   JavaScript on the page. Nothing else measured above noise — the fonts, the
   hero's full-viewport background animation, the below-fold artwork and the
   whole client bundle were each tested and each came back at or near zero.

   Why an overlay rather than two disjoint halves:

   Carving the sheet in two breaks the cascade. Order survives inside each half
   but not across them, so a critical rule that used to sit after a deferred
   rule of equal specificity now sits before it and loses a tie it used to win —
   3531 differing computed declarations across 16 viewports, measured. An
   ordering pass repairs that, and its build was still worse: LCP +86 ms and
   Speed Index +1346 ms over eight interleaved pairs, because the small
   remainder sheet lands inside the window that decides both and repaints.

   So the second file is the *whole* original sheet. It restores the original
   cascade byte for byte — there is no ordering question left to get wrong — and
   the only thing the manifest has to be right about is which rules the first
   paint needs. Over eight interleaved pairs that measured FCP 1659 -> 1513 ms
   with LCP, SI, TBT and CLS unmoved.

   The cost is honest and worth stating: a first-time visitor downloads the
   critical rules twice, 12 kB gzipped on top of the 34 kB sheet, on a request
   that blocks nothing. Inlining the critical rules into the HTML instead was
   tried and is much worse — FCP 1960 ms, LCP ~3300 — because the document has
   to finish streaming before anything paints, where a linked sheet downloads
   alongside the rest of the HTML.

   Why it runs after the build rather than on styles/globals.css: every rule
   written out here is a byte-for-byte slice of the build's own output, so no
   vendor prefix, rounded value or colour notation can come out different in one
   engine and not another. Splitting the source would have put a second
   minifier in the pipeline, which is a second chance at exactly that.

   Which rules are critical is decided by scripts/critical-manifest.js against a
   real browser at nineteen viewports — see that file. The result is committed
   as critical-manifest.json so a deploy never needs Chrome, and a rule the
   manifest does not know about is treated as critical, so editing globals.css
   without regenerating costs a few bytes rather than correctness.
   ------------------------------------------------------------------ */
const fs = require("fs");
const path = require("path");
const { parseNodes, walkLeaves, leafKey } = require("./css-tree.js");

const DIST = process.env.NEXT_DIST_DIR || ".next";
const MANIFEST = path.join(__dirname, "critical-manifest.json");

function fail(msg) {
  console.error(`\n  split-css: ${msg}\n`);
  process.exit(1);
}

/* ---------- locate the one stylesheet the build emitted ---------- */
const cssDir = path.join(DIST, "static", "css");
if (!fs.existsSync(cssDir)) fail(`no ${cssDir} — run next build first`);

const sheets = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css") && !f.endsWith(".deferred.css"));
if (sheets.length !== 1) {
  fail(`expected exactly one stylesheet in ${cssDir}, found ${sheets.length}: ${sheets.join(", ")}`);
}
const sheetName = sheets[0];
const sheetPath = path.join(cssDir, sheetName);
const base = sheetName.replace(/\.css$/, "");
const css = fs.readFileSync(sheetPath, "utf8");

/* ---------- partition ---------- */
if (!fs.existsSync(MANIFEST)) fail(`${MANIFEST} missing — run npm run css:manifest`);
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const deferredKeys = new Set(manifest.deferred);

/* First pass: name every leaf, and decide. An unknown key defaults to critical
   — the safe direction, since the cost is a bigger blocking sheet rather than
   an element that paints wrong until the second sheet lands. */
const decision = [];
let leaves = 0;
{
  const seen = new Map();
  walkLeaves(css, (node, index, ancestors) => {
    if (node.type === "at-block") {
      // Group wrappers are emitted from whether their children survived, so
      // they take no decision of their own — but they still consume a slot so
      // the two walks stay aligned.
      decision.push(null);
      return;
    }
    leaves++;
    /* Anything the manifest does not name as deferred goes in the blocking
       sheet, which is the direction that cannot flash: the full sheet loads
       either way, so an over-large first sheet costs bytes while an under-large
       one costs a repaint. */
    decision.push(!deferredKeys.has(leafKey(node, ancestors, seen)));
  });
}

if (manifest.rules !== leaves) {
  console.warn(
    `  split-css: critical-manifest.json was generated against ${manifest.rules} rules but the\n` +
    `  stylesheet now has ${leaves}. Rules it does not recognise stay in the blocking sheet, which\n` +
    `  is safe but larger than it needs to be. Re-run "npm run css:manifest" to reclassify them.`
  );
}

/* Second pass: emit. Every rule is written as its exact input slice; only the
   @media/@supports wrappers are reconstructed, and only around whichever of
   their children landed on this side. */
let cursor = 0;
function emit(from, to, wantCritical) {
  let out = "";
  for (const node of parseNodes(css, from, to)) {
    if (!node.prelude) continue; // whitespace between rules carries nothing
    const index = cursor++;
    if (node.type === "at-block") {
      const inner = emit(node.bodyStart, node.bodyEnd, wantCritical);
      if (inner) out += `${node.prelude}{${inner}}`;
    } else if (decision[index] === wantCritical) {
      out += node.text;
    }
  }
  return out;
}

cursor = 0;
const critical = emit(0, css.length, true);
if (cursor !== decision.length) {
  fail(`walk desynchronised (${cursor} vs ${decision.length})`);
}

/* ---------- write ----------
   The blocking file keeps the name the build gave it, so Next's own <link> and
   the copy of it in the flight payload still point at something real and React
   has nothing to reconcile at hydration. The deferred file is the original
   sheet, unaltered. */
const deferredName = `${base}.deferred.css`;
fs.writeFileSync(path.join(cssDir, deferredName), css);
fs.writeFileSync(sheetPath, critical);

/* ---------- rewrite the prerendered HTML ---------- */
const criticalHref = `/_next/static/css/${sheetName}`;
const deferredHref = `/_next/static/css/${deferredName}`;

/* `media="print"` is what makes the second sheet non-blocking: a stylesheet
   whose media query does not match the current medium is fetched at once but
   never delays the first paint. `onload` hands it back to `all` the moment it
   has arrived, which is long before anyone can scroll.

   It goes immediately after the blocking link, and that position is the whole
   correctness argument: the deferred file is the complete original sheet, so
   once it applies every rule sits in its original order relative to every
   other, and the blocking sheet ahead of it can only ever be overridden by the
   same declarations it already holds.

   The <noscript> copy is not decoration. Without it a reader with JavaScript
   off — and any crawler that does not run it — would get the critical sheet
   alone and see an unstyled page below the hero. */
const linkTag = new RegExp(
  `<link rel="stylesheet" href="${criticalHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*/?>`
);

const htmlFiles = [];
(function collect(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
})(path.join(DIST, "server", "app"));

let patched = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(linkTag);
  if (!match) continue;
  const injected =
    match[0] +
    `<link rel="stylesheet" href="${deferredHref}" media="print" onload="this.media='all';this.onload=null"/>` +
    `<noscript><link rel="stylesheet" href="${deferredHref}"/></noscript>`;
  fs.writeFileSync(file, html.replace(match[0], injected));
  patched++;
}

if (!patched) fail(`no prerendered HTML referenced ${criticalHref}`);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(
  `  split-css: blocking ${kb(critical)} kB of ${kb(css)} kB` +
  ` (${decision.filter(Boolean).length}/${decision.filter((d) => d !== null).length} rules),` +
  ` full sheet deferred  — ${patched} HTML file${patched === 1 ? "" : "s"} patched`
);
