"use client";

import React, { useEffect, useRef } from "react";
import { isExternalHref, live } from "@/lib/site-config";

/* Every href below used to be a /services/<slug> path. None of those routes
   exist in this app — app/ is layout.tsx + page.tsx — so all sixty were
   crawlable links into a 404, and they 404 on the live site too. They now
   point at the real page the live site publishes for that service; each URL
   was checked to return HTTP 200. Where the live site has no separate page
   for a sub-service, the link goes to the closest real page rather than
   inventing a URL, so several labels legitimately share a destination.

   Replace live("/x") with a local path as each service page ships here. */
const SLIDES_DATA = [
  {
    name: "Game Development Services",
    iconImg: "/assets/icons/Game Developemnt Services.svg",
    desc: "Top game development experts deliver amazing gaming experiences with innovative game apps and software :",
    links: [
      { href: live("/betting-app-development"), label: "Betting App Development" },
      { href: live("/color-game-development"), label: "Color Game Development" },
      { href: live("/ludo-game-app-development-company"), label: "Ludo Game Development" },
      { href: live("/rummy-game-development-company"), label: "Rummy Game Development" },
      { href: live("/bingo-game-development-company"), label: "Bingo Game Development" },
      { href: live("/poker-game-development-company"), label: "Poker Game Development" },
    ],
    imgSrc: "/assets/Game-Development-Banner.webp",
    imgAlt: "Game Development Services illustration",
  },
  {
    name: "Dedicated Teams & Staff Augmentation",
    iconImg: "/assets/icons/Software Development.svg",
    desc: "Fulminous Software helps you to access the services of dedicated teams and staff augmentation for affordable development :",
    links: [
      { href: live("/outsourcing-services"), label: "Dedicated Development Teams" },
      { href: live("/outsourcing-services"), label: "IT Staff Augmentation" },
      { href: live("/outsource-software-development-company"), label: "Remote Development Teams" },
      { href: live("/outsource-software-development-company"), label: "Project-Based Hiring" },
      { href: live("/software-development-consulting-company"), label: "Technical Consulting" },
      { href: live("/software-consulting-development-services"), label: "Managed Development Services" },
    ],
    imgSrc: "/assets/Software-Development-Banner.webp",
    imgAlt: "Dedicated Teams & Staff Augmentation illustration",
  },
  {
    name: "Quality Assurance",
    iconImg: "/assets/icons/Quality Assurance.svg",
    desc: "We evaluate the performance of software solutions in all aspects and provide support for enhancement :",
    links: [
      /* The live site publishes one QA page, not six. All six labels point
         at it rather than at five fabricated slugs. */
      { href: live("/software-testing-services"), label: "Manual Testing" },
      { href: live("/software-testing-services"), label: "Automated Testing" },
      { href: live("/software-testing-services"), label: "Performance Testing" },
      { href: live("/software-testing-services"), label: "Security Testing" },
      { href: live("/software-testing-services"), label: "Mobile App Testing" },
      { href: live("/software-testing-services"), label: "QA Consulting" },
    ],
    imgSrc: "/assets/Quality-Assurance-IMG.webp",
    imgAlt: "Quality Assurance illustration",
  },
  {
    name: "E-commerce Solutions",
    iconImg: "/assets/icons/E-commerce Solutions.svg",
    desc: "Now, develop custom e-commerce platforms with the assistance of our experts in various e-commerce platforms :",
    links: [
      { href: live("/ecommerce-development-services"), label: "E-commerce Website" },
      { href: live("/ecommerce-software-development"), label: "Marketplace Development" },
      { href: live("/b2b-ecommerce-development-agency"), label: "B2B Commerce Solutions" },
      { href: live("/ecommerce-development-services"), label: "Shopping Cart Integration" },
      { href: live("/ecommerce-software-development"), label: "Payment Gateway Integration" },
      { href: live("/it-infrastructure-support-services"), label: "Maintenance & Support" },
    ],
    imgSrc: "/assets/E-commerce-Solutions-IMG.webp",
    imgAlt: "E-commerce Solutions illustration",
  },
  {
    name: "Cloud & DevOps",
    iconImg: "/assets/icons/Cloud & DevOps.svg",
    desc: "Fulminous Software offers complete cloud development solutions, bringing you maximum accessibility :",
    links: [
      { href: live("/legacy-to-cloud-modernization-services"), label: "Cloud Migration" },
      { href: live("/it-infrastructure-support-services"), label: "Cloud Infrastructure Management" },
      { href: live("/azure-devops-services"), label: "DevOps Consulting" },
      { href: live("/azure-devops-services"), label: "CI/CD Implementation" },
      { href: live("/cloud-computing-development-services"), label: "Containerization & Orchestration" },
      { href: live("/it-infrastructure-support-services"), label: "Performance Monitoring" },
    ],
    imgSrc: "/assets/Cloud-&-DevOps-IMG.webp",
    imgAlt: "Cloud & DevOps illustration",
  },
  {
    name: "AI Development",
    iconImg: "/assets/icons/AI Development.svg",
    desc: "Fulminous Software develops the latest AI solutions for all your business needs :",
    links: [
      { href: live("/enterprise-ai-development-company"), label: "AI Development Services" },
      { href: live("/generative-ai-development-services"), label: "Generative AI Development" },
      { href: live("/ai-chatbot-development-services"), label: "AI Chatbot Development" },
      { href: live("/ai-powered-app-development-company"), label: "AI-Powered App Development" },
      { href: live("/ai-agent-development-company"), label: "AI Agent Development" },
      { href: live("/ai-consulting-services"), label: "AI Consulting Services" },
    ],
    imgSrc: "/assets/AI-Develoment.webp",
    imgAlt: "AI Development illustration",
  },
  {
    name: "Mobile App Development",
    iconImg: "/assets/icons/Mobile App Development.svg",
    desc: "We develop custom mobile apps with trending features and engaging designs :",
    links: [
      { href: live("/mobile-application-development"), label: "Mobile App Development" },
      { href: live("/ios-app-development"), label: "iOS App Development" },
      { href: live("/android-app-development"), label: "Android App Development" },
      { href: live("/dating-app-development-tinder-like-app"), label: "Dating App Development" },
      { href: live("/cross-platform-application-development-services"), label: "Cross-Platform App Development" },
      { href: live("/wearable-app-development-services"), label: "Wearable App Development" },
    ],
    imgSrc: "/assets/Mobile-App-Development-IMG.webp",
    imgAlt: "Mobile App Development illustration",
  },
  {
    name: "Web Development",
    iconImg: "/assets/icons/Web Development .svg",
    desc: "Now get responsive and feature-rich website solutions for your businesses :",
    links: [
      { href: live("/web-application-development-company"), label: "Web Application Development" },
      { href: live("/ecommerce-development-services"), label: "E-commerce Development" },
      { href: live("/wordpress-development-services"), label: "Wordpress Development" },
      { href: live("/php-web-development"), label: "PHP Web Development" },
      { href: live("/website-development-services"), label: "Custom Web Development" },
      { href: live("/progressive-web-apps-development-services"), label: "Progressive Web Apps (PWA)" },
    ],
    imgSrc: "/assets/Web-Development-IMG.webp",
    imgAlt: "Web Development illustration",
  },
  {
    name: "UI/UX Design",
    iconImg: "/assets/icons/ui-ux design.svg",
    desc: "We design highly engaging and attractive UI UX for your digital platforms :",
    links: [
      { href: live("/ui-ux-design-services"), label: "UI UX Design" },
      { href: live("/web-design-company"), label: "Web Design Services" },
      { href: live("/website-design-for-startups"), label: "Startup Website Design" },
      { href: live("/hire-mvp-designers"), label: "Hire MVP Designers" },
      { href: live("/mobile-app-ui-ux-design-services"), label: "Mobile App Design" },
      { href: live("/best-manufacturing-website-design-company"), label: "Manufacturing Web Design" },
    ],
    imgSrc: "/assets/UI-UX-Design.webp",
    imgAlt: "UI/UX Design illustration",
  },
  {
    name: "Software Development",
    iconImg: "/assets/Software-Development-Services.png",
    desc: "We develop all types of software solutions that can grow your business :",
    links: [
      { href: live("/custom-healthcare-software-development"), label: "Custom Health Software" },
      { href: live("/legacy-software-modernization-services"), label: "Legacy Software Modernization" },
      { href: live("/it-infrastructure-support-services"), label: "Software Maintenance & Support" },
      { href: live("/software-consulting-development-services"), label: "Consulting Services" },
      { href: live("/software-development"), label: "Enterprise Software Solutions" },
      { href: live("/top-saas-application-development-company"), label: "SaaS Product Development" },
    ],
    imgSrc: "/assets/Software-Development-Banner.webp",
    imgAlt: "Software Development illustration",
  },
];

