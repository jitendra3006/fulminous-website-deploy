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

  /* Anything under /public is served by Next with
     `Cache-Control: public, max-age=0` — so every repeat visit re-validates
     ~100 image requests, and a cold CDN edge re-fetches all of them. These
     filenames are not content-hashed, so `immutable` would be wrong: a logo
     swap has to be able to go live. 30 days with a week of
     stale-while-revalidate is the compromise — a returning visitor pays
     nothing, and an updated file is picked up in the background on the next
     visit after it changes.
     Fonts and JS under /_next are hashed and already get a year from Next. */
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
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
