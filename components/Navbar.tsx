"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { isExternalHref, live } from "@/lib/site-config";

/* Cross-site destinations open in a new tab, matching what the Footer's
   links already do, so a visitor exploring the menu does not lose the
   homepage. Keyed off the href so the in-page anchors that remain — #contact,
   #services, #who-we-are and the rest, all of which do resolve to a real
   section on this page — keep behaving as anchors. */
const crossSiteProps = (href: string) =>
  isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

const IconDiamond = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#0052cc" />
  </svg>
);

const IconStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#0052cc" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#0052cc" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="3" fill="#0052cc" />
  </svg>
);

const IconSmileD = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H5V4Z" fill="#0052cc" />
  </svg>
);

const IconRibbon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20C6 13.3726 11.3726 8 18 8V14C14.6863 14 12 16.6863 12 20H6Z" fill="#0052cc" />
    <path d="M18 4C10.268 4 4 10.268 4 18H10C10 13.5817 13.5817 10 18 10V4Z" fill="#0052cc" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------
   Services and Technology are described once, here, and rendered twice:
   as the desktop mega-dropdown and as the phone drawer's second level.
   They used to be two hand-written copies and had already drifted — the
   drawer was missing items the dropdown had and both were missing items
   the live site has.

   One entry per COLUMN of the desktop dropdown. A column may hold more
   than one titled group (Frontend sits above Cloud & DevOps in the same
   column). `hidden: true` is a column that continues the previous one:
   desktop draws no heading and the list just carries on, so the drawer
   folds those items back into the group before them.
   ------------------------------------------------------------------ */
type MegaLink = { label: string; desc: string; href: string };
type MegaGroup = { title: string; hidden?: boolean; items: MegaLink[] };

/* The hrefs here and in TECHNOLOGY_COLUMNS below were all bare fragments —
   "#mobile-app", "#nodejs" and so on — and not one of those ids exists
   anywhere in the DOM. Every menu item was therefore a link that scrolled
   nowhere and gave a crawler nothing. Each now points at the real page the
   live content site publishes for that service or stack; every URL was
   checked to return HTTP 200. Swap live("/x") for a local path as the
   corresponding page ships in this app. */
const SERVICES_COLUMNS: MegaGroup[][] = [
  [
    {
      title: "Browse by Services",
      items: [
        { label: "Mobile App Development", desc: "Native & cross-platform apps", href: live("/mobile-application-development") },
        { label: "Web Development", desc: "Responsive web applications", href: live("/website-development-services") },
        { label: "Cross Platform App Development", desc: "Single codebase solutions", href: live("/cross-platform-application-development-services") },
        { label: "Ecommerce Development", desc: "Custom online store platforms", href: live("/ecommerce-development-services") },
        { label: "UI & UX Designing", desc: "Engaging digital interfaces", href: live("/ui-ux-design-services") },
        { label: "Digital Marketing", desc: "Campaigns that bring traffic", href: live("/digital-marketing-services") },
        { label: "Web Design Services", desc: "Brand-led visual design", href: live("/web-design-company") },
      ],
    },
  ],
  [
    {
      title: "Browse by Services (continued)",
      hidden: true,
      items: [
        { label: "Opensource Development", desc: "Flexible & scalable platforms", href: live("/opensource-development") },
        { label: "Quality Assurance", desc: "Automated & manual testing", href: live("/software-testing-services") },
        { label: "NFT Development", desc: "Web3 & blockchain solutions", href: live("/nft-development-services") },
        { label: "App Prototype & Strategy", desc: "Wireframes & user journeys", href: live("/mvp-app-development-company") },
        { label: "Wearable App Development", desc: "Watch & wearable experiences", href: live("/wearable-app-development-services") },
        { label: "Progressive Web Apps", desc: "App-like installable web", href: live("/progressive-web-apps-development-services") },
        { label: "Staff Augmentation & Dedicated Teams", desc: "Engineers who join your team", href: live("/outsourcing-services") },
      ],
    },
  ],
  [
    {
      title: "Browse by Services (continued)",
      hidden: true,
      items: [
        { label: "IoT Development", desc: "Connected device platforms", href: live("/iot-development-services") },
        { label: "Cloud Computing", desc: "AWS, Azure & GCP hosting", href: live("/cloud-computing-development-services") },
        { label: "Consulting Services", desc: "Architecture & tech strategy", href: live("/software-consulting-development-services") },
        { label: "Software Maintenance & Support", desc: "Ongoing care & SLAs", href: live("/it-infrastructure-support-services") },
        { label: "AI Development Services", desc: "ML & LLM smart models", href: live("/enterprise-ai-development-company") },
        { label: "Legacy Software Modernization", desc: "System upgrades & refactoring", href: live("/legacy-software-modernization-services") },
        { label: "Mobile Game Development", desc: "Immersive gaming apps", href: live("/game-development-services") },
      ],
    },
  ],
  [
    {
      title: "Digital Marketing",
      items: [
        { label: "SEO", desc: "Search engine optimization", href: live("/seo-services") },
        { label: "PPC", desc: "Targeted ad marketing", href: live("/pay-per-click-management-services") },
      ],
    },
  ],
];

