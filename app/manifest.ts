import type { MetadataRoute } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  THEME_COLOR,
} from "@/lib/site-config";

/* Web app manifest, served at /manifest.webmanifest.
   ------------------------------------------------------------------
   Lighthouse's installability checks read this, and so does every mobile
   browser deciding what to call the site and what colour to paint the
   address bar when someone adds it to their home screen. Without it Android
   Chrome uses the <title> as the shortcut label — the full 62-character
   "Fulminous Software | Custom Software & AI Development Company" — and
   falls back to a white status bar.

   `display: "browser"` rather than "standalone" on purpose. This is a
   marketing homepage whose calls to action all leave for the live content
   site; a standalone window would strip the URL bar and back button from a
   page that is mostly outbound links, which traps the visitor. "browser"
   still supplies the name, icon and theme colour without changing how the
   site opens.

   Icons reuse the two app/ file-convention assets so there is exactly one
   copy of the mark in the repo. They are referenced by their route paths,
   not the hashed URLs Next generates for <link rel="icon"> — both routes
   serve the same bytes, and a manifest has to name a stable URL. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    /* What actually fits under a home-screen icon: Android truncates at
       roughly 12 characters, iOS a little sooner. */
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: THEME_COLOR,
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity", "developer"],
    icons: [
      {
        src: "/favicon.ico",
        type: "image/x-icon",
        /* The three bitmaps the .ico actually carries, named individually so a
           launcher picks the closest one instead of rescaling whichever it
           finds first. Larger slots fall through to the 180px icon below. */
        sizes: "16x16 32x32 48x48",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
        purpose: "any",
      },
    ],
  };
}
