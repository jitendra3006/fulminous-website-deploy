"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/* The six domains, in the order the tab rail lists them. The accordion below
   1024px is driven off this rather than off the rail's DOM, so the icon for a
   domain is declared once next to its label. */
const DOMAIN_ICONS = [
  "/assets/icons/Emerging Technologies & AI.svg",
  "/assets/icons/Backend Development.svg",
  "/assets/icons/Frontend Development.svg",
  "/assets/icons/Mobile Technologies.svg",
  "/assets/icons/CMS & Ecommerce.svg",
  "/assets/icons/Cloud Platforms.svg",
];

const AccChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DOMAINS_DATA = [
  {
    label: "Emerging Technologies & AI",
    sub: "We create smart solutions using all the latest technologies",
    skills: [
      {
        iconImg: "/assets/AI & ML.svg",
        icon: "icon-bot",
        title: "AI & ML",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Generative AI Development.svg",
        icon: "icon-sparkles",
        title: "Generative AI Development",
        desc: "Connect for live, two-way collaboration",
      },
      {
        iconImg: "/assets/Chatbot & Virtual Assistant Development.svg",
        icon: "icon-qa",
        title: "Chatbot & Virtual Assistant Development",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/IoT Solutions.svg",
        icon: "icon-cloud",
        title: "IoT Solutions",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/Blockchain Development Business Intelligence.svg",
        icon: "logo-react",
        title: "Blockchain Development Business Intelligence",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/ARVR Application Development.svg",
        icon: "logo-frontend",
        title: "AR/VR Application Development",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Automation & Workflow Solutions.svg",
        icon: "logo-vue",
        title: "Automation & Workflow Solutions",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
    ],
  },
  {
    label: "Backend Development",
    sub: "Fulminous Software uses trending technologies to develop backend systems for web and mobile applications",
    skills: [
      {
        iconImg: "/assets/Node.js Development Services.svg",
        icon: "logo-node",
        title: "Node.js Development Services",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Dot NET Development Services (2).svg",
        icon: "logo-mern",
        title: "Dot NET Development Services",
        desc: "Connect for live, two-way collaboration",
      },
      {
        iconImg: "/assets/PHP Web Development.svg",
        icon: "logo-php",
        title: "PHP Web Development",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/CodeIgniter Framework.svg",
        icon: "logo-codeigniter",
        title: "CodeIgniter Framework",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/CakePHP Web Development.svg",
        icon: "logo-cakephp",
        title: "CakePHP Web Development",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/JavaScript Development Solutions.svg",
        icon: "logo-js",
        title: "JavaScript Development Solutions",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Python Development Services.svg",
        icon: "logo-python",
        title: "Python Development Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Dot NET Development Services (2).svg",
        icon: "logo-dotnet",
        title: "Dot NET Development Services",
        desc: "Connect for live, two-way collaboration",
      },
    ],
  },
  {
    label: "Frontend Development",
    sub: "Fulminous Software is proficient in the latest frontend solutions to make your platforms highly engaging and easy to use",
    skills: [
      {
        iconImg: "/assets/JavaScript Development Solutions.svg",
        icon: "logo-react",
        title: "React.js Development Services",
        desc: "Separate design explorations from ready-to-build work with React.",
      },
      {
        iconImg: "/assets/Angular Development Solutions.svg",
        icon: "logo-angular",
        title: "Angular Development Solutions",
        desc: "Connect for live, two-way collaboration and enterprise web apps.",
      },
      {
        iconImg: "/assets/Full-Stack Development Services.svg",
        icon: "logo-frontend",
        title: "Full-Stack Development Services",
        desc: "Export artboards to Zipline, collaborate seamlessly across teams.",
      },
      {
        iconImg: "/assets/MEAN Stack Development.svg",
        icon: "logo-mean",
        title: "MEAN Stack Development",
        desc: "Link Zeplin components to stories in Storybook with Mongo & Angular.",
      },
      {
        iconImg: "/assets/MERN Stack Development.svg",
        icon: "logo-mern",
        title: "MERN Stack Development",
        desc: "Link Zeplin components to stories in Storybook with Mongo & React.",
      },
      {
        iconImg: "/assets/Custom Frontend Solutions.svg",
        icon: "logo-vue",
        title: "Custom Frontend Solutions",
        desc: "Separate design explorations from ready-to-build work.",
      },
    ],
  },
  {
    label: "Mobile Technologies",
    sub: "Fulminous Software is proficient in the latest frontend solutions to make your platforms highly engaging and easy to use",
    skills: [
      {
        iconImg: "/assets/iOS.svg",
        icon: "logo-ios",
        title: "iOS Application Development",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/React Native.svg",
        icon: "logo-react",
        title: "React Native Development",
        desc: "Connect for live, two-way collaboration",
      },
      {
        iconImg: "/assets/Android.svg",
        icon: "logo-android",
        title: "Android Application Development",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Java Development Services.svg",
        icon: "logo-java",
        title: "Java Development Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Hybrid Framework.svg",
        icon: "logo-hybrid",
        title: "Hybrid Framework",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/Flutter.svg",
        icon: "logo-flutter",
        title: "Flutter Application Development",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/Ionic Framework Development.svg",
        icon: "logo-ionic",
        title: "Ionic Framework Development",
        desc: "Separate design explorations from ready-to-build work",
      },
    ],
  },
  {
    label: "CMS & Ecommerce",
    sub: "Fulminous Software develops websites and online stores using popular CMS and eCommerce platforms",
    skills: [
      {
        iconImg: "/assets/WordPress Development Services.svg",
        icon: "logo-wordpress",
        title: "WordPress Development Services",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Drupal Development Services.svg",
        icon: "logo-drupal",
        title: "Drupal Development Services",
        desc: "Connect for live, two-way collaboration",
      },
      {
        iconImg: "/assets/Woocommerce Development Services.svg",
        icon: "logo-woocommerce",
        title: "Woocommerce Development Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Sanity CMS Development.svg",
        icon: "logo-sanity",
        title: "Sanity CMS Development",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Strapi Development.svg",
        icon: "logo-strapi",
        title: "Strapi Development",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/Platform Implementation.svg",
        icon: "logo-platform",
        title: "Platform Implementation",
        desc: "Link Zeplin components to stories in Storybook",
      },
    ],
  },
  {
    label: "Cloud Platforms",
    sub: "Fulminous Software is proficient in the latest cloud platforms and tools",
    skills: [
      {
        iconImg: "/assets/IoT Solutions.svg",
        icon: "icon-iot",
        title: "IoT Development Services",
        desc: "Separate design explorations from ready-to-build work",
      },
      {
        iconImg: "/assets/Cloud Computing Services.svg",
        icon: "icon-cloud",
        title: "Cloud Computing Services",
        desc: "Connect for live, two-way collaboration",
      },
      {
        iconImg: "/assets/AWS Development Services.svg",
        icon: "logo-aws",
        title: "AWS Development Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Azure DevOps Services.svg",
        icon: "logo-azure",
        title: "Azure DevOps Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Cloud Migration Services.svg",
        icon: "icon-migration",
        title: "Cloud Migration Services",
        desc: "Export artboards to Zipline, collaborate across teams",
      },
      {
        iconImg: "/assets/Infrastructure Management.svg",
        icon: "icon-infra",
        title: "Infrastructure Management",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/DevOps Automation.svg",
        icon: "logo-devops",
        title: "DevOps Automation",
        desc: "Link Zeplin components to stories in Storybook",
      },
      {
        iconImg: "/assets/Cloud Security Solutions.svg",
        icon: "icon-security",
        title: "Cloud Security Solutions",
        desc: "Link Zeplin components to stories in Storybook",
      },
    ],
  },
];

/* One drawing per technology, matched on the row's title. The desktop panel
   is built with innerHTML, so these are authored as markup strings rather
   than JSX; the phone accordion renders the same strings. They used to live
   inside the effect that builds the desktop panel, which is why the
   accordion could not reach them and fell back to a different icon set --
   the two views showed different pictures for the same row. */
function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getTechIconSvg(title: string): string {
  const t = title.toLowerCase();

  // 1. Emerging Tech & AI
  if (t.includes("ai & ml") || t.includes("machine learning")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#164a9e"/>
      <path d="M19 16L19.9 19L23 19.9L19.9 20.8L19 24L18.1 20.8L15 19.9L18.1 19L19 16Z" fill="#164a9e" opacity="0.75"/>
    </svg>`;
  }
  if (t.includes("generative ai")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2.1 2.1m-8.8 8.8l-2.1 2.1m13-2.1l-2.1-2.1m-8.8-8.8L4.5 5.5M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("chatbot") || t.includes("virtual assistant")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="4" fill="#164a9e"/>
      <circle cx="8.5" cy="12" r="1.5" fill="#ffffff"/>
      <circle cx="15.5" cy="12" r="1.5" fill="#ffffff"/>
      <path d="M12 2v4M8 22h8" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("iot")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v9m0 0l-3-3m3 3l3-3M5 12a7 7 0 0014 0" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21a2 2 0 100-4 2 2 0 000 4z" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("blockchain")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="#164a9e" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="#164a9e" strokeWidth="2"/>
      <rect x="8.5" y="14" width="7" height="7" rx="2" fill="#164a9e"/>
      <path d="M6.5 10v2h5v2M17.5 10v2h-5" stroke="#164a9e" strokeWidth="2"/>
    </svg>`;
  }
  if (t.includes("ar/vr") || t.includes("arvr")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v6a3 3 0 01-3 3h-3.5a1.5 1.5 0 00-1.2.6l-.8 1a1.5 1.5 0 01-2.4 0l-.8-1a1.5 1.5 0 00-1.2-.6H5a3 3 0 01-3-3V9z" stroke="#164a9e" strokeWidth="2"/>
      <circle cx="7" cy="12" r="1.5" fill="#164a9e"/>
      <circle cx="17" cy="12" r="1.5" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("automation") || t.includes("workflow")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3" fill="#164a9e"/>
      <circle cx="18" cy="12" r="3" fill="#164a9e"/>
      <circle cx="6" cy="18" r="3" fill="#164a9e"/>
      <path d="M8.5 7.5l7 3.5M8.5 16.5l7-3.5" stroke="#164a9e" strokeWidth="2"/>
    </svg>`;
  }

  // 2. Backend Development
  if (t.includes("node")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" stroke="#164a9e" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 7v10M12 12l5 3" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("net") || t.includes("dotnet")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="#164a9e" strokeWidth="2"/>
      <path d="M7 10l3 3-3 3M13 16h4" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>`;
  }
  if (t.includes("php")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="12" rx="9" ry="6" stroke="#164a9e" strokeWidth="2"/>
      <path d="M8 10v4M8 10h2a1.5 1.5 0 010 3H8M14 10v4M14 10h2a1.5 1.5 0 010 3h-2" stroke="#164a9e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("codeigniter")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3c0 4-4 6-4 10a6 6 0 0012 0c0-6-4-8-4-10-1 2-2 3-4 0z" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("cakephp")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 14h16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" fill="#164a9e"/>
      <path d="M4 9h16v3H4V9zM7 5h10v2H7V5z" fill="#164a9e" opacity="0.75"/>
    </svg>`;
  }
  if (t.includes("javascript")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#164a9e" strokeWidth="2"/>
      <path d="M10 16.5c-1 0-1.5-.5-1.5-1.5M14 16.5c1 0 1.5-.5 1.5-1.5v-2c0-1-.5-1.5-1.5-1.5s-1.5.5-1.5 1.5" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("python")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3c-4 0-4.5 1.5-4.5 3.5V8h5v1H6C4 9 2.5 10.5 2.5 13s1.5 4 4 4H8v-2c0-2 1.5-3.5 3.5-3.5H16V9c0-2-1.5-6-4-6z" stroke="#164a9e" strokeWidth="1.8"/>
      <path d="M12 21c4 0 4.5-1.5 4.5-3.5V16h-5v-1h6.5c2 0 3.5-1.5 3.5-4s-1.5-4-4-4H16v2c0 2-1.5 3.5-3.5 3.5H8V15c0 2 1.5 6 4 6z" fill="#164a9e"/>
    </svg>`;
  }

  // 3. Frontend Development
  if (t.includes("react")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2.5" fill="#164a9e"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#164a9e" strokeWidth="1.8" transform="rotate(30 12 12)"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#164a9e" strokeWidth="1.8" transform="rotate(90 12 12)"/>
      <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#164a9e" strokeWidth="1.8" transform="rotate(150 12 12)"/>
    </svg>`;
  }
  if (t.includes("angular")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3.5 5l1.3 11.5L12 22l7.2-5.5L20.5 5 12 2z" stroke="#164a9e" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 6l3.5 8h-2l-.7-1.7h-1.6L10.5 14h-2L12 6z" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("full-stack") || t.includes("full stack")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="5" rx="1.5" fill="#164a9e"/>
      <rect x="3" y="11" width="18" height="5" rx="1.5" fill="#164a9e" opacity="0.6"/>
      <rect x="3" y="18" width="18" height="3" rx="1.5" fill="#164a9e" opacity="0.3"/>
    </svg>`;
  }
  if (t.includes("mean") || t.includes("mern")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="#164a9e"/>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="#164a9e" opacity="0.7"/>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="#164a9e" opacity="0.7"/>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("frontend")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#164a9e" strokeWidth="2"/>
      <path d="M2 9h20M7 6.5h.01M10 6.5h.01" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }

  // 4. Mobile Technologies
  if (t.includes("ios") || t.includes("apple")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="12" height="20" rx="3" stroke="#164a9e" strokeWidth="2"/>
      <line x1="10" y1="18" x2="14" y2="18" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("android")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10a6 6 0 0112 0v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z" stroke="#164a9e" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1" fill="#164a9e"/>
      <circle cx="15" cy="10" r="1" fill="#164a9e"/>
      <path d="M7 4l2 3M17 4l-2 3" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("java")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 19c4 2 8 2 12 0M8 21c3 1 5 1 8 0" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 3c-2 3 1 4-1 8M9 6c-2 3 1 4-1 8" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }
  if (t.includes("flutter")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L4 12l3.5 3.5L21 2H14zM14 12l-3.5 3.5L14 19h7l-3.5-3.5L21 12h-7z" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("hybrid") || t.includes("ionic")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="#164a9e" strokeWidth="2"/>
      <circle cx="12" cy="6" r="1.5" fill="#164a9e"/>
      <circle cx="12" cy="18" r="1.5" fill="#164a9e"/>
      <circle cx="6" cy="12" r="1.5" fill="#164a9e"/>
      <circle cx="18" cy="12" r="1.5" fill="#164a9e"/>
    </svg>`;
  }

  // 5. CMS & Ecommerce
  if (t.includes("wordpress")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#164a9e" strokeWidth="2"/>
      <path d="M4.5 12l4.5 9 3-6 3 6 4.5-9" stroke="#164a9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>`;
  }
  if (t.includes("woocommerce") || t.includes("ecommerce")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h2l2 12h11l2-8H6" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="19" r="1.5" fill="#164a9e"/>
      <circle cx="17" cy="19" r="1.5" fill="#164a9e"/>
    </svg>`;
  }
  if (t.includes("drupal") || t.includes("sanity") || t.includes("strapi") || t.includes("cms")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#164a9e" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M14 2v6h6M8 12h8M8 16h6" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
    </svg>`;
  }

  // 6. Cloud Platforms
  if (t.includes("aws") || t.includes("cloud")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10a6 6 0 00-11.3-2A5 5 0 003 13a5 5 0 005 5h10a4 4 0 000-8z" fill="#164a9e" opacity="0.2" stroke="#164a9e" strokeWidth="2"/>
    </svg>`;
  }
  if (t.includes("devops") || t.includes("azure")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4v16M4 12h16" stroke="#164a9e" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="8" stroke="#164a9e" strokeWidth="2"/>
    </svg>`;
  }
  if (t.includes("security")) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z" fill="#164a9e" opacity="0.2" stroke="#164a9e" strokeWidth="2"/>
    </svg>`;
  }

  // Default clean blue tech icon
  return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="#164a9e" strokeWidth="2"/>
    <path d="M7 12l3 3 7-7" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>`;
}

export function Domains() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* Below 1024px the rail-and-panel pair is replaced by an accordion that
     behaves like the mobile nav drawer: one section open at a time, the open
     section's heading pinned to the top of the screen while its list runs
     under it, and the row you tapped held exactly where your thumb left it.
     Desktop still renders the tabs and the panel and is not touched.

     Starts closed. It used to open the first domain on load, which put the
     active fill on a row nobody had touched and buried the other five under a
     list — the six headings are the point of the section on a phone. */
  const [openDomain, setOpenDomain] = useState<number | null>(null);
  const accAnimRef = useRef<number | null>(null);

  const stopAccAnim = useCallback(() => {
    if (accAnimRef.current !== null) {
      cancelAnimationFrame(accAnimRef.current);
      accAnimRef.current = null;
      document.documentElement.style.scrollBehavior = "";
    }
  }, []);

  /* Same anchoring the drawer uses, against the page scroll instead of a
     panel's. Opening a domain collapses whichever one was open, and when that
     one sits above the tapped row the page shrinks under it — without this the
     heading you pressed jumps up by the full height of the list that just
     closed. Correcting from the row's real position each frame absorbs it. */
  const toggleDomain = (index: number, trigger: HTMLElement) => {
    setOpenDomain((current) => (current === index ? null : index));

    stopAccAnim();

    /* html carries scroll-behavior: smooth, which would re-animate every
       correction we write. Suspended for the length of the pin, restored the
       moment it ends. */
    document.documentElement.style.scrollBehavior = "auto";

    const DURATION = 420;
    const startedAt = performance.now();
    const anchor = trigger.getBoundingClientRect().top;

    const tick = (now: number) => {
      const drift = trigger.getBoundingClientRect().top - anchor;
      if (Math.abs(drift) > 0.5) window.scrollBy(0, drift);
      if (now - startedAt < DURATION) {
        accAnimRef.current = requestAnimationFrame(tick);
      } else {
        accAnimRef.current = null;
        document.documentElement.style.scrollBehavior = "";
      }
    };

    accAnimRef.current = requestAnimationFrame(tick);
  };

  /* A touch or a wheel is the user taking over — let go rather than pulling
     the page back from under them. */
  useEffect(() => {
    const surrender = () => stopAccAnim();
    window.addEventListener("touchstart", surrender, { passive: true });
    window.addEventListener("wheel", surrender, { passive: true });
    return () => {
      window.removeEventListener("touchstart", surrender);
      window.removeEventListener("wheel", surrender);
      stopAccAnim();
    };
  }, [stopAccAnim]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const tabs = Array.from(root.querySelectorAll<HTMLElement>(".domain-tab"));
    const content = root.querySelector<HTMLElement>(".domains__content");
    if (!tabs.length || !content) return;


    function item(sk: { iconImg?: string; title: string; desc: string }, delay: number) {
      const iconMarkup = `<div class="feature-item__raw-icon">${getTechIconSvg(sk.title)}</div>`;

      return (
        '<article class="feature-item domains-anim" style="animation-delay:' +
        delay +
        'ms">' +
        iconMarkup +
        '<div class="feature-item__text">' +
        '<h4 class="feature-item__title">' +
        esc(sk.title) +
        "</h4>" +
        '<p class="feature-item__desc">' +
        esc(sk.desc) +
        "</p>" +
        "</div></article>"
      );
    }

    function render(i: number) {
      const d = DOMAINS_DATA[i];
      if (!d || !content) return;
      let a = "";
      let b = "";
      const SPLIT_MAP = [5, 5, 3, 4, 4, 5];
      const splitAt = SPLIT_MAP[i] ?? Math.ceil(d.skills.length / 2);
      for (let k = 0; k < d.skills.length; k++) {
        const html = item(d.skills[k], 120 + (k % 3) * 70);
        if (k < splitAt) a += html;
        else b += html;
      }
      content.innerHTML =
        '<div class="domains__content-head">' +
        '<h3 class="domains__content-title domains-anim">' +
        esc(d.label) +
        "</h3>" +
        '<p class="domains__content-sub domains-anim" style="animation-delay:60ms">' +
        esc(d.sub) +
        "</p>" +
        "</div>" +
        '<div class="domains__features">' +
        '<div class="domains__feature-col domains__feature-col--a">' +
        a +
        "</div>" +
        '<div class="domains__feature-col domains__feature-col--b">' +
        b +
        "</div>" +
        "</div>";
    }

    let active = 0;
    function activate(i: number, focus?: boolean) {
      for (let t = 0; t < tabs.length; t++) {
        const on = t === i;
        tabs[t].classList.toggle("domain-tab--active", on);
        tabs[t].setAttribute("aria-selected", on ? "true" : "false");
        tabs[t].tabIndex = on ? 0 : -1;
      }
      active = i;
      if (content) content.setAttribute("aria-labelledby", tabs[i].id);
      render(i);
      if (typeof window !== "undefined" && window.innerWidth < 768 && tabs[i]) {
        // Scroll the rail itself rather than calling scrollIntoView on the chip.
        // scrollIntoView walks every scrollable ancestor - including the page -
        // and it stops the moment the chip is technically inside the rail, which
        // parks it flush against the edge where the 40px fade sits on top of it.
        // A selected chip half under the fade reads as sliced. Scroll only the
        // rail, and keep a fade's width of clearance on the side we came from.
        const rail = tabs[i].closest<HTMLElement>(".domains__tabs");
        if (rail) {
          // Align to the start, matching the rail's own scroll-snap-align.
          // Centring loses a fight with the snap: the browser re-snaps to the
          // nearest chip start, so the chip ends up flush left anyway, one
          // frame later and via a second animation.
          const railBox = rail.getBoundingClientRect();
          const chip = tabs[i].getBoundingClientRect();
          const PAD = 2; // matches scroll-padding-inline-start on the rail
          const left = Math.max(
            0,
            Math.min(
              rail.scrollLeft + (chip.left - railBox.left) - PAD,
              rail.scrollWidth - rail.clientWidth
            )
          );
          if (Math.abs(left - rail.scrollLeft) > 1) {
            rail.scrollTo({ left, behavior: "smooth" });
          }
        }
      }
      if (focus && tabs[i]) tabs[i].focus();
    }

    content.id = "domains-panel";
    content.tabIndex = 0;

    const cleanups: Array<() => void> = [];

    tabs.forEach((tab, i) => {
      if (!tab.id) tab.id = "domain-tab-" + i;
      tab.setAttribute("aria-controls", "domains-panel");
      tab.tabIndex = i === 0 ? 0 : -1;

      const clickHandler = () => {
        if (i !== active) activate(i, false);
      };
      const keydownHandler = (e: KeyboardEvent) => {
        let ni: number | null = null;
        const n = tabs.length;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") ni = (i + 1) % n;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") ni = (i - 1 + n) % n;
        else if (e.key === "Home") ni = 0;
        else if (e.key === "End") ni = n - 1;
        if (ni !== null) {
          e.preventDefault();
          activate(ni, true);
        }
      };

      tab.addEventListener("click", clickHandler);
      tab.addEventListener("keydown", keydownHandler);

      cleanups.push(() => {
        tab.removeEventListener("click", clickHandler);
        tab.removeEventListener("keydown", keydownHandler);
      });
    });

    content.setAttribute("aria-labelledby", tabs[0].id);
    render(0);

    // Below desktop the chips scroll horizontally, and the container hard-clips
    // whatever sits under its edge — a sliced pill reads as a broken chip.
    // Fade only the side that actually has content scrolled past it, so the
    // leading chip stays crisp until you scroll.
    const rail = root.querySelector<HTMLElement>(".domains__tabs");
    if (rail) {
      const syncRailEdges = () => {
        rail.classList.toggle("has-start-overflow", rail.scrollLeft > 4);
        rail.classList.toggle(
          "has-end-overflow",
          rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4
        );
      };
      syncRailEdges();
      rail.addEventListener("scroll", syncRailEdges, { passive: true });
      window.addEventListener("resize", syncRailEdges);
      cleanups.push(() => {
        rail.removeEventListener("scroll", syncRailEdges);
        window.removeEventListener("resize", syncRailEdges);
      });
    }

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section ref={rootRef} className="domains" id="technology" aria-labelledby="domains-title">
      <div className="domains__inner">
        <div className="domains__head">
          <h2 className="domains__title" id="domains-title">
            Expertise Across Domains
          </h2>
          <p className="domains__subtitle">
            Software development experts from Fulminous Software are proficient in all the
            latest tech stacks.
          </p>
        </div>

        <div className="domains__body">
          {/* Mobile accordion (<1024px). The tab rail and its panel below are
              display:none at this width; this list is display:none above it. */}
          <div className="domains__accordion">
            {DOMAINS_DATA.map((domain, index) => {
              const isOpen = openDomain === index;
              return (
                <div
                  className={`domain-acc ${isOpen ? "is-open" : ""}`}
                  key={domain.label}
                >
                  <button
                    type="button"
                    className="domain-acc__head"
                    aria-expanded={isOpen}
                    aria-controls={`domain-panel-${index}`}
                    onClick={(e) => toggleDomain(index, e.currentTarget)}
                  >
                    <span className="domain-acc__icon">
                      <Image
                        src={DOMAIN_ICONS[index]}
                        alt=""
                        aria-hidden="true"
                        width={22}
                        height={22}
                        unoptimized
                      />
                    </span>
                    <span className="domain-acc__label">{domain.label}</span>
                    <span className="domain-acc__chevron">
                      <AccChevron />
                    </span>
                  </button>

                  <div className="domain-acc__panel" id={`domain-panel-${index}`}>
                    <div className="domain-acc__panel-inner">
                      {/* domain.sub is deliberately not rendered here. On
                          desktop the blurb sits beside a two-column panel and
                          has room; on a phone it put three lines of marketing
                          copy between the heading you pressed and the list you
                          pressed it for. The desktop panel still shows it. */}
                      <div className="domain-acc__body">
                        <ul className="domain-acc__list">
                          {domain.skills.map((skill, i) => (
                            <li
                              key={skill.title}
                              className="domain-acc__item"
                              /* Drives the entrance stagger in CSS — index in,
                                 delay out, so the timing lives with the rest
                                 of the animation instead of in JS. */
                              style={{ "--i": i } as React.CSSProperties}
                            >
                              {/* Same drawing the desktop panel puts beside
                                  this row. It was showing skill.iconImg here
                                  instead — a different set of files, so the
                                  two views disagreed on what, say, IoT
                                  Solutions looks like. The markup is a
                                  developer-authored constant from the table
                                  above, not anything that comes in from
                                  outside. */}
                              <span
                                className="domain-acc__item-icon"
                                aria-hidden="true"
                                dangerouslySetInnerHTML={{
                                  __html: getTechIconSvg(skill.title),
                                }}
                              />
                              <span className="domain-acc__item-label">
                                {skill.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="domains__tabs" role="tablist" aria-label="Technology domains">
            <button
              className="domain-tab domain-tab--active"
              type="button"
              role="tab"
              aria-selected="true"
            >
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Emerging Technologies & AI.svg" alt="Emerging Technologies & AI" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Emerging Technologies &amp; AI</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Backend Development.svg" alt="Backend Development" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Backend Development</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Frontend Development.svg" alt="Frontend Development" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Frontend Development</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Mobile Technologies.svg" alt="Mobile Technologies" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Mobile Technologies</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/CMS & Ecommerce.svg" alt="CMS & Ecommerce" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">CMS &amp; Ecommerce</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Cloud Platforms.svg" alt="Cloud Platforms" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Cloud Platforms</span>
            </button>
          </div>

          <div className="domains__content" tabIndex={0} role="tabpanel">
            <div className="domains__content-head">
              <h3 className="domains__content-title">{DOMAINS_DATA[0].label}</h3>
              <p className="domains__content-sub">{DOMAINS_DATA[0].sub}</p>
            </div>
            <div className="domains__features">
              <div className="domains__feature-col domains__feature-col--a">
                {DOMAINS_DATA[0].skills.slice(0, 4).map((sk, idx) => (
                  <article key={idx} className="feature-item">
                    <div className="feature-item__raw-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#164a9e" strokeWidth="2" />
                        <path d="M7 12l3 3 7-7" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="feature-item__text">
                      <h4 className="feature-item__title">{sk.title}</h4>
                      <p className="feature-item__desc">{sk.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="domains__feature-col domains__feature-col--b">
                {DOMAINS_DATA[0].skills.slice(4).map((sk, idx) => (
                  <article key={idx} className="feature-item">
                    <div className="feature-item__raw-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="4" stroke="#164a9e" strokeWidth="2" />
                        <path d="M7 12l3 3 7-7" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="feature-item__text">
                      <h4 className="feature-item__title">{sk.title}</h4>
                      <p className="feature-item__desc">{sk.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