const TECHNOLOGY_COLUMNS: MegaGroup[][] = [
  [
    {
      title: "Backend",
      items: [
        { label: "NodeJS", desc: "Event-driven backends", href: live("/nodejs-development") },
        { label: ".NET", desc: "Enterprise Microsoft stack", href: live("/dot-net-development") },
        { label: "PHP", desc: "Web & CMS platforms", href: live("/php-web-development") },
        { label: "CodeIgniter", desc: "Lightweight PHP framework", href: live("/codeigniter-web-framework-development-services") },
        { label: "CakePHP", desc: "Convention-driven PHP", href: live("/cakephp-web-framework-development-services") },
        { label: "JavaScript", desc: "Server-side JS services", href: live("/javascript-development-services") },
        { label: "Python", desc: "AI & data science engine", href: live("/python-development") },
      ],
    },
  ],
  [
    {
      title: "Frontend",
      items: [
        { label: "ReactJS", desc: "Interactive web interfaces", href: live("/reactjs-development") },
        { label: "Angular", desc: "Enterprise web applications", href: live("/angularjs-development") },
        { label: "Full Stack", desc: "End-to-end product teams", href: live("/full-stack-development-services") },
        { label: "Mean Stack", desc: "Mongo, Express, Angular, Node", href: live("/mean-stack-development") },
        { label: "Mern Stack", desc: "Mongo, Express, React, Node", href: live("/mern-stack-development") },
      ],
    },
    {
      title: "Cloud & DevOps",
      items: [
        { label: "AWS", desc: "Amazon cloud infrastructure", href: live("/aws-development-services") },
        { label: "Azure", desc: "Microsoft cloud infrastructure", href: live("/azure-devops-services") },
      ],
    },
  ],
  [
    {
      title: "Mobile",
      items: [
        { label: "IOS", desc: "Native Apple applications", href: live("/ios-app-development") },
        { label: "React Native", desc: "Cross-platform mobile", href: live("/react-native-development") },
        { label: "Android", desc: "Native Google applications", href: live("/android-app-development") },
        { label: "Java", desc: "Enterprise Android & services", href: live("/java-development-services") },
        { label: "Hybrid", desc: "One build, every store", href: live("/hybrid-mobile-application-development-company") },
        { label: "Flutter", desc: "Pixel-perfect mobile UI", href: live("/flutter-app-development") },
        { label: "Ionic", desc: "Web tech in a native shell", href: live("/ionic-framework-development") },
      ],
    },
  ],
  [
    {
      title: "CMS",
      items: [
        { label: "WordPress", desc: "Popular CMS engine", href: live("/wordpress-development-services") },
        { label: "Drupal", desc: "Structured enterprise CMS", href: live("/drupal-development") },
        { label: "BigCommerce", desc: "Hosted commerce platform", href: live("/bigcommerce-development-services") },
      ],
    },
    {
      title: "Salesforce Development",
      items: [
        { label: "Consulting", desc: "CRM strategy & advisory", href: live("/salesforce-consulting") },
        { label: "Maintenance", desc: "Ongoing org support", href: live("/salesforce-maintenance") },
        { label: "Customization", desc: "Tailored objects & flows", href: live("/salesforce-customization") },
        { label: "Implementation", desc: "End-to-end CRM rollout", href: live("/salesforce-implementation") },
      ],
    },
  ],
];

