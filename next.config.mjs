/* Applied to every route. These are the headers Lighthouse's Best Practices
   category and the common security scanners (Mozilla Observatory,
   securityheaders.com) look for, minus the two that cannot be set safely from
   here:

     Content-Security-Policy — the page carries React's inline hydration
       payload and one inline JSON-LD block, so a useful CSP needs
       per-request nonces, which means middleware and a dynamic render. That
       trades this page's static prerender for a header, which is the wrong
       side of the deal; frame-ancestors below covers the clickjacking half
       of what a CSP would do here.
     Strict-Transport-Security — belongs to whatever terminates TLS. Setting
       it from the app means it is missing whenever the origin is reached
       over plain http, which is exactly the case it exists for. Configure it
       at the CDN/proxy instead.
   ------------------------------------------------------------------ */
const SECURITY_HEADERS = [
  {
    /* Stops a browser second-guessing a declared Content-Type. Without it a
       .webp served with a wrong type can be sniffed as something scriptable. */
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    /* Send the full URL to ourselves, only the origin cross-site, and nothing
       at all when leaving https for http. The Footer and Showcase link out to
       the live content site, which is same-registrable-domain but a separate
       origin, so it still receives the referrer it needs for its analytics. */
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    /* The modern replacement for X-Frame-Options: nothing may frame this page.
       There is no embed use case — the AI dock and contact dock are in-page. */
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'",
  },
  {
    /* Kept alongside frame-ancestors for the browsers that never implemented
       it — they are the same browsers that would otherwise allow the frame. */
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    /* Nothing on the page asks for any of these, so denying them up front
       means a future third-party script cannot start asking either. */
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    /* Blocks other origins from reading this one through Flash/Silverlight
       crossdomain policy files. Free to set; costs nothing to serve. */
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Left ON deliberately during the SEO pass rather than flipped.
     Turning optimization on only pays off once the raster images move from
     plain <img> to next/image, and that migration changes how each image
     box is sized and when it decodes — which this page cannot absorb
     blindly: Hero measures itself against the decoded badge PNGs to compute
     --hero-fit, Partners re-measures its marquee on every image load, and
     Showcase measures its tallest slide. It also needs a host that can run
     the optimizer (a plain static export cannot).
     So: a separate, approved task with a visual diff, not an SEO side
     effect. Every <img> already carries width/height and meaningful alt,
     which is the part of image SEO that does not depend on this flag. */
  images: {
    unoptimized: true
  },
  /* Nothing reads it and it names the stack to anyone scanning headers. */
  poweredByHeader: false,

  /* Strips console.* from the client bundle in production but keeps
     console.error, so the hooks' own warnings still surface in a real user's
     devtools while the chatter does not ship. Small win on bundle bytes and
     on main-thread time in the measurement loops in Partners/Showcase. */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        /* Anything under /public is served by Next with
           `Cache-Control: public, max-age=0` — so every repeat visit
           re-validates ~100 image requests, and a cold CDN edge re-fetches
           all of them. These filenames are not content-hashed, so
           `immutable` would be wrong: a logo swap has to be able to go live.
           30 days with a week of stale-while-revalidate is the compromise —
           a returning visitor pays nothing, and an updated file is picked up
           in the background on the next visit after it changes.
           Fonts and JS under /_next are hashed and already get a year from
           Next. */
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
      {
        /* /fonts is the one directory under public that can take `immutable`.
           Each filename spells out family, weight and subset
           (poppins-700-latin.woff2) and names an exact Google Fonts binary —
           changing the file would mean changing the font, which would mean a
           new filename. A year is the maximum any browser honours. */
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* `next build` and `next dev` both write to .next by default, so running a
     build while the dev server is up overwrites the chunks dev is serving and
     it dies with "Cannot find module './819.js'" until it is restarted. Set
     NEXT_DIST_DIR=.next-build before a build to keep the two apart. */
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {})
};

export default nextConfig;
