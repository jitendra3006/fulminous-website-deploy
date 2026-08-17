import React from "react";
import {
  CONTACT,
  FOUNDING_YEAR,
  OFFICES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/site-config";

/* JSON-LD for the homepage.
   ------------------------------------------------------------------
   Three nodes, each describing something that is actually on the page:

     Organization — the company the whole page is about. Name, logo,
       founding year, offices, phone numbers and social profiles all
       come from the Footer and the "Who We Are" card.
     WebSite      — the site as an entity, so the Organization is
       identified as its publisher.
     WebPage      — this specific URL.

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
   ------------------------------------------------------------------ */

/* No trailing slash, so every `url` and `@id` below is the same string Next
   emits as the canonical. Matching exactly is what lets a crawler equate the
   WebPage node with the page it is on. */
const HOME_URL = SITE_URL;
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PAGE_ID = `${SITE_URL}/#webpage`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: HOME_URL,
      description: SITE_DESCRIPTION,
      foundingDate: FOUNDING_YEAR,
      email: CONTACT.email,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/Fulminous-Logo.webp`,
        width: 7286,
        height: 1800,
        caption: `${SITE_NAME} logo`,
      },
      sameAs: [
        SOCIAL_PROFILES.linkedin,
        SOCIAL_PROFILES.facebook,
        SOCIAL_PROFILES.x,
        SOCIAL_PROFILES.instagram,
        SOCIAL_PROFILES.youtube,
      ],
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