const MEGA_ICONS = [IconRibbon, IconStar, IconTarget, IconSmileD, IconDiamond];

function MegaColumns({
  columns,
  onLinkClick,
  footer,
}: {
  columns: MegaGroup[][];
  onLinkClick: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <>
      {columns.map((groups, ci) => (
        <div className="mega-dropdown__col" key={ci}>
          {groups.map((group, gi) => {
            /* These were <h4>. The mega-dropdowns are always in the DOM —
               CSS hides them until hover — so their four labels were the
               first headings in the document, sitting above the hero's
               <h1> in source order and making the outline start at level 4.
               They are group labels for a list of links, not document
               structure, so they are now <p>. .mega-dropdown__title sets
               margin, font and display explicitly, so nothing moves.

               The grouping is not lost: each label now labels its own <ul>
               via aria-labelledby, which is how a navigation group is meant
               to be announced. */
            const titleId = `mega-${ci}-${gi}-title`;
            return (
            <React.Fragment key={group.title}>
              <p
                id={titleId}
                className={`mega-dropdown__title${group.hidden ? " mega-dropdown__title--hidden" : ""}`}
                aria-hidden={group.hidden || undefined}
                style={gi > 0 ? { marginTop: "16px" } : undefined}
              >
                {group.title}
              </p>
              <ul
                className="mega-dropdown__list"
                aria-labelledby={group.hidden ? undefined : titleId}
              >
                {group.items.map((item, ii) => {
                  const Icon = MEGA_ICONS[(ci * 3 + gi * 2 + ii) % MEGA_ICONS.length];
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="mega-dropdown__item"
                        onClick={onLinkClick}
                        {...crossSiteProps(item.href)}
                      >
                        <span className="mega-dropdown__item-icon">
                          <Icon />
                        </span>
                        <span className="mega-dropdown__item-text">
                          <span className="mega-dropdown__item-title">{item.label}</span>
                          <span className="mega-dropdown__item-desc">{item.desc}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
            );
          })}
          {ci === columns.length - 1 ? footer : null}
        </div>
      ))}
    </>
  );
}

/* The drawer mirrors what the desktop mega-dropdowns open on hover: below
   768px there is no hover, so the three parent items become accordions and
   list the same destinations.

   Contact Us is deliberately NOT in this table. On desktop it is not a nav
   link either — it is the filled button sitting after the list, and the
   drawer now carries that same button rather than a seventh grey row. */
type MobileSubGroup = {
  title: string;
  items: { label: string; href: string }[];
};

/* Columns to drawer groups. A hidden heading means "this column continues
   the one before it", which on a phone is simply more rows in the same
   group — so those items are appended rather than starting a new heading. */
function toDrawerGroups(columns: MegaGroup[][]): MobileSubGroup[] {
  const out: MobileSubGroup[] = [];
  for (const column of columns) {
    for (const group of column) {
      const items = group.items.map(({ label, href }) => ({ label, href }));
      const previous = out[out.length - 1];
      if (group.hidden && previous) previous.items.push(...items);
      else out.push({ title: group.title, items });
    }
  }
  return out;
}

type MobileMenuEntry = {
  key: string;
  label: string;
  href: string;
  groups?: MobileSubGroup[];
  cta?: { label: string; href: string };
};

const MOBILE_MENU: MobileMenuEntry[] = [
  {
    key: "who-we-are",
    label: "Who We Are",
    href: "#who-we-are",
    /* Same destinations as the desktop "Who We Are" panel further down —
       keep the two in step. #contact stays a fragment because the Contact
       section really is on this page; the rest had no matching id and now
       point at the live pages that exist for them. There is no separate
       "Our Team" page on the live site, so that item goes to /about-us,
       which is what actually describes the company and its people. */
    groups: [
      {
        title: "Company",
        items: [
          { label: "About Us", href: live("/about-us") },
          { label: "Our Team", href: live("/about-us") },
          { label: "Career", href: live("/career") },
          { label: "Contact Us", href: "#contact" },
        ],
      },
      {
        title: "Why Fulminous",
        items: [
          { label: "Client Reviews", href: live("/client-reviews") },
          { label: "Our Clients", href: live("/our-clients") },
          { label: "Our Partners", href: live("/our-partners") },
          { label: "Awards & Memberships", href: live("/fulminous-software-awards-recognition") },
        ],
      },
      {
        title: "Partner With Us",
        items: [
          { label: "Associate Partnership", href: live("/associate-partnership") },
          { label: "Strategic Partnership", href: live("/strategic-partnership") },
          { label: "Referral Partnership", href: live("/referral-partnership") },
        ],
      },
    ],
    cta: { label: "About Fulminous", href: live("/about-us") },
  },
  {
    key: "services",
    label: "Services",
    href: "#services",
    groups: toDrawerGroups(SERVICES_COLUMNS),
    cta: { label: "View More Services", href: live("/services") },
  },
  {
    key: "technology",
    label: "Technology",
    href: "#technology",
    groups: toDrawerGroups(TECHNOLOGY_COLUMNS),
    cta: { label: "All Technologies", href: live("/technologylist") },
  },
  /* Blogs and Portfolio are the two menu items with no dropdown. Their
     #blogs / #portfolio fragments do resolve to real sections on this page,
     which is what the drawer is for, so they stay as anchors. */
  { key: "blogs", label: "Blogs", href: "#blogs" },
  { key: "portfolio", label: "Portfolio", href: "#portfolio" },
];

export function Navbar() {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  /* Which second-level panel is showing, or null for the top-level list. The
     drawer drills rather than expands, so this is a location, not an
     open/closed flag — only one level is ever on screen. */
  const [drilledInto, setDrilledInto] = useState<string | null>(null);
  const ignoreScrollUntil = useRef<number>(0);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  /* True while the panel on screen was opened by a click rather than by hover.
     A hovered panel closes when the pointer leaves it; a clicked one is pinned
     and stays until it is dismissed on purpose — Escape, a click outside, a
     link, or a second click on the same parent. Without this, a tap opened the
     panel and then the pointer sitting anywhere but on it closed it again. */
  const pinnedRef = useRef(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const levelsRef = useRef<HTMLDivElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback((delay = 200) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, delay);
  }, [cancelClose]);

  const handleNavMouseEnter = (menuName: string) => {
    cancelClose();
    /* Hovering a different parent moves the panel, and the new one is a hover
       panel again — the pin belongs to the click, not to the menu. */
    if (menuName !== activeDropdown) pinnedRef.current = false;
    setActiveDropdown(menuName);
  };

  const handleNavMouseLeave = () => {
    if (pinnedRef.current) return;
    scheduleClose(200);
  };

  const handleDropdownMouseEnter = () => {
    cancelClose();
  };

  const handleDropdownMouseLeave = () => {
    if (pinnedRef.current) return;
    scheduleClose(200);
  };

  /* A click on "Services"/"Technology"/"Who We Are" used to do two things at
     once: open the panel and follow its own href to the section. The jump
     scrolled the page, and the scroll listener further down closes whatever
     panel is open — so the panel opened and shut itself, which is the whole of
     why it would not stay put. Tapping a parent is now a disclosure: it opens
     and pins the panel and does not navigate. The second click on the same
     parent is the one that goes to the section, so nothing is unreachable —
     and on desktop, where hover has already opened the panel by the time you
     press, the first click still navigates exactly as it did. */
  const handleTopNavClick = (e: React.MouseEvent, menuName: string) => {
    cancelClose();
    closeMenu();

    if (activeDropdown !== menuName) {
      e.preventDefault();
      pinnedRef.current = true;
      setActiveDropdown(menuName);
      return;
    }

    pinnedRef.current = false;
    ignoreScrollUntil.current = Date.now() + 1000;
    setActiveDropdown(null);
  };

  const handleNavKeyDown = (e: React.KeyboardEvent, menuName: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cancelClose();
      const opening = activeDropdown !== menuName;
      pinnedRef.current = opening;
      setActiveDropdown(opening ? menuName : null);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelClose();
      pinnedRef.current = false;
      setActiveDropdown(null);
    }
  };

  const handleLinkClick = () => {
    cancelClose();
    pinnedRef.current = false;
    setActiveDropdown(null);
    closeMenu();
  };

  /* Drill in. The whole business of pinning the tapped row against the layout
     shift of a collapsing accordion is gone with the accordion itself: only
     one level is on screen at a time, the incoming one starts at its own
     scroll origin, and nothing under the finger can move because nothing on
     the outgoing level is being resized. */
  const openLevel = (key: string) => {
    setDrilledInto(key);
    const level = levelsRef.current?.querySelector<HTMLElement>(
      `#mobile-submenu-${key}`
    );
    if (level) level.scrollTop = 0;
  };

  const backToRoot = () => {
    setDrilledInto(null);
    const root = levelsRef.current?.querySelector<HTMLElement>(
      ".mobile-drawer__level--root"
    );
    if (root) root.scrollTop = 0;
  };

  const updateDropdownPositions = () => {
    const navItems = document.querySelectorAll<HTMLElement>(".site-nav__item--has-dropdown");
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const margin = 16;

    navItems.forEach((item) => {
      const dropdown = item.querySelector<HTMLElement>(".mega-dropdown");
      if (!dropdown) return;

      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;

      const isWhoWeAre = dropdown.classList.contains("mega-dropdown--who-we-are");
      const isTech = dropdown.classList.contains("mega-dropdown--technology");
      // Keep in step with the width declared on each --modifier in the CSS.
      const targetMaxWidth = isWhoWeAre ? 840 : isTech ? 1120 : 1320;

      const dropdownWidth = Math.min(targetMaxWidth, vw - margin * 2);
      const idealLeft = itemCenter - dropdownWidth / 2;
      const minLeft = margin;
      const maxLeft = vw - dropdownWidth - margin;
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

      const parentLeft = itemRect.left;
      const relativeDropdownLeft = clampedLeft - parentLeft;
      const pointerOffset = itemCenter - clampedLeft;

      dropdown.style.setProperty("--dropdown-width", `${dropdownWidth}px`);
      dropdown.style.setProperty("--dropdown-left", `${relativeDropdownLeft}px`);
      dropdown.style.setProperty("--pointer-left", `${pointerOffset}px`);
    });
  };

  /* Below 1024px the panel is capped to the screen and scrolls inside itself,
     so one left halfway down reopens showing its middle — the headings above
     the fold gone and the first rows cut off at the top edge. Every open starts
     at the top of the panel. */
  useEffect(() => {
    if (!activeDropdown) return;
    const panel = navRef.current?.querySelector<HTMLElement>(
      ".site-nav__item--has-dropdown.is-open .mega-dropdown"
    );
    if (panel) panel.scrollTop = 0;
  }, [activeDropdown]);

  /* Reopening should land on the top-level list, not on whatever you drilled
     into last time. */
  useEffect(() => {
    if (isOpen) return;
    setDrilledInto(null);
    const root = levelsRef.current?.querySelector<HTMLElement>(
      ".mobile-drawer__level--root"
    );
    if (root) root.scrollTop = 0;
  }, [isOpen]);

  /* Backspace-style: Escape from a sub-level goes back a step rather than
     closing outright. useMobileMenu's own Escape handler closes the drawer,
     so this one stops the event reaching it while there is a level to pop. */
  useEffect(() => {
    if (!isOpen || !drilledInto) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      backToRoot();
    };
    window.addEventListener("keydown", onEscape, true);
    return () => window.removeEventListener("keydown", onEscape, true);
  }, [isOpen, drilledInto]);

  /* The panel is a modal, so it holds focus while it is open and hands it
     back on the way out. The toggle is deliberately part of the loop: it is
     the X now, so a keyboard user has to be able to tab to it — it just lives
     in the header rather than inside the panel. */
  useEffect(() => {
    if (!isOpen) return;
    const overlay = navRef.current;
    if (!overlay) return;

    const opener = document.activeElement as HTMLElement | null;
    overlay
      .querySelector<HTMLElement>(".mobile-drawer__row")
      ?.focus({ preventScroll: true });

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = [
        toggleRef.current,
        ...Array.from(
          overlay.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
        ).filter(
          /* Only the level on screen is reachable — the others are
             visibility:hidden and must not be counted as a tab stop. */
          (el) => {
            const level = el.closest(".mobile-drawer__level");
            if (!level) return true;
            return level.classList.contains("mobile-drawer__level--root")
              ? !drilledInto
              : level.classList.contains("is-active");
          }
        ),
      ].filter(Boolean) as HTMLElement[];
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === document.body)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen, drilledInto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        pinnedRef.current = false;
        setActiveDropdown(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const header = document.querySelector(".site-header");
      if (header && !header.contains(event.target as Node)) {
        cancelClose();
        pinnedRef.current = false;
        setActiveDropdown(null);
      }
    };

    const handleScroll = () => {
      if (Date.now() < ignoreScrollUntil.current) {
        return;
      }
      cancelClose();
      pinnedRef.current = false;
      setActiveDropdown(null);
    };

    const handlePosUpdate = () => {
      updateDropdownPositions();
    };

    handlePosUpdate();
    window.addEventListener("resize", handlePosUpdate, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handlePosUpdate);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeDropdown, cancelClose]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Was href="#", which changes the URL fragment and scrolls nowhere.
            The homepage is a real destination and is what a logo should link
            to — it is also the link crawlers use to confirm the site root. */}
        <a className="site-header__logo" href="/" aria-label="Fulminous Software home">
          <img
            src="/assets/Fulminous-Logo.webp"
            alt="Fulminous Software logo"
            width={177}
            height={46}
          />
        </a>

        {/* Sits in the header, above the panel, and stays visible and live the
            whole time the menu is open — so the three lines you pressed are
            the X you press to leave. There is no second close button. */}
        <button
          ref={toggleRef}
          className="site-header__toggle"
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          onClick={toggleMenu}
        >
          <span className="hamburger__line" />
          <span className="hamburger__line" />
          <span className="hamburger__line" />
        </button>

        <nav
          ref={navRef}
          className={`site-nav ${isOpen ? "is-open" : ""}`}
          id="primary-nav"
          aria-label="Primary"
        >
          {/* Mobile Navigation Drawer (renders on mobile <1024px) */}
          <div
            className="mobile-drawer__content"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div
              ref={levelsRef}
              className={`mobile-drawer__levels ${drilledInto ? "is-drilled" : ""}`}
            >
              {/* ---- Level 1 ---- */}
              <div className="mobile-drawer__level mobile-drawer__level--root">
                <ul className="mobile-drawer__list">
                  {MOBILE_MENU.map((entry) =>
                    entry.groups ? (
                      <li key={entry.key}>
                        <button
                          type="button"
                          className="mobile-drawer__row"
                          aria-haspopup="true"
                          aria-expanded={drilledInto === entry.key}
                          aria-controls={`mobile-submenu-${entry.key}`}
                          onClick={() => openLevel(entry.key)}
                        >
                          <span className="mobile-drawer__row-label">{entry.label}</span>
                          <span className="mobile-drawer__row-arrow">
                            <IconArrowRight />
                          </span>
                        </button>
                      </li>
                    ) : (
                      /* Blogs and Portfolio have no dropdown on desktop
                         either, so they go straight somewhere — and carry no
                         arrow, because nothing is going to slide in. */
                      <li key={entry.key}>
                        <a
                          className="mobile-drawer__row"
                          href={entry.href}
                          onClick={handleLinkClick}
                        >
                          <span className="mobile-drawer__row-label">{entry.label}</span>
                        </a>
                      </li>
                    )
                  )}
                </ul>

                {/* No footer. The copyright and the three social discs were
                    the last thing in the panel and the least useful — they
                    put a second, quieter cluster of links directly above the
                    one action this menu is actually for. The pinned Contact
                    Us button closes the panel on its own. */}
              </div>

              {/* ---- Level 2, one per parent ---- */}
              {MOBILE_MENU.filter((entry) => entry.groups).map((entry) => (
                <div
                  key={entry.key}
                  id={`mobile-submenu-${entry.key}`}
                  className={`mobile-drawer__level mobile-drawer__level--sub ${
                    drilledInto === entry.key ? "is-active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="mobile-drawer__back"
                    onClick={backToRoot}
                  >
                    <IconArrowLeft />
                    <span>{entry.label}</span>
                  </button>

                  <div className="mobile-drawer__sub-scroll">
                    {entry.groups!.map((group) => (
                      <div className="mobile-drawer__subgroup" key={group.title}>
                        <p className="mobile-drawer__subgroup-title">{group.title}</p>
                        <ul className="mobile-drawer__sublist">
                          {/* Keyed on the label, not the href: "About Us" and
                              "Our Team" both resolve to /about-us now, and two
                              siblings cannot share a key. */}
                          {group.items.map((item) => (
                            <li key={item.label}>
                              <a
                                className="mobile-drawer__sublink"
                                href={item.href}
                                onClick={handleLinkClick}
                                {...crossSiteProps(item.href)}
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {entry.cta && (
                      /* Same class and same arrow glyph the desktop
                         mega-dropdown uses for "View More Services", so the
                         button is the shared one, not a look-alike that can
                         drift from it. */
                      <a
                        className="btn--outline-primary mobile-drawer__subcta"
                        href={entry.cta.href}
                        onClick={handleLinkClick}
                        {...crossSiteProps(entry.cta.href)}
                      >
                        {entry.cta.label} &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pinned under both levels: the header's own Contact Us button,
                same classes, reachable without scrolling to find it. */}
            <div className="mobile-drawer__actions">
              <a
                className="btn btn--primary mobile-drawer__contact-cta"
                href="#contact"
                onClick={handleLinkClick}
              >
                Contact Us
              </a>
            </div>
          </div>

          <ul className="site-nav__list desktop-only-nav">
            {/* WHO WE ARE */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "who-we-are" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("who-we-are")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#who-we-are"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "who-we-are"}
                onClick={(e) => handleTopNavClick(e, "who-we-are")}
                onKeyDown={(e) => handleNavKeyDown(e, "who-we-are")}
              >
                Who We Are <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--who-we-are"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  {/* Col 1: Company */}
                  <div className="mega-dropdown__col">
                    {/* <h4> before: a nav group label, not document
                        structure, and it sat above the hero's <h1> in source
                        order. See the note in MegaColumns above — the same
                        change, hand-written here because this panel is not
                        driven by the shared table. */}
                    <p id="mega-who-company" className="mega-dropdown__title">Company</p>
                    <ul className="mega-dropdown__list" aria-labelledby="mega-who-company">
                      <li>
                        <a href={live("/about-us")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">About Us</span>
                            <span className="mega-dropdown__item-desc">Get creative inspiration</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        {/* The live site has no separate team page; /about-us
                            is where the company and its people are described. */}
                        <a href={live("/about-us")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Team</span>
                            <span className="mega-dropdown__item-desc">Stunning web design</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/career")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Career</span>
                            <span className="mega-dropdown__item-desc">Join our global team</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#contact" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Contact Us</span>
                            <span className="mega-dropdown__item-desc">Artistic visual expression</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Why Fulminous */}
                  <div className="mega-dropdown__col">
                    <p id="mega-who-why" className="mega-dropdown__title">Why Fulminous</p>
                    <ul className="mega-dropdown__list" aria-labelledby="mega-who-why">
                      <li>
                        <a href={live("/client-reviews")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Client Reviews</span>
                            <span className="mega-dropdown__item-desc">Impactful storytelling</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/our-clients")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Clients</span>
                            <span className="mega-dropdown__item-desc">Functional digital products</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/our-partners")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Partners</span>
                            <span className="mega-dropdown__item-desc">Beautiful crafted prints</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/fulminous-software-awards-recognition")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Awards &amp; Memberships</span>
                            <span className="mega-dropdown__item-desc">Recognized industry leader</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Partner With Us */}
                  <div className="mega-dropdown__col">
                    <p id="mega-who-partner" className="mega-dropdown__title">Partner With Us</p>
                    <ul className="mega-dropdown__list" aria-labelledby="mega-who-partner">
                      <li>
                        <a href={live("/associate-partnership")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Associate Partnership</span>
                            <span className="mega-dropdown__item-desc">Collaborative growth</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/strategic-partnership")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Strategic Partnership</span>
                            <span className="mega-dropdown__item-desc">Long-term synergy</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href={live("/referral-partnership")} target="_blank" rel="noopener noreferrer" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Referral Partnership</span>
                            <span className="mega-dropdown__item-desc">Earn referral rewards</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* SERVICES */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "services" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("services")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#services"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "services"}
                onClick={(e) => handleTopNavClick(e, "services")}
                onKeyDown={(e) => handleNavKeyDown(e, "services")}
              >
                Services <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--services"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  <MegaColumns
                    columns={SERVICES_COLUMNS}
                    onLinkClick={handleLinkClick}
                    footer={
                      <a
                        className="btn--outline-primary mega-dropdown__btn"
                        href={live("/services")}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        style={{ marginTop: "16px", display: "inline-block" }}
                      >
                        View More Services &rarr;
                      </a>
                    }
                  />
                </div>
              </div>
            </li>

            {/* TECHNOLOGY */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "technology" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("technology")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#technology"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "technology"}
                onClick={(e) => handleTopNavClick(e, "technology")}
                onKeyDown={(e) => handleNavKeyDown(e, "technology")}
              >
                Technology <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--technology"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  <MegaColumns columns={TECHNOLOGY_COLUMNS} onLinkClick={handleLinkClick} />
                </div>
              </div>
            </li>

            <li className="site-nav__item">
              <a className="site-nav__link" href="#blogs" onClick={handleLinkClick}>
                Blogs
              </a>
            </li>
            <li className="site-nav__item">
              <a className="site-nav__link" href="#portfolio" onClick={handleLinkClick}>
                Portfolio
              </a>
            </li>
          </ul>

          <a
            className="btn btn--primary site-nav__cta desktop-only-nav"
            href="#contact"
            onClick={handleLinkClick}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
}
