#!/usr/bin/env node
/* Regenerates scripts/critical-manifest.json — the list of stylesheet rules the
   first viewport needs, which scripts/split-css.js then applies at build time.

   Usage:
     npm i -D puppeteer-core          # not a declared dependency, see below
     NEXT_DIST_DIR=.next-build npx next build
     NEXT_DIST_DIR=.next-build npx next start -p 4311
     NEXT_DIST_DIR=.next-build npm run css:manifest -- http://localhost:4311/

   Run it after any change to styles/globals.css. Skipping it is not dangerous —
   split-css.js keeps rules it does not recognise in the blocking sheet and says
   so — it just gives back some of the win.

   It must run against a *served build*, not the dev server, because the whole
   point is to classify the rules in the sheet the build actually emits.

   puppeteer-core is deliberately not in devDependencies. Vercel installs dev
   dependencies on every deploy, and this is a tool a human runs by hand a few
   times a year on a machine that already has Chrome; making every build pay for
   it would cost more than it saves. Install it when you need it.
   ------------------------------------------------------------------
   The decision is made in a real browser rather than from a hand-kept list of
   selector prefixes. A prefix list has to be right about every one of 1873
   rules and is wrong the moment someone adds a section; asking the DOM which
   rules touch the first viewport is right by construction, and it caught things
   a prefix list would not have — the mega-dropdown and the mobile drawer have
   no box at all until they open, so "is it in the viewport" says no while
   "does a rule hide it" says it has to be in the blocking sheet.

   Two populations of element keep a rule critical:

     - anything whose box intersects the first viewport, because it is painted
       before the second sheet can possibly arrive;
     - anything currently hidden, because the rule doing the hiding has to
       arrive with the first paint or the element flashes into view and then
       disappears.

   Both are collected at nineteen viewports — every breakpoint in the sheet,
   the widths between them, and two heights at the narrow end where the hero's
   fit pass changes what fits — and the manifest is their union.
   ------------------------------------------------------------------ */
const fs = require("fs");
const path = require("path");
const { walkLeaves, leafKey } = require("./css-tree.js");

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch (e) {
  console.error("\n  critical-manifest: needs puppeteer-core — run `npm i -D puppeteer-core`\n");
  process.exit(1);
}

const URL = process.argv[2] || "http://localhost:4311/";
const DIST = process.env.NEXT_DIST_DIR || ".next";
const OUT = path.join(__dirname, "critical-manifest.json");

/* Chrome is looked up rather than downloaded: puppeteer-core ships no browser,
   and the machine that regenerates this already has one. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const VIEWPORTS = [
  [320, 568], [320, 800],
  [360, 640], [360, 800],
  [390, 844],
  [412, 823],
  [480, 800],
  [520, 800],
  [576, 800],
  [640, 800],
  [641, 900],
  [768, 1024],
  [820, 1180],
  [1024, 768], [1024, 1366],
  [1280, 800],
  [1440, 900],
  [1537, 900],
  [1920, 1080],
];

/* Runs inside the page. Returns the indices, in CSSOM order, of every rule the
   viewport it is called at needs. */
