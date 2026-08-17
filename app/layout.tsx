import type { Metadata, Viewport } from "next";
import { Figtree, Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { SvgSymbols } from "@/components/SvgSymbols";

/* Self-hosted, same origin, emitted as one inline @font-face block.
   ------------------------------------------------------------------
   This was a <link> to fonts.googleapis.com plus two preconnects. Measured
   across three Lighthouse mobile runs each, back to back on the same
   machine state:

       Google Fonts <link>   perf 47-49   FCP 3.5s   LCP 4.1-4.3s
       self-hosted           perf 57-61   FCP 2.0-2.2s  LCP 3.5-3.6s

   The third-party stylesheet is render-blocking and sits behind two extra
   origins — googleapis for the CSS, gstatic for the files — so every DNS +
   TCP + TLS round trip lands in front of the first paint. Self-hosting
   removes both.

   Same families, same weights, same `display: swap`; only the host changes.
   Lato was dropped: the URL requested it for --font-alt, and nothing in the
   stylesheet or any component ever used --font-alt.

   `variable` hands each family out as a custom property and globals.css
   points its own --font-* tokens at those, so no rule that reads
   var(--font-display) had to change. Hero.tsx still re-measures on its
   ResizeObserver, so it absorbs the swap exactly as before — sooner now. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800", "900"],
  display: "swap",
  variable: "--font-figtree",
});

/* Not preloaded, unlike the other two.
   Inter ships as a variable font, so next/font serves one 48kB latin file that
   covers the whole weight axis — the single largest font asset on the page. The
   only four rules that reach for it (--font-ui: .feature-item__title,
   .feature-item__desc, .review-stat__score, .case-info__desc) are all well
   below the fold, so a <link rel="preload"> for it was competing at VeryHigh
   priority with the resources the first paint actually needs.
   Dropping the preload leaves the @font-face in place: Chrome still fetches the
   file when it lays those elements out, just without jumping the queue ahead of
   the hero. Nothing above the fold uses Inter, so no visible text swaps later
   than it did before. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});
import { ScriptsController } from "@/components/ScriptsController";
import { StickyAiSearchDock } from "@/components/StickyAiSearchDock";
import { ContactDock } from "@/components/ContactDock";
import { StructuredData } from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site-config";

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

  /* Self-referencing canonical. Prevents the homepage being treated as a
     duplicate of itself when reached with tracking parameters, via www vs
     apex, or over http. */
  alternates: {
    canonical: "/",
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

  /* No `icons` key on purpose. app/icon.svg and app/apple-icon.png are file
     conventions — Next emits the <link rel="icon"> and
     <link rel="apple-touch-icon"> tags from them, with hashed URLs. Listing
     paths here by hand would override that and hard-code URLs that the
     build is free to change. */
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* No preconnects: there is no fonts.googleapis.com or fonts.gstatic.com
       request left to warm up. See the next/font block at the top. */
    <html
      lang="en"
      className={`${poppins.variable} ${figtree.variable} ${inter.variable}`}
    >
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
