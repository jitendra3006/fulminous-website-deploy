import React from "react";
import {
  AREAS_SERVED,
  CONTACT,
  FOUNDING_YEAR,
  INDUSTRIES,
  OFFICES,
  SERVICES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/site-config";

/* JSON-LD for the homepage.
   ------------------------------------------------------------------
   Five nodes, each describing something that is actually on the page:

     Organization — the company the whole page is about. Name, logo,
       founding year, offices, phone numbers and social profiles all
       come from the Footer and the "Who We Are" card. It carries the
       service catalogue and the industry list as well, because both are
       rendered sections rather than claims.
     WebSite      — the site as an entity, so the Organization is
       identified as its publisher.
     WebPage      — this specific URL.
     BreadcrumbList — a one-item trail. On a single-page site this is
       what puts "Home" in the result rather than a bare URL fragment,
       and it gives the crawler an explicit statement that this URL is
       the root rather than something it has to infer.
     ItemList     — the eight industry cards, in DOM order.

   Deliberately absent:
     aggregateRating / Review — the page shows third-party Clutch,
       Trustpilot and Google badges. Restating those as the company's own
       review markup is self-serving review spam under Google's
       structured-data policy, and would risk a manual action.
     award / numberOfEmployees — "50+ Team Members" and the award images
       are approximate marketing figures, not the exact values these
       properties expect.
     SearchAction — there is no URL-addressable site search; the AI dock
       is an in-page panel, so a sitelinks searchbox target would 404.
     FAQPage — there is no question-and-answer content on this page.
       Marking up something else as one is the single most common cause
       of a structured-data manual action.
     LocalBusiness — the four offices are development offices, not
       walk-in premises with opening hours, and LocalBusiness without
       openingHours/geo tends to earn a map pin the company cannot
       service. Organization.location carries the same addresses without
       promising a storefront.
     Offer / priceRange — no price appears anywhere on the page.
   ------------------------------------------------------------------ */

/* No trailing slash, so every `url` and `@id` below is the same string Next
   emits as the canonical. Matching exactly is what lets a crawler equate the
   WebPage node with the page it is on. */
const HOME_URL = SITE_URL;
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;
const LOGO_ID = `${SITE_URL}/#logo`;
const BREADCRUMB_ID = `${SITE_URL}/#breadcrumb`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: HOME_URL,
      description: SITE_DESCRIPTION,
      /* The line under the hero headline, verbatim. */
      slogan: "Discuss. Design. Develop",
      foundingDate: FOUNDING_YEAR,
      email: CONTACT.email,
      /* Given an @id so the WebSite and WebPage nodes can point at the same
         ImageObject instead of each repeating the file. */
      logo: {
        "@type": "ImageObject",
        "@id": LOGO_ID,
        url: `${SITE_URL}/next-assets/Fulminous-Logo.webp`,
        /* The dimensions of the file this URL actually serves. They used to
           say 7286x1800, which was the original PNG before the image pass
           re-encoded it to webp at 373x92 — structured data that does not
           match the asset it points at is exactly what Google flags. */
        width: 373,
        height: 92,
        caption: `${SITE_NAME} logo`,
      },
      image: { "@id": LOGO_ID },
      sameAs: [
        SOCIAL_PROFILES.linkedin,
        SOCIAL_PROFILES.facebook,
        SOCIAL_PROFILES.x,
        SOCIAL_PROFILES.instagram,
        SOCIAL_PROFILES.youtube,
      ],
      /* Country codes rather than country names: areaServed accepts either,
         and the codes are unambiguous. Each one has an office listed in the
         Footer, so none of the four is an aspirational claim. */
      areaServed: AREAS_SERVED.map((code) => ({
        "@type": "Country",
        identifier: code,
      })),
      /* Topic signals for the entity, each backed by a rendered section:
         the Showcase slides, the Domains tech stack and the Industries grid.
         knowsAbout is how an Organization node states expertise without
         inventing an Offer for it. */
      knowsAbout: [
        ...SERVICES.map((service) => service.name),
        ...INDUSTRIES,
      ],
      /* The Showcase section, restated as a catalogue. Each entry is a
         Service the page visibly offers, provided by this Organization —
         which is what lets a crawler answer "what does this company do"
         from the markup rather than from prose extraction. */
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${SITE_NAME} services`,
        itemListElement: SERVICES.map((service, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.description,
            provider: { "@id": ORG_ID },
            serviceType: service.name,
          },
        })),
      },
      /* The India office is the primary address: the page states the
         company started from India. The other three are listed as
         additional locations rather than competing addresses. */
      address: {
        "@type": "PostalAddress",
        streetAddress: "B-54 Kings Rd, Nirman Nagar",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302019",
        addressCountry: "IN",
      },
      location: OFFICES.map((office) => ({
        "@type": "Place",
        name: office.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: office.street,
          addressLocality: office.city,
          ...("region" in office ? { addressRegion: office.region } : {}),
          postalCode: office.postalCode,
          addressCountry: office.country,
        },
      })),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: CONTACT.usaPhone,
          areaServed: "US",
          availableLanguage: "en",
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: CONTACT.ukPhone,
          areaServed: "GB",
          availableLanguage: "en",
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: CONTACT.indiaPhone,
          areaServed: "IN",
          availableLanguage: "en",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: HOME_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "WebPage",
      "@id": PAGE_ID,
      url: HOME_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      /* The logo is the page's representative image — it is what the OG card
         and the favicon both show, and there is no editorial hero photo to
         nominate instead. */
      primaryImageOfPage: { "@id": LOGO_ID },
      breadcrumb: { "@id": BREADCRUMB_ID },
      /* CSS selectors, not text: the hero headline and the paragraph under it
         are what a voice assistant should read out for this URL. speakable is
         still marked limited-availability by Google, so it is additive — no
         rendering or ranking depends on it. */
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".hero__headline", ".hero__subheading"],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": BREADCRUMB_ID,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: HOME_URL,
        },
      ],
    },
    {
      "@type": "ItemList",
      name: `Industries ${SITE_NAME} builds for`,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: INDUSTRIES.length,
      itemListElement: INDUSTRIES.map((industry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: industry,
      })),
    },
  ],
};

/* Every value above is a module constant, but escaping "<" keeps that true
   even if a future edit interpolates something: a literal "</script>" inside
   a JSON string would otherwise close the tag early. */
const json = JSON.stringify(graph).replace(/</g, "\\u003c");

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