const collect = function () {
  const sheet = Array.from(document.styleSheets).find(
    (s) => s.href && s.href.indexOf("/static/css/") !== -1
  );
  if (!sheet) return { error: "stylesheet not found" };

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const candidates = [];
  const all = document.querySelectorAll("*");
  for (let i = 0; i < all.length; i++) {
    const el = all[i];
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
      candidates.push(el);
      continue;
    }
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw) candidates.push(el);
  }

  /* el.matches() only understands the part of a selector that describes an
     element in the tree, so the parts describing a generated box or a user
     action come off first. Stripping widens the match — `.btn:hover` is tested
     as `.btn` — which errs towards keeping a rule. That is the safe direction:
     an over-large blocking sheet costs bytes, an under-large one costs a flash. */
  const PSEUDO_ELEMENT = /::(?:before|after|first-line|first-letter|placeholder|selection|marker|backdrop|file-selector-button|-webkit-[\w-]+|-moz-[\w-]+)/g;
  const LEGACY_PSEUDO_ELEMENT = /(^|[^:]):(before|after|first-line|first-letter)\b/g;
  const USER_ACTION = /:(?:hover|focus-visible|focus-within|focus|active|visited|target|checked|disabled|enabled|indeterminate|placeholder-shown|autofill|user-invalid|invalid|valid|required|optional|default|read-only|read-write|-webkit-[\w-]+|-moz-[\w-]+)/g;

  const cleanCache = new Map();
  const matchCache = new Map();

  function clean(sel) {
    if (cleanCache.has(sel)) return cleanCache.get(sel);
    let out = sel
      .replace(PSEUDO_ELEMENT, "")
      .replace(LEGACY_PSEUDO_ELEMENT, "$1")
      .replace(USER_ACTION, "")
      .trim();
    if (!out || /[>+~]\s*$/.test(out)) out = "*";
    cleanCache.set(sel, out);
    return out;
  }

  /* Every element gets an index so a rule's match set can be held as a plain
     array of numbers — the ordering pass below intersects those sets a lot. */
  const elementIndex = new Map();
  for (let i = 0; i < all.length; i++) elementIndex.set(all[i], i);
  const isCandidate = new Uint8Array(all.length);
  for (let i = 0; i < candidates.length; i++) isCandidate[elementIndex.get(candidates[i])] = 1;

  const queryCache = new Map();
  function elementsFor(selectorText) {
    let hit = queryCache.get(selectorText);
    if (hit) return hit;
    const out = [];
    const seenEl = new Set();
    const parts = selectorText.split(",");
    for (let p = 0; p < parts.length; p++) {
      const sel = clean(parts[p]);
      let found;
      try {
        found = document.querySelectorAll(sel);
      } catch (e) {
        // A selector this engine cannot parse is treated as matching
        // everything, so it is kept rather than dropped.
        found = all;
      }
      for (let i = 0; i < found.length; i++) {
        const idx = elementIndex.get(found[i]);
        if (idx !== undefined && !seenEl.has(idx)) { seenEl.add(idx); out.push(idx); }
      }
    }
    queryCache.set(selectorText, out);
    return out;
  }

  /* Conditions kept whatever the emulated viewport reports.
     prefers-reduced-motion is an accessibility guarantee: deferring it hands a
     reader who asked for stillness the entrance animations anyway, for the
     length of one round trip. `print` is the opposite — nothing prints during a
     page load — so it is absent here and falls through to the deferred sheet. */
  const ALWAYS = /prefers-reduced-motion|forced-colors|prefers-contrast/i;

  const critical = [];
  const keyframes = [];
  const criticalText = [];
  /* Style rules that apply at this viewport, in sheet order, with the elements
     each one reaches. The ordering pass after the walk needs both. */
  const styleRules = [];
  let index = 0;

  function walk(rules, applies) {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const idx = index++;
      const kind = rule.constructor.name;

      /* Branch on the rule class, not on the presence of `cssRules`. Chrome
         ships CSS nesting, so every CSSStyleRule carries an empty cssRules list
         and a `rule.cssRules && …` test silently treats all 897 style rules as
         empty groups. The text splitter does not descend into style rules
         either, so the two walks stay in step. */
      if (kind === "CSSStyleRule") {
        if (applies) {
          const els = elementsFor(rule.selectorText);
          let hitsCandidate = false;
          for (let k = 0; k < els.length; k++) {
            if (isCandidate[els[k]]) { hitsCandidate = true; break; }
          }
          styleRules.push({ idx, els, critical: hitsCandidate, text: rule.cssText });
        }
        continue;
      }
      if (kind === "CSSFontFaceRule") { critical.push(idx); continue; }
      if (kind === "CSSKeyframesRule") { keyframes.push([idx, rule.name]); continue; }

      if (rule.cssRules) {
        let childApplies = applies;
        if (rule.media && rule.conditionText !== undefined) {
          if (!ALWAYS.test(rule.conditionText)) {
            try { childApplies = applies && window.matchMedia(rule.conditionText).matches; }
            catch (e) { childApplies = applies; }
          }
        } else if (rule.conditionText !== undefined && typeof CSS !== "undefined" && CSS.supports) {
          try { childApplies = applies && CSS.supports(rule.conditionText); }
          catch (e) { childApplies = applies; }
        }
        /* The group itself is never recorded: split-css.js rebuilds a wrapper
           on whichever side its children landed, so its index carries no
           decision — it only has to be consumed to keep the two walks aligned. */
        walk(rule.cssRules, childApplies);
        continue;
      }

      critical.push(idx); // @page, @property and friends are cheap; keep them
    }
  }

  walk(sheet.cssRules, true);

  /* No cascade-order repair is needed here, and that is a property of the
     strategy split-css.js uses rather than luck.

     Carving the sheet into two disjoint halves does break the cascade: within
     each half the original order survives, but across them it does not, so a
     critical rule that used to sit *after* a deferred rule of equal specificity
     now sits before it and loses a tie it used to win. Grouped selectors
     trigger it constantly — `.testimonial__title, .hero__eyebrow { color: … }`
     is critical because of its hero half, and once promoted it jumps ahead of
     an earlier rule colouring `.testimonial__title`. Measured against the
     unsplit build, the disjoint split moved 3531 computed declarations across
     16 viewports.

     An ordering pass does fix it — promote, for every element, every rule
     preceding its last critical one — and it worked, at the cost of growing the
     blocking sheet from 500 rules to 1235 (12.1 kB -> 23.4 kB gzipped). But
     that build measured *worse*: over eight interleaved pairs its LCP rose 86 ms
     and its Speed Index rose 1346 ms against the unsplit build, because the
     small remainder sheet lands inside the window that decides both and
     repaints. The version shipped instead defers the sheet *whole*, so the
     second file restores the original cascade byte for byte and the only thing
     this manifest has to get right is which rules the first paint needs. */
  for (let i = 0; i < styleRules.length; i++) {
    if (styleRules[i].critical) {
      critical.push(styleRules[i].idx);
      criticalText.push(styleRules[i].text);
    }
  }

  /* A @keyframes block is dead weight unless something in the blocking sheet
     names it — most of the sheet's 67 belong to sections far below the fold. */
  const blob = criticalText.join("\n");
  for (let i = 0; i < keyframes.length; i++) {
    const [idx, name] = keyframes[i];
    if (new RegExp("\\b" + name.replace(/[^\w-]/g, "") + "\\b").test(blob)) critical.push(idx);
  }

  return { total: index, critical };
};

