/* A deliberately small CSS splitter for one job: take the single stylesheet
   `next build` emits and cut it in two — the rules the first viewport needs,
   and everything else — without re-serialising anything.

   It is a *text* splitter, not a CSS parser. Every rule it emits is a byte-for-
   byte slice of the input, so whatever the build's own postcss/cssnano pass
   produced — vendor prefixes, value rounding, colour notation — survives the
   split unchanged. That is the whole reason the split happens after the build
   rather than on styles/globals.css: a second minifier in the pipeline is a
   second chance to render something differently in one engine, and this file
   is not allowed to introduce that.

   The scanner only needs to find block boundaries, so it tracks the three
   places a brace can appear without opening a block — strings, url() tokens
   and comments — and counts depth everywhere else.
   ------------------------------------------------------------------ */

/** Rules that hold declarations rather than nested rules. Their bodies are
    taken whole and never walked into. `@keyframes` matters here: its inner
    `0%{}`/`to{}` blocks look exactly like style rules to a brace counter. */
const LEAF_AT_RULES = new Set([
  "font-face",
  "keyframes",
  "-webkit-keyframes",
  "page",
  "counter-style",
  "font-feature-values",
  "property",
  "viewport",
]);

/**
 * Splits a stylesheet into its top-level nodes.
 *
 * Each node is `{ type, prelude, body, start, end, text }` where `text` is the
 * exact input slice, so `nodes.map(n => n.text).join("")` reconstructs the
 * input byte for byte.
 *
 * @param {string} css
 * @param {number} [from]
 * @param {number} [to]
 */
function parseNodes(css, from = 0, to = css.length) {
  const nodes = [];
  let i = from;
  let start = from;
  let depth = 0;
  let preludeEnd = -1;

  while (i < to) {
    const c = css[i];

    // Comments. cssnano strips them, but a licence banner (/*! … */) survives,
    // and one containing a brace would otherwise desynchronise the depth count.
    if (c === "/" && css[i + 1] === "*") {
      const close = css.indexOf("*/", i + 2);
      i = close === -1 ? to : close + 2;
      continue;
    }

    // Strings. `content: "}"` is legal and appears in icon fonts.
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < to) {
        if (css[i] === "\\") i += 2;
        else if (css[i] === quote) { i++; break; }
        else i++;
      }
      continue;
    }

    // Unquoted url(...) — may contain braces and quotes of its own.
    if ((c === "u" || c === "U") && /^url\(/i.test(css.slice(i, i + 4))) {
      const close = css.indexOf(")", i);
      i = close === -1 ? to : close + 1;
      continue;
    }

    if (c === "{") {
      if (depth === 0) preludeEnd = i;
      depth++;
      i++;
      continue;
    }

    if (c === "}") {
      depth--;
      i++;
      if (depth === 0) {
        nodes.push(makeNode(css, start, i, preludeEnd));
        start = i;
        preludeEnd = -1;
      }
      continue;
    }

    // A statement at-rule — `@import url(…);`, `@charset "utf-8";` — ends at
    // its semicolon and never opens a block.
    if (c === ";" && depth === 0) {
      i++;
      nodes.push(makeNode(css, start, i, -1));
      start = i;
      continue;
    }

    i++;
  }

  // Trailing whitespace or a truncated final rule. Kept so the join is lossless.
  if (start < to) nodes.push(makeNode(css, start, to, preludeEnd));

  return nodes;
}

function makeNode(css, start, end, preludeEnd) {
  const text = css.slice(start, end);
  const prelude = (preludeEnd === -1 ? text : css.slice(start, preludeEnd)).trim();

  if (!prelude.startsWith("@")) {
    return { type: "rule", prelude, text, start, end, bodyStart: preludeEnd + 1, bodyEnd: end - 1 };
  }

  const name = (prelude.match(/^@([\w-]+)/) || [, ""])[1].toLowerCase();
  const type = preludeEnd === -1
    ? "at-statement"
    : LEAF_AT_RULES.has(name)
      ? "at-leaf"
      : "at-block";

  return { type, name, prelude, text, start, end, bodyStart: preludeEnd + 1, bodyEnd: end - 1 };
}

/**
 * Walks the tree and hands every *leaf* (a style rule, or an at-rule that holds
 * declarations) to `visit`, in the same depth-first order the CSSOM exposes
 * `cssRules` in. The analyser in the browser walks the CSSOM with the identical
 * order and the two indices are asserted to line up, which is what lets a
 * decision made against the live DOM be applied to a byte offset in the file.
 *
 * @param {string} css
 * @param {(leaf: object, index: number, ancestors: object[]) => void} visit
 */
function walkLeaves(css, visit) {
  let index = 0;
  const recurse = (from, to, ancestors) => {
    for (const node of parseNodes(css, from, to)) {
      // Whitespace between rules is its own node so the join stays lossless,
      // but it is not a rule and the CSSOM does not count it.
      if (!node.prelude) continue;

      if (node.type === "at-block") {
        // A conditional group — @media, @supports, @container, @layer. The
        // CSSOM counts the group itself as one rule before its children.
        visit(node, index++, ancestors);
        recurse(node.bodyStart, node.bodyEnd, ancestors.concat(node));
      } else if (node.type === "rule" || node.type === "at-leaf" || node.type === "at-statement") {
        visit(node, index++, ancestors);
      }
      // Whitespace-only trailing nodes have an empty prelude and no body; they
      // carry no rule and are not counted, matching the CSSOM.
    }
  };
  recurse(0, css.length, []);
  return index;
}

/**
 * A stable name for one rule, used as the key in the committed critical
 * manifest.
 *
 * Rule *indices* would have been smaller, but they shift the moment anyone adds
 * a rule to globals.css, and a shifted index silently defers something the
 * first viewport needs. The prelude chain moves only when the rule itself is
 * edited, and an edited rule falls back to critical (see split-css.js), so the
 * failure mode is a slightly larger critical sheet rather than a flash.
 *
 * `seen` disambiguates the handful of genuinely identical (context, selector)
 * pairs the sheet contains.
 */
function leafKey(node, ancestors, seen) {
  const base = ancestors.map((a) => a.prelude).concat(node.prelude).join(" » ");
  const n = (seen.get(base) || 0) + 1;
  seen.set(base, n);
  return n === 1 ? base : `${base} #${n}`;
}

module.exports = { parseNodes, walkLeaves, leafKey, LEAF_AT_RULES };
