import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/* Deliberately permissive. The homepage's layout, animations and hero fit
   pass all depend on the stylesheet and the client bundles under /_next,
   so nothing here may disallow them — a blocked /_next is the classic way
   a site renders correctly for users and as an unstyled skeleton in
   Google's mobile-friendly test.

   Only genuinely non-indexable Next internals are excluded: /api has no
   routes today but would be data endpoints rather than pages if it gained
   any. No staging or admin paths exist in this project to hide. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
