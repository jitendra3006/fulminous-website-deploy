import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/* One entry, because one route exists. app/ contains exactly
   layout.tsx + page.tsx, so "/" is the only URL this deployment serves —
   every other destination in the UI points at the live content site,
   which publishes its own sitemap.

   Adding /services/*, /industries/*, /blog etc. here before those routes
   exist would put 404s in the sitemap, which is worse than omitting them:
   it spends crawl budget and marks the site as unreliable. Add each URL
   to this array as the real page ships. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      /* No trailing slash: this is the exact string Next emits as the
         canonical for "/", and a sitemap entry that differs from the
         canonical only by a slash is the kind of thing that shows up in
         Search Console as "Alternate page with proper canonical tag". */
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
