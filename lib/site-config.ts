/* Single source of truth for the SEO layer.
   ------------------------------------------------------------------
   Every value in this file has to be verifiable from the site's own
   visible content (the Footer, the "Who We Are" card) or from a
   company profile that was checked to exist. Nothing here may assert a
   fact the rendered page does not — the JSON-LD in
   components/StructuredData.tsx is built entirely from this file, and
   structured data that describes content the page does not show is a
   Google violation, not a bonus.
   ------------------------------------------------------------------ */

/* Drives metadataBase, the canonical URL, robots.txt and sitemap.xml.
   Set NEXT_PUBLIC_SITE_URL on a staging/preview deployment so its
   canonicals and sitemap point at that host instead of silently
   claiming to be production. Trailing slash stripped so every joined
   path below produces exactly one. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fulminoussoftware.com"
).replace(/\/+$/, "");

/* Where the company's existing service / policy / blog pages actually
   live today. Kept separate from SITE_URL on purpose: this homepage does
   not implement /services/*, /blog or /privacy-policy, so links to that
   content have to resolve against the site that does serve it. When this
   build eventually replaces the live site, changing this one constant to
   "" turns every one of those links back into a same-origin path. */
export const CONTENT_SITE_URL = "https://fulminoussoftware.com";

/** A page on the live content site. Every path passed here was checked
 *  to return HTTP 200 — see the report accompanying this change. */
export const live = (path: string) => `${CONTENT_SITE_URL}${path}`;

/** True for anything that leaves this origin, so the markup can add
 *  target/rel without every call site repeating the test. */
export const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

export const SITE_NAME = "Fulminous Software";

/* Aligned with the actual business and the searches it wants to be found
   for — custom software and AI development — rather than stuffed with
   every service the company offers. */
export const SITE_TITLE =
  "Fulminous Software | Custom Software & AI Development Company";

export const SITE_DESCRIPTION =
  "Fulminous Software is a custom software and AI development company building web, mobile, cloud and e-commerce solutions for businesses in the USA, UK, Australia and India.";

/* Stated on the homepage: "the company was founded in 2018". */
export const FOUNDING_YEAR = "2018";

/* Verified to exist (HTTP 200) on 2026-08-13. */
export const SOCIAL_PROFILES = {
  facebook: "https://www.facebook.com/fulminoussoftware/",
  youtube: "https://www.youtube.com/@fulminoussoftware",
  instagram: "https://www.instagram.com/fulminous.software/",
  x: "https://x.com/fulminous_soft",
  linkedin: "https://www.linkedin.com/company/fulminous-software-solutions/",
} as const;

/* Exactly the numbers and addresses the Footer renders. Do not add,
   "correct" or reconcile any of these without the client confirming
   them — see the note about the conflicting India numbers in the
   accompanying report. */
export const CONTACT = {
  usaPhone: "+1-803-999-3940",
  ukPhone: "+44-7867048979",
  indiaPhone: "+91-9680567092",
  email: "help@fulminous.tech",
} as const;

export const OFFICES = [
  {
    name: "UK Office",
    street: "31 Lemington Gardens, Seven Kings",
    city: "London",
    postalCode: "IG3 9TX",
    country: "GB",
  },
  {
    name: "USA Office",
    street: "1113 WA Gamble Rd",
    city: "Manning",
    region: "South Carolina",
    postalCode: "29102",
    country: "US",
  },
  {
    name: "Australia Office",
    street: "20 Mckinlay Ave",
    city: "Adelaide",
    postalCode: "5086",
    country: "AU",
  },
  {
    name: "India Office",
    street: "B-54 Kings Rd, Nirman Nagar",
    city: "Jaipur",
    region: "Rajasthan",
    postalCode: "302019",
    country: "IN",
  },
] as const;
