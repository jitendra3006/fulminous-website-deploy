# Fulminous Software — Homepage

Marketing homepage for Fulminous Software, built with the Next.js App Router. One
route (`/`), server-rendered, with client behaviour added only where a section
genuinely needs it.

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · plain CSS
(`styles/globals.css`) · `sharp` (build-time image tooling only)

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | `next lint` |
| `npm run optimize:images` | Re-encode oversized rasters in `public/next-assets` to WebP and repoint every reference (see [Assets](#assets)) |

**Environment**

- `NEXT_PUBLIC_SITE_URL` — overrides the canonical/sitemap host. Defaults to
  `https://fulminoussoftware.com`. Set it on staging or preview deployments so
  they do not emit canonicals claiming to be production.
- `NEXT_DIST_DIR` — build output directory. `next build` and `next dev` both
  write to `.next`, so running a build while the dev server is up overwrites the
  chunks dev is serving. Use `NEXT_DIST_DIR=.next-build npm run build` to keep
  the two apart.

## Project structure

```
app/          layout.tsx, page.tsx, robots.ts, sitemap.ts,
              icon.svg, apple-icon.png, opengraph-image.png (+ .alt.txt)
components/   One file per homepage section, plus Navbar, docks and StructuredData
hooks/        useHeaderObserver, useAnimationObserver, useMobileMenu
lib/          site-config.ts — single source of truth for the SEO/contact layer
scripts/      optimize-images.js
styles/       globals.css
public/       next-assets/ (images, SVG icons)
```

---

## What changed in this version

The initial commit was a first-pass frontend implementation. This version is a
full pass over UI/UX, content correctness, SEO, performance, assets and the
underlying component architecture.

### UI/UX

- **Navigation rebuilt.** Three desktop mega-dropdowns (Who We Are, Services,
  Technology) laid out on a column grid, opening on hover and on keyboard focus.
  They are keyboard-operable (`aria-expanded` / `aria-controls`, Enter/Space to
  pin open, Escape to close) and their group headings became `<p>` elements labelling
  their own `<ul>` via `aria-labelledby` — as `<h4>`s they were the first headings
  in the document and started the outline at level 4, above the hero's `<h1>`.
- **Phone drawer with drill-down.** Below 768px the same menus become a full-height
  drawer (`role="dialog"`) with a focus trap, Escape-goes-back-a-level, and a
  `body.nav-open` scroll lock.
- **One source of truth for menu data.** The desktop dropdowns and the phone
  drawer used to be two hand-written copies that had already drifted apart. They
  now render from the same `SERVICES_COLUMNS` / `TECHNOLOGY_COLUMNS` tables.
- **Ask-our-AI became an inline panel, not a modal.** The old full-screen
  glassmorphism modal (`AiQueryModal`) was replaced by `AiQueryPanel`, which
  expands in place out of the sticky "Ask anything…" pill — no backdrop, no
  overlay, no body scroll lock, page stays visible and scrollable.
- **Floating contact dock** (`ContactDock`): WhatsApp and click-to-call buttons,
  with numbers read from `lib/site-config` so they cannot drift from the footer.
- **Section order:** Case studies now come before Blogs.
- **Responsive pass.** `styles/globals.css` grew by roughly 6,700 lines, almost
  all of it inside `max-width`/`max-height` bands: phones (≤767.98px), tablets
  (768–1023.98px), small laptops (1024–1199.98px), narrow desktops
  (1024–1439.98px), plus height-keyed bands for 125% / 150% browser zoom — where
  the viewport is ~1229×586 and the mega-dropdowns and hero previously ran off
  the bottom of the screen with no way to scroll them.
- **Hero fit pass.** The hero measures itself after layout settles and hands the
  stylesheet a `--hero-fit` scale factor, so the Clutch / Trustpilot / Google
  rating cards stay on screen together on short viewports. It runs in
  `useLayoutEffect` so nothing paints un-shrunk first.
- Reduced-motion support across the animation layer (`prefers-reduced-motion`).

### Features & content correctness

- **`lib/site-config.ts`** — one module holding the site URL, name, title,
  description, founding year, social profiles, phone numbers, e-mail and the four
  office addresses. Every value is verifiable from the page's own visible content.
- **Dead links removed.** Around sixty service links pointed at `/services/<slug>`
  routes that do not exist in this app (and 404 on the live site too). They now
  resolve through `live()` to pages on the live content site that were checked to
  return HTTP 200. Cross-origin links carry `target="_blank" rel="noopener
  noreferrer"`.
- **`href="#"` placeholders dropped.** The "Read More" affordances on blog cards
  and case rows were links to the top of the current page. They are now `<span>`s
  with the identical class — same rendering, nothing crawlable pointing nowhere.
  Section CTAs, which do have real destinations, kept their links.

### SEO

- **Metadata** (`app/layout.tsx`): `metadataBase`, a title `default` +
  `template`, a self-referencing canonical, Open Graph and Twitter
  `summary_large_image` cards, and explicit `robots` directives including
  `max-image-preview: large`.
- **File-convention assets:** `app/opengraph-image.png` (+ `opengraph-image.alt.txt`),
  `app/icon.svg`, `app/apple-icon.png`. Next hashes these and emits the tags
  itself, so no hard-coded icon or OG paths.
- **`app/robots.ts`** — permissive by design; `/_next` is explicitly not blocked
  so the page does not render as an unstyled skeleton in Google's tests. Only
  `/api/` is disallowed.
- **`app/sitemap.ts`** — one entry, because one route exists. Listing unbuilt
  `/services/*` URLs would put 404s in the sitemap.
- **JSON-LD** (`components/StructuredData.tsx`): an `@graph` of Organization,
  WebSite and WebPage, built entirely from `lib/site-config` so it can only
  describe what the page actually shows. `aggregateRating`/`Review`,
  `award`/`numberOfEmployees` and `SearchAction` are deliberately omitted — the
  ratings on the page are third-party badges, the head-count and awards are
  approximate marketing figures, and there is no URL-addressable site search.
- Meaningful `alt` text and intrinsic `width`/`height` on every `<img>`, so image
  boxes are reserved before decode.

### Performance

- **Fonts self-hosted via `next/font/google`.** Poppins, Figtree and Inter are now
  emitted as one same-origin `@font-face` block; the render-blocking
  `fonts.googleapis.com` stylesheet and both preconnects are gone. Measured over
  three Lighthouse mobile runs each, back to back (recorded in `app/layout.tsx`):

  | | Perf | FCP | LCP |
  | --- | --- | --- | --- |
  | Google Fonts `<link>` | 47–49 | 3.5s | 4.1–4.3s |
  | Self-hosted | 57–61 | 2.0–2.2s | 3.5–3.6s |

  Lato was dropped (it was requested for a `--font-alt` token nothing used), and
  Inter is not preloaded — it is a 48kB variable file used by four below-the-fold
  rules and was competing with the first paint.
- **SVG sprite cut from 33 symbols to 1.** An exhaustive search for `#icon-*` /
  `#logo-*` found references to exactly two ids, one of which was never defined.
  The other 32 symbols were ~14kB of markup and ~140 DOM nodes parsed and laid
  out on every page load for nothing.
- **Smaller client bundle.** `Industries` and `Blogs` had `"use client"` and unused
  React imports while containing no state, effects or handlers — both are now
  server-rendered. `framer-motion` was removed as a dependency entirely, along
  with the `GeminiSparkle` component that pulled it in.
- **Below-the-fold work deferred.** `Partners` clones 21 marquee logos and
  measures its awards column inside `requestIdleCallback` (with a `setTimeout`
  fallback for Safari) instead of during hydration, where the clone was a burst of
  DOM writes and the measure a forced reflow.
- **Long-lived caching** for `/next-assets/*`: `max-age=2592000, stale-while-revalidate=604800`
  (30 days + a week). Not `immutable` — these filenames are not content-hashed, so
  a logo swap has to be able to go live.
- Lazy loading and `decoding="async"` throughout; the few marquee logos that must
  paint immediately use `loading="eager" fetchPriority="low"`.
- `poweredByHeader` disabled.

### Assets

- **`scripts/optimize-images.js`** (`npm run optimize:images`) re-encodes the
  page's oversized rasters to WebP at roughly 2× the size they are actually drawn
  at, with per-family caps (a 150px badge and a 440px slide do not want the same
  number), then rewrites every reference in `.tsx`/`.ts`/`.css`/`.mjs` — including
  URI-encoded filenames with spaces. Originals are moved to `.image-originals/`
  (gitignored), so they stop being deployed but stay on disk to re-run from.
- Result: **59 WebP files totalling 1.67 MB** now stand in for the PNG/JPEG
  masters they were encoded from — 50 of those originals were tracked in the
  initial commit and came to roughly 48 MB between them. The navbar logo alone
  shipped at 7286×1800 to be drawn at 223×44; four portraits came to 13 MB as PNGs.
- Six new portfolio screenshots and a Visual Objects review badge were added.

### Technical

- `lib/site-config.ts` as the single import point for URLs, contact details and
  the `live()` / `isExternalHref()` helpers, so no component hard-codes a host.
- `next.config.mjs`: cache headers, `poweredByHeader: false`, opt-in `distDir` via
  `NEXT_DIST_DIR`. `images.unoptimized` is left **on** deliberately — turning it
  off only pays once the rasters move to `next/image`, and that migration changes
  how each image box is sized and when it decodes, which this page cannot absorb
  blindly (the hero, the marquee and the showcase all measure decoded images).
  That is a separate task with a visual diff, not an SEO side effect.
- `.gitignore` covers `.image-originals/` and `.next-build/`; `tsconfig.json`
  includes the alternate build-output type directories.
- Deleted: `components/AiQueryModal.tsx`, `components/GeminiSparkle.tsx`,
  `components/GeminiSparkle.module.css`.

---

## Known gaps

- **`components/AiEcosystem.tsx` is not mounted.** The component and its styles
  exist but nothing imports it; it renders nowhere on the current page.
- **`images.unoptimized: true`** — see above. Raster images are plain `<img>`
  tags; only `Domains` uses `next/image`.
- **Blog and case cards are placeholders.** No articles or case-study pages exist
  behind them yet, which is why their "Read More" affordances are not links.
- **Most destinations leave this origin.** This deployment serves `/` only;
  service, industry, blog and policy links point at the live content site via
  `CONTENT_SITE_URL`. Setting that constant to `""` turns every one of them back
  into a same-origin path once the routes ship here.
- The India phone numbers on the live site conflict with each other; the set in
  `lib/site-config.ts` mirrors what the footer renders and needs client
  confirmation before any of it is "corrected".