/* Those destinations live on the content site today, so they open in a new tab
   the way the Footer's cross-site links already do — the visitor keeps the
   homepage and the carousel they were part-way through. Derived from the href
   rather than hard-coded, so a link that becomes a local path here
   automatically stops opening a tab. */
const crossSiteProps = (href: string) =>
  isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function Showcase() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const source = root.querySelector<HTMLElement>(".showcase__source");
    const slides = source
      ? Array.from(source.querySelectorAll<HTMLElement>(".showcase__slide"))
      : [];
    if (!slides.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = slides.length;
    const track = root.querySelector<HTMLElement>(".showcase__track");
    const card = root.querySelector<HTMLElement>(".showcase__card");
    const frame = root.querySelector<HTMLElement>(".showcase__frame");
    const carousel = root.querySelector<HTMLElement>(".showcase__carousel") || frame;
    const stage = root.querySelector<HTMLElement>(".showcase__stage");
    const dotsWrap = root.querySelector<HTMLElement>(".showcase__dots");
    const peekPrev = root.querySelector<HTMLElement>(".showcase__peek--prev");
    const peekNext = root.querySelector<HTMLElement>(".showcase__peek--next");
    const btnPrev = root.querySelector<HTMLElement>(".showcase__nav--prev");
    const btnNext = root.querySelector<HTMLElement>(".showcase__nav--next");

    if (!track || !dotsWrap || !stage || !carousel) return;

    let active = 0;
    let busy = false;
    let timer: NodeJS.Timeout | null = null;
    let pauseTimer: NodeJS.Timeout | null = null;
    const AUTOPLAY_INTERVAL = 3000;
    const INTERACTION_PAUSE = 15000;
    const DUR = 350;
    const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

    root.classList.add("is-enhanced");
    root.classList.remove("is-init");

    dotsWrap.innerHTML = "";
    const dots: HTMLButtonElement[] = [];

    function startAutoScroll() {
      stopAutoScroll();
      timer = setInterval(() => {
        goTo((active + 1) % n, "next");
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoScroll() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function handleUserInteraction(targetIndex?: number, dir?: "next" | "prev") {
      if (pauseTimer) {
        clearTimeout(pauseTimer);
        pauseTimer = null;
      }
      stopAutoScroll();

      if (typeof targetIndex === "number") {
        goTo(targetIndex, dir);
      }

      pauseTimer = setTimeout(() => {
        startAutoScroll();
      }, INTERACTION_PAUSE);
    }

    for (let i = 0; i < n; i++) {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "showcase__dot";
      d.setAttribute("role", "tab");
      d.setAttribute(
        "aria-label",
        slides[i].getAttribute("data-name") || `Service ${i + 1}`
      );
      d.addEventListener("click", () => handleUserInteraction(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    }

    function makePanel(i: number) {
      const t = document.createElement("div");
      t.innerHTML = slides[i].innerHTML;
      return t.firstElementChild as HTMLElement;
    }

    // Measured once per width: the natural height of the tallest slide. The
    // mobile card is pinned to it so advancing the carousel never resizes the
    // frame. Reset to 0 to force a re-measure.
    let lockedMobileHeight = 0;

    function measureTallestSlide() {
      if (!card || !frame) return 0;

      /* Measure in hidden clones of the card at the real card width, so every
         slide is laid out under the same CSS as the live one.
         One probe per slide, all appended before anything is read. This used to
         reuse a single probe — write a panel in, read its height, write the
         next — which forces the browser to flush layout once per slide, eleven
         synchronous reflows during hydration on a phone. Each probe is
         absolutely positioned, so they cannot affect each other's box, and the
         heights come out identical to the one-at-a-time version. */
      const probes: { el: HTMLElement; track: HTMLElement }[] = [];
      const width = card.clientWidth + "px";

      for (let i = 0; i < n; i++) {
        const panel = makePanel(i);
        if (!panel) continue;
        const probe = document.createElement("div");
        probe.className = "showcase__card";
        probe.style.cssText =
          "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;z-index:-1;";
        probe.style.width = width;
        const probeTrack = document.createElement("div");
        probeTrack.className = "showcase__track";
        probeTrack.appendChild(panel);
        probe.appendChild(probeTrack);
        frame.appendChild(probe);
        probes.push({ el: probe, track: probeTrack });
      }

      // Reads only from here on: the first one flushes layout, the rest are free.
      let tallest = 0;
      for (const p of probes) tallest = Math.max(tallest, p.track.getBoundingClientRect().height);
      for (const p of probes) p.el.remove();

      return Math.ceil(tallest);
    }

    function setCardHeight(panel: HTMLElement | null, instant?: boolean) {
      if (!card) return;
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        if (!lockedMobileHeight) lockedMobileHeight = measureTallestSlide();
        if (lockedMobileHeight) {
          // The stylesheet pins mobile height with !important, so match it.
          card.style.setProperty("height", lockedMobileHeight + "px", "important");
        } else {
          card.style.height = "auto";
        }
        return;
      }
      card.style.removeProperty("height");
      card.style.height = "480px";
    }

    function sideContent(i: number) {
      const t = slides[i].querySelector(".showcase__col--text");
      return t ? t.outerHTML : "";
    }

    function renderSides() {
      const p = (active - 1 + n) % n;
      const nx = (active + 1) % n;
      if (peekPrev) peekPrev.innerHTML = sideContent(p);
      if (peekNext) peekNext.innerHTML = sideContent(nx);
    }

    function updateDots() {
      for (let k = 0; k < dots.length; k++) {
        const on = k === active;
        dots[k].classList.toggle("is-active", on);
        dots[k].setAttribute("aria-selected", on ? "true" : "false");
      }
    }

    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    track.innerHTML = "";
    const initialPanel = makePanel(active);
    track.appendChild(initialPanel);
    setCardHeight(initialPanel, true);
    renderSides();
    updateDots();

    function goTo(target: number, dir?: "next" | "prev") {
      target = ((target % n) + n) % n;
      if (target === active || busy) return;
      if (typeof dir === "undefined") {
        const fwd = (target - active + n) % n;
        const bwd = (active - target + n) % n;
        dir = fwd <= bwd ? "next" : "prev";
      }
      if (reduce) {
        track!.innerHTML = "";
        const p = makePanel(target);
        track!.appendChild(p);
        setCardHeight(p, true);
        active = target;
        renderSides();
        updateDots();
        return;
      }

      busy = true;
      const oldPanel = track!.firstElementChild as HTMLElement;
      const newPanel = makePanel(target);
      const trans = "transform " + DUR + "ms " + EASE;
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const initialScale = isMobile ? "scale(1)" : "scale(0.94)";

      if (dir === "next") {
        track!.appendChild(newPanel);
        newPanel.style.transform = initialScale;
        if (oldPanel && !isMobile) oldPanel.style.transform = "scale(1)";
        track!.style.transition = "none";
        track!.style.transform = "translateX(0)";
        void track!.offsetWidth;
        track!.style.transition = trans;
        track!.style.transform = "translateX(-100%)";
      } else {
        if (oldPanel) track!.insertBefore(newPanel, oldPanel);
        else track!.appendChild(newPanel);
        newPanel.style.transform = initialScale;
        if (oldPanel && !isMobile) oldPanel.style.transform = "scale(1)";
        track!.style.transition = "none";
        track!.style.transform = "translateX(-100%)";
        void track!.offsetWidth;
        track!.style.transition = trans;
        track!.style.transform = "translateX(0)";
      }
      if (oldPanel && !isMobile) {
        oldPanel.style.transition = trans;
        oldPanel.style.transform = "scale(0.94)";
      }
      if (!isMobile) {
        newPanel.style.transition = trans;
        newPanel.style.transform = "scale(1)";
      } else {
        newPanel.style.transform = "scale(1)";
      }

      setCardHeight(newPanel, false);
      active = target;
      renderSides();
      updateDots();

      setTimeout(() => {
        if (!track) return;
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        if (oldPanel && oldPanel.parentNode) {
          oldPanel.parentNode.removeChild(oldPanel);
        }
        newPanel.style.transition = "";
        newPanel.style.transform = "";
        busy = false;
      }, DUR + 30);
    }

    const onNextClick = () => handleUserInteraction((active + 1) % n, "next");
    const onPrevClick = () => handleUserInteraction((active - 1 + n) % n, "prev");

    if (btnNext) btnNext.addEventListener("click", onNextClick);
    if (btnPrev) btnPrev.addEventListener("click", onPrevClick);
    if (peekNext) peekNext.addEventListener("click", onNextClick);
    if (peekPrev) peekPrev.addEventListener("click", onPrevClick);

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAutoScroll();
      } else if (!pauseTimer) {
        startAutoScroll();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const viewportObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!pauseTimer && !timer) {
            startAutoScroll();
          }
        } else {
          stopAutoScroll();
        }
      },
      { threshold: 0.2 }
    );
    viewportObserver.observe(stage);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevClick();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNextClick();
      }
    };
    stage.addEventListener("keydown", onKeyDown);

    let sx = 0;
    let sy = 0;
    let tracking = false;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      tracking = true;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          onNextClick();
        } else {
          onPrevClick();
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      sx = e.clientX;
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 40) {
        if (dx < 0) {
          onNextClick();
        } else {
          onPrevClick();
        }
      }
    };

    carousel.addEventListener("touchstart", onTouchStart, { passive: true });
    carousel.addEventListener("touchend", onTouchEnd, { passive: true });
    carousel.addEventListener("mousedown", onMouseDown);
    carousel.addEventListener("mouseup", onMouseUp);

    let resizeT: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        // Width changed, so the tallest slide may have too — re-measure.
        lockedMobileHeight = 0;
        if (track && track.lastElementChild) {
          setCardHeight(track.lastElementChild as HTMLElement, true);
        }
      }, 160);
    };
    window.addEventListener("resize", onResize);

    // Text metrics shift when the webfont swaps in, which would leave the card
    // pinned to a height measured against the fallback font.
    let disposed = false;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (disposed || !track) return;
        lockedMobileHeight = 0;
        setCardHeight(track.lastElementChild as HTMLElement, true);
      });
    }

    return () => {
      disposed = true;
      stopAutoScroll();
      if (pauseTimer) clearTimeout(pauseTimer);
      viewportObserver.disconnect();
      if (btnNext) btnNext.removeEventListener("click", onNextClick);
      if (btnPrev) btnPrev.removeEventListener("click", onPrevClick);
      if (peekNext) peekNext.removeEventListener("click", onNextClick);
      if (peekPrev) peekPrev.removeEventListener("click", onPrevClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stage.removeEventListener("keydown", onKeyDown);
      carousel.removeEventListener("touchstart", onTouchStart);
      carousel.removeEventListener("touchend", onTouchEnd);
      carousel.removeEventListener("mousedown", onMouseDown);
      carousel.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="showcase is-init"
      id="services"
      aria-labelledby="services-title"
      aria-roledescription="carousel"
      aria-label="Services showcase"
    >
      <div className="showcase__bg" aria-hidden="true">
        <span className="showcase__bg-orb showcase__bg-orb--1" />
        <span className="showcase__bg-orb showcase__bg-orb--2" />
        <span className="showcase__bg-orb showcase__bg-orb--3" />
      </div>

      <div className="showcase__inner">
        <div className="section-head">
          <h2 className="section-head__title" id="services-title">
            The Best Value &amp; Service Across All Industries
          </h2>
          <p className="section-head__text">
            Our offshore IT consulting services along with the AI-powered core helps
            top companies stay competitive, win new markets and increase shareholder value.
          </p>
          <svg className="section-head__underline" viewBox="0 0 142 10" fill="none" aria-hidden="true">
            <path d="M2 6C40 -0.5 100 -0.5 140 5" stroke="#f09d4d" strokeWidth={3} strokeLinecap="round" />
          </svg>
        </div>

        <div className="showcase__dots" role="tablist" aria-label="Select a service" />

        <div
          className="showcase__stage"
          tabIndex={0}
          aria-label="Services slider, use arrow keys to navigate"
        >
          <button
            type="button"
            className="showcase__nav showcase__nav--prev"
            aria-label="Previous service"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="showcase__carousel">
            <button
              type="button"
              className="showcase__peek showcase__peek--prev"
              aria-hidden="true"
              tabIndex={-1}
            />
            <div className="showcase__frame">
              <div className="showcase__card">
                <div className="showcase__track">
                  <div className="showcase__card-inner">
                    <div className="showcase__card-top">
                      <div className="showcase__col--text">
                        <span className="showcase__icon-box">
                          {SLIDES_DATA[0].iconImg ? (
                            <img
              decoding="async"
              loading="lazy"
                              src={SLIDES_DATA[0].iconImg}
                              alt={SLIDES_DATA[0].name}
                              width={28}
                              height={28}
                              style={{ width: "28px", height: "28px", objectFit: "contain" }}
                            />
                          ) : (
                            <svg className="showcase__icon">
                              <use href={(SLIDES_DATA[0] as any).iconId} />
                            </svg>
                          )}
                        </span>
                        <h3 className="showcase__name">{SLIDES_DATA[0].name}</h3>
                        <p className="showcase__desc">{SLIDES_DATA[0].desc}</p>
                        <ul className="showcase__list">
                          {SLIDES_DATA[0].links.map((link, lIndex) => (
                            <li key={lIndex} className="showcase__bullet">
                              <a className="showcase__link" href={link.href} {...crossSiteProps(link.href)}>
                                <span className="showcase__link-inner">
                                  <span className="showcase__arrow" aria-hidden="true">
                                    ›
                                  </span>
                                  {link.label}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="showcase__col--media">
                        <img
              decoding="async"
                          className="showcase__image"
                          src={SLIDES_DATA[0].imgSrc}
                          alt={SLIDES_DATA[0].imgAlt}
                          width={440}
                          height={440}
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="showcase__peek showcase__peek--next"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          <button
            type="button"
            className="showcase__nav showcase__nav--next"
            aria-label="Next service"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="showcase__cta-wrap">
          {/* Was href="#services", the id of the very section this button sits
              in — a link to itself. It now goes to the real services index. */}
          <a
            className="btn btn--primary services__cta"
            href={live("/services")}
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Services
          </a>
        </div>

        <div className="showcase__source" aria-label="All services">
          {SLIDES_DATA.map((slide, index) => (
            <article
              key={index}
              className="showcase__slide"
              data-name={slide.name}
            >
              <div className="showcase__card-inner">
                <div className="showcase__card-top">
                  <div className="showcase__col--text">
                    <span className="showcase__icon-box">
                      {slide.iconImg ? (
                        <img
              decoding="async"
              loading="lazy"
                          src={slide.iconImg}
                          alt={slide.name}
                          width={28}
                          height={28}
                          style={{ width: "28px", height: "28px", objectFit: "contain" }}
                        />
                      ) : (
                        <svg className="showcase__icon">
                          <use href={(slide as any).iconId} />
                        </svg>
                      )}
                    </span>
                    <h3 className="showcase__name">{slide.name}</h3>
                    <p className="showcase__desc">{slide.desc}</p>
                    <ul className="showcase__list">
                      {slide.links.map((link, lIndex) => (
                        <li key={lIndex} className="showcase__bullet">
                          <a className="showcase__link" href={link.href} {...crossSiteProps(link.href)}>
                            <span className="showcase__link-inner">
                              <span className="showcase__arrow" aria-hidden="true">
                                ›
                              </span>
                              {link.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="showcase__col--media">
                    <img
              decoding="async"
                      className="showcase__image"
                      src={slide.imgSrc}
                      alt={slide.imgAlt}
                      width={440}
                      height={440}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
