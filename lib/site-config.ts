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

/* Origin prefix for the company's service / policy / blog pages. Now
   empty, so `live("/services")` yields the same-origin path "/services"
   instead of an absolute link back to the old host. Set it to a full
   origin (e.g. "https://fulminoussoftware.com") only if this build has
   to point at a different site for that content again. */
export const CONTENT_SITE_URL = "";

/** A content page of the site. Every path passed here was checked
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

/* Brand colour for the address bar and the installed-app splash. Taken from
   --color-primary in globals.css, so the chrome matches the navbar rather
   than guessing at a shade. */
export const THEME_COLOR = "#164a9e";

/* The @handle behind SOCIAL_PROFILES.x, spelled the way the twitter: card
   tags want it. Kept next to the profile URL it is derived from so the two
   cannot drift. */
export const X_HANDLE = "@fulminous_soft";

/* Read by exactly one engine class that still cares (Bing and the regional
   crawlers) and by LLM scrapers looking for a topic hint. Nine terms, each
   one lifted from copy that is actually rendered on this page — the tag is
   ignored outright when it reads as a keyword dump. */
export const SITE_KEYWORDS = [
  "custom software development company",
  "AI development company",
  "web development services",
  "mobile app development",
  "cloud and DevOps services",
  "e-commerce development",
  "UI/UX design services",
  "dedicated development teams",
  "software development company India",
];

/* The ten cards the Showcase renders, name and blurb copied from its
   SLIDES_DATA. They are restated here rather than imported because Showcase
   is a client component and StructuredData is a server one; the rule is that
   this list may only ever contain services the page visibly offers, so if a
   slide is added or renamed there, change it here too. Anything listed in
   structured data that a reader cannot find on the page is a Google
   structured-data violation, not extra coverage. */
export const SERVICES = [
  {
    name: "Software Development",
    description:
      "Custom software solutions built end to end for businesses of any size.",
  },
  {
    name: "Web Development",
    description:
      "Responsive, feature-rich websites and web applications.",
  },
  {
    name: "Mobile App Development",
    description:
      "Custom iOS and Android apps with trending features and engaging design.",
  },
  {
    name: "AI Development",
    description:
      "Generative AI, chatbot and AI-powered application development.",
  },
  {
    name: "Cloud & DevOps",
    description:
      "Cloud migration, infrastructure management, CI/CD and DevOps consulting.",
  },
  {
    name: "E-commerce Solutions",
    description:
      "Custom e-commerce platforms, marketplaces and B2B commerce solutions.",
  },
  {
    name: "UI/UX Design",
    description:
      "Engaging interface and experience design for digital platforms.",
  },
  {
    name: "Quality Assurance",
    description:
      "Manual, automated, performance, security and mobile app testing.",
  },
  {
    name: "Game Development Services",
    description:
      "Game apps and gaming software, from casual titles to real-money platforms.",
  },
  {
    name: "Dedicated Teams & Staff Augmentation",
    description:
      "Dedicated development teams, IT staff augmentation and technical consulting.",
  },
] as const;

/* The eight cards the Industries section renders, in DOM order. Same rule as
   SERVICES: this mirrors visible content and nothing else. */
export const INDUSTRIES = [
  "HealthCare",
  "Banking & Finance",
  "Real Estate",
  "Travel & Hospitality",
  "Media & Entertainment",
  "E-commerce & Retail",
  "Education & e-Learning",
  "Food & Restaurant",
] as const;

/* The four countries the page names as markets — the Footer lists an office
   in each, and the hero description says the same. Used for
   Organization.areaServed, which is what lets Google associate the company
   with a country-level query ("software development company UK") without the
   page having to claim a local address it does not have. */
export const AREAS_SERVED = ["US", "GB", "AU", "IN"] as const;
