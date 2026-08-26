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

/* The Expertise Across Domains artwork, keyed by the exact title each row
   renders. Supplied as Illustrator SVGs and converted here to presentation
   attributes: a <style> block inside inline SVG is document-scoped, so forty
   icons each declaring .st0 would have fought each other and whichever
   painted last would have won. Attribute names are hyphenated because this
   is injected as raw HTML, where strokeWidth silently becomes strokewidth.

   Both views read from this one table — the desktop panel and the phone
   accordion — which is why it is keyed by title rather than by file: the two
   used to pull from different sets and disagreed about what, say, IoT
   Solutions looks like. */
/* Which sprite symbol each row draws.
   The artwork itself lives in components/DomainIconSprite.tsx, which has no
   "use client" and is rendered from app/page.tsx — so the paths are written
   into the HTML and never shipped as JavaScript. This file only needs to know
   the names. */
const DOMAIN_ICON_ID: Record<string, string> = {
  "AI & ML": "dm-ai-and-ml",
  "Generative AI Development": "dm-generative-ai-development",
  "Chatbot & Virtual Assistant Development": "dm-chatbot-and-virtual-assistant-development",
  "IoT Solutions": "dm-iot-solutions",
  "Blockchain Development Business Intelligence": "dm-blockchain-development-business-intelligence",
  "AR/VR Application Development": "dm-ar-vr-application-development",
  "Automation & Workflow Solutions": "dm-automation-and-workflow-solutions",
  "Node.js Development Services": "dm-node-js-development-services",
  "Dot NET Development Services": "dm-dot-net-development-services",
  "PHP Web Development": "dm-php-web-development",
  "CodeIgniter Framework": "dm-codeigniter-framework",
  "CakePHP Web Development": "dm-cakephp-web-development",
  "JavaScript Development Solutions": "dm-javascript-development-solutions",
  "Python Development Services": "dm-python-development-services",
  "Angular Development Solutions": "dm-angular-development-solutions",
  "Full-Stack Development Services": "dm-full-stack-development-services",
  "MEAN Stack Development": "dm-mean-stack-development",
  "MERN Stack Development": "dm-mern-stack-development",
  "Custom Frontend Solutions": "dm-custom-frontend-solutions",
  "iOS Application Development": "dm-ios-application-development",
  "React Native Development": "dm-react-native-development",
  "Android Application Development": "dm-android-application-development",
  "Java Development Services": "dm-java-development-services",
  "Hybrid Framework": "dm-hybrid-framework",
  "Flutter Application Development": "dm-flutter-application-development",
  "Ionic Framework Development": "dm-ionic-framework-development",
  "WordPress Development Services": "dm-wordpress-development-services",
  "Drupal Development Services": "dm-drupal-development-services",
  "Woocommerce Development Services": "dm-woocommerce-development-services",
  "Sanity CMS Development": "dm-sanity-cms-development",
  "Strapi Development": "dm-strapi-development",
  "Platform Implementation": "dm-platform-implementation",
  "Cloud Computing Services": "dm-cloud-computing-services",
  "AWS Development Services": "dm-aws-development-services",
  "Azure DevOps Services": "dm-azure-devops-services",
  "Cloud Migration Services": "dm-cloud-migration-services",
  "Infrastructure Management": "dm-infrastructure-management",
  "DevOps Automation": "dm-devops-automation",
  "Cloud Security Solutions": "dm-cloud-security-solutions",
};

/* Rows that name the same technology as a row in another tab. The artwork
   arrived named for one of the two, so rather than a second copy of the same
   file under a second name, the second name points at the first. */
const DOMAIN_ICON_ALIAS: Record<string, string> = {
  "IoT Development Services": "IoT Solutions",
  "React.js Development Services": "React Native Development",
};

/* The sprite is a file rather than markup in the response.
   Inlining the 39 symbols moved 50KB out of the page chunk and put 49.6KB back
   into the HTML, which is the worse place for it — the document is parsed
   before the first paint and the script is not. As a file it is in neither,
   fetched once and cached on its own terms, and .domains carries
   content-visibility: auto so the request does not happen until the section
   comes near the viewport.

   ?v=1 because the filename is not content-hashed and /assets is served with
   a month of stale-while-revalidate; changing an icon means changing this. */
const SPRITE = "/assets/icons/domains-sprite.svg?v=1";

function useSymbol(id: string): string {
  return (
    '<svg aria-hidden="true" focusable="false"><use href="' + SPRITE + '#' + id + '"></use></svg>'
  );
}

function getTechIconSvg(title: string): string {
  const exact = DOMAIN_ICON_ID[title];
  if (exact) return useSymbol(exact);

  const alias = DOMAIN_ICON_ALIAS[title];
  if (alias && DOMAIN_ICON_ID[alias]) return useSymbol(DOMAIN_ICON_ID[alias]);

  /* Nothing supplied for this row yet — fall back to a neutral mark rather
     than rendering an empty box. */
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="#164a9e" stroke-width="1.8"/><path d="M8.5 12h7M12 8.5v7" stroke="#164a9e" stroke-width="1.8" stroke-linecap="round"/></svg>`;
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


    /* The fade belongs to a tab switch. On the first render there is nothing
       to fade from, and `animation-fill-mode: both` would hold the panel at
       opacity 0 until the animation started — which is what axe caught
       mid-fade and scored as a 1.39:1 contrast failure once
       content-visibility moved that start later. */
    let firstRender = true;

    function item(sk: { iconImg?: string; title: string; desc: string }, delay: number) {
      const iconMarkup = `<div class="feature-item__raw-icon">${getTechIconSvg(sk.title)}</div>`;

      const anim = firstRender ? '' : ' domains-anim';
      return (
        '<article class="feature-item' + anim + '" style="animation-delay:' +
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
      const anim = firstRender ? '' : ' domains-anim';
      content.innerHTML =
        '<div class="domains__content-head">' +
        '<h3 class="domains__content-title' + anim + '">' +
        esc(d.label) +
        "</h3>" +
        '<p class="domains__content-sub' + anim + '" style="animation-delay:60ms">' +
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
      firstRender = false;
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
                <Image className="domain-tab__icon" src="/assets/icons/Emerging Technologies & AI.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Emerging Technologies &amp; AI</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Backend Development.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Backend Development</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Frontend Development.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Frontend Development</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Mobile Technologies.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">Mobile Technologies</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/CMS & Ecommerce.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              </span>
              <span className="domain-tab__label">CMS &amp; Ecommerce</span>
            </button>
            <button className="domain-tab" type="button" role="tab" aria-selected="false">
              <span className="domain-tab__icon-box">
                <Image className="domain-tab__icon" src="/assets/icons/Cloud Platforms.svg" alt="" width={24} height={24} unoptimized style={{ width: "24px", height: "24px", objectFit: "contain" }} />
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