(async () => {
  const executablePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!executablePath) {
    console.error("\n  critical-manifest: no Chrome found — set CHROME_PATH\n");
    process.exit(1);
  }

  const cssDir = path.join(DIST, "static", "css");
  const sheets = fs.readdirSync(cssDir).filter((f) => f.endsWith(".css") && !f.endsWith(".deferred.css"));
  if (sheets.length !== 1) {
    console.error(`\n  critical-manifest: expected one stylesheet in ${cssDir}, found ${sheets.length}\n`);
    process.exit(1);
  }
  const css = fs.readFileSync(path.join(cssDir, sheets[0]), "utf8");

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });

  const union = new Set();
  let total = null;

  for (const [w, h] of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
    // Let the hero's fit pass and the entrance animations settle, so no box is
    // read mid-transition.
    await new Promise((r) => setTimeout(r, 1200));
    const res = await page.evaluate(collect);
    if (res.error) throw new Error(res.error);
    if (total === null) total = res.total;
    if (total !== res.total) throw new Error("rule count changed between viewports");
    res.critical.forEach((i) => union.add(i));
    console.log(`  ${`${w}x${h}`.padEnd(10)} critical ${String(res.critical.length).padStart(5)}   union ${union.size}`);
    await page.close();
  }
  await browser.close();

  /* Turn CSSOM indices into the stable prelude-chain keys the build applies.
     The two walks are asserted to see the same number of rules — if they ever
     diverge the mapping is meaningless and it is better to stop than to ship a
     manifest that defers the wrong half. */
  /* Only the deferred half is written out. The build treats every rule it does
     not find in that list as critical, so the list is both the smaller one to
     store (1270 keys against 2270 for critical-plus-known) and the one whose
     absence fails safe: a rule added to globals.css after this ran is unknown,
     lands in the blocking sheet, and costs a few bytes instead of a flash. */
  const deferred = [];
  let criticalCount = 0;
  const seen = new Map();
  const seenTotal = walkLeaves(css, (node, index, ancestors) => {
    if (node.type === "at-block") return; // wrappers are derived, not classified
    const key = leafKey(node, ancestors, seen);
    if (union.has(index)) criticalCount++;
    else deferred.push(key);
  });

  if (seenTotal !== total) {
    console.error(`\n  critical-manifest: text walk saw ${seenTotal} rules, CSSOM saw ${total} — aborting\n`);
    process.exit(1);
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        generated: new Date().toISOString().slice(0, 10),
        // Leaf count of the sheet this was generated against. split-css.js
        // compares it and warns when the stylesheet has moved on.
        rules: criticalCount + deferred.length,
        criticalCount,
        deferred,
      },
      null,
      1
    )
  );
  console.log(
    `\n  critical-manifest: ${criticalCount} of ${criticalCount + deferred.length} rules critical` +
    ` -> ${path.relative(process.cwd(), OUT)}`
  );
})();
