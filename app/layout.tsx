import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SvgSymbols } from "@/components/SvgSymbols";
import { ScriptsController } from "@/components/ScriptsController";
import { StickyAiSearchDock } from "@/components/StickyAiSearchDock";
import { ContactDock } from "@/components/ContactDock";
import { StructuredData } from "@/components/StructuredData";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  THEME_COLOR,
  X_HANDLE,
} from "@/lib/site-config";

/* Fonts are self-hosted from /public/fonts and declared in styles/fonts.css,
   which globals.css @imports so the whole @font-face layer rides along inside
   the single emitted stylesheet.

   They used to come from next/font/google. Same three families, same weights,
   same files — the move was about preloading. next/font renames the files it
   wants preloaded to *.p.woff2 and registers them in
   .next/server/next-font-manifest.json, and the App Router turns that manifest
   into <link rel="preload" as="font"> tags. The manifest was building empty
   ("app": {}) because NextFontManifestPlugin matches loader modules against the
   forward-slash literal "/next-font-loader/index.js?", which never matches the
   backslash-spelled module request a Windows build produces. So the served HTML
   carried no font preload at all, and Poppins was not discovered until the
   stylesheet had parsed and the h1 had been laid out — and that h1 is the LCP
   element.

   The links below are that preload, done by hand against URLs the build cannot
   rename. Only the Poppins latin weights that render above the fold are listed:

       400  body / .hero__eyebrow on desktop
       500  .hero__with, .hero__eyebrow under 768px
       600  .hero__subheading
       700  the h1 (UA default weight for h1) on desktop
       800  the h1 under 768px, where the mobile rule overrides to 800

   Not preloaded, on purpose: Poppins 300 (four rules, none above the fold),
   every latin-ext file (unicode-range keeps them unfetched for latin copy),
   Figtree (--font-util, all below the fold) and Inter (--font-ui, four rules,
   also below the fold, and the largest single font file at 48 kB). Those still
   load — the browser fetches them when it lays those elements out — they just
   stop competing with the hero for bandwidth.

   crossOrigin is required even though these are same-origin: font fetches are
   CORS-mode, and a preload whose mode does not match the eventual request is
   discarded and downloaded a second time. */
const PRELOADED_FONTS = [
  "/fonts/poppins-400-latin.woff2",
  "/fonts/poppins-500-latin.woff2",
  "/fonts/poppins-600-latin.woff2",
  "/fonts/poppins-700-latin.woff2",
  "/fonts/poppins-800-latin.woff2",
];

export const metadata: Metadata = {
  /* Makes every relative URL below — canonical, OG image, icons — resolve
     against the real host. Without it Next emits relative og:url/og:image
     values, which most crawlers and every social scraper reject. */
  metadataBase: new URL(SITE_URL),

  /* `default` is the homepage title; `template` is what any future route
     gets when it sets only its own `title`, so page titles stay branded
     without each page repeating the company name. */
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,

  /* Keywords carry no ranking weight at Google and have not since 2009. They
     are here for the engines that still read the tag — Bing documents it, and
     several regional crawlers use it — and because the LLM answer engines now
     scraping the page treat it as a topic hint. Every term below matches copy
     that actually appears on this page; a stuffed list is what gets the tag
     discarded. */
  keywords: SITE_KEYWORDS,

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Technology",

  /* Stops iOS Safari rewriting the DOM to turn anything that looks like a
     phone number, date or address into a link of its own — it inserts its own
     anchors with its own colour, which lands on the stats row ("50+", "2018")
     and on the office addresses in the Footer. The real phone numbers are
     already explicit <a href="tel:">, so nothing is lost. */
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },

  /* Self-referencing canonical. Prevents the homepage being treated as a
     duplicate of itself when reached with tracking parameters, via www vs
     apex, or over http.

     `languages` carries one `en` entry plus `x-default`, both pointing here.
     The site serves a single English page to the USA, UK, Australia and India,
     so there are no regional variants to disambiguate. What the pair does say
     is "this URL is the default for every locale", which is the correct signal
     for a one-language site with a multi-country audience and stops Google
     inferring a country-specific alternate that does not exist. */
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "x-default": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    /* No `images` key: app/opengraph-image.png is a file convention. Next
       reads its real dimensions, hashes the URL and injects og:image plus
       twitter:image itself, taking the alt text from the sibling
       opengraph-image.alt.txt. Declaring images here would override that.

       It is a checked-in PNG rather than a generated app/opengraph-image.tsx
       because ImageResponse (next/og) cannot prerender on Windows in Next
       14.2 — @vercel/og resolves its bundled font with
       path.join(import.meta.url, ...), which turns the file:// URL into a
       backslash path and throws "Invalid URL" during `next build`. A static
       card also means no build-time font/wasm work at all. */
  },

  twitter: {
    card: "summary_large_image",
    /* Both point at the company account that SOCIAL_PROFILES.x already
       verified. `site` is the publisher, `creator` the author; on a company
       homepage they are the same account, and Twitter/X drops the byline row
       entirely when creator is absent. */
    site: X_HANDLE,
    creator: X_HANDLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  /* The defaults, stated explicitly so a stray directive elsewhere cannot
     quietly deindex the site. max-image-preview:large is what allows large
     thumbnails beside the result. */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* app/manifest.ts is a file convention, but unlike icon.svg it does not
     inject its own <link>. Naming the route here is what emits
     <link rel="manifest" href="/manifest.webmanifest">. */
  manifest: "/manifest.webmanifest",

  /* No `icons` key on purpose. app/icon.svg and app/apple-icon.png are file
     conventions — Next emits the <link rel="icon"> and
     <link rel="apple-touch-icon"> tags from them, with hashed URLs. Listing
     paths here by hand would override that and hard-code URLs that the
     build is free to change. */
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Deliberately no maximumScale / userScalable: capping pinch-zoom fails
     WCAG 1.4.4 and Lighthouse audits for it directly. */
  themeColor: THEME_COLOR,
  /* The page is light-only — there is no dark palette in globals.css. Saying
     so stops a dark-mode browser applying its own form-control and scrollbar
     colours over a light page. */
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* No preconnects: every font, image and script this page loads is
       same-origin, so there is no third-party handshake left to warm up. */
    <html lang="en">
      <head>
        {/* The domain icon sprite. It carries the 39 Expertise Across Domains
            icons, which used to be a string table inside Domains.tsx and so
            were compiled into the page chunk — 50KB of the 76KB that chunk
            weighed gzipped, for markup the accordion had already written into
            the HTML. As a file they are downloaded once instead of twice.

            prefetch, not preload: the section is well below the fold, so this
            has no business on the critical path. Measured against no hint at
            all it was the same on TBT and slightly better on Speed Index —
            the browser finds the <use> references in the accordion markup and
            fetches the sprite during load either way, so the hint only makes
            the priority explicit. */}
        <link
          rel="prefetch"
          href="/assets/icons/domains-sprite.svg?v=1"
          as="image"
          type="image/svg+xml"
        />
        {PRELOADED_FONTS.map((href) => (
          <link
            key={href}
            rel="preload"
            href={href}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <StructuredData />
        <SvgSymbols />
        <ScriptsController />
        {children}
        <StickyAiSearchDock />
        <ContactDock />
      </body>
    </html>
  );
}
