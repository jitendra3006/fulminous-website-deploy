"use client";

import React, { useEffect, useRef } from "react";

const SLIDES_DATA = [
  {
    name: "Game Development Services",
    iconImg: "/assets/icons/Game Developemnt Services.svg",
    desc: "Top game development experts deliver amazing gaming experiences with innovative game apps and software :",
    links: [
      { href: "/services/betting-app-development", label: "Betting App Development" },
      { href: "/services/color-game-development", label: "Color Game Development" },
      { href: "/services/ludo-game-development", label: "Ludo Game Development" },
      { href: "/services/rummy-game-development", label: "Rummy Game Development" },
      { href: "/services/bingo-game-development", label: "Bingo Game Development" },
      { href: "/services/poker-game-development", label: "Poker Game Development" },
    ],
    imgSrc: "/assets/Game-Development-Banner.jpg",
    imgAlt: "Game Development Services illustration",
  },
  {
    name: "Dedicated Teams & Staff Augmentation",
    iconImg: "/assets/icons/Software Development.svg",
    desc: "Fulminous Software helps you to access the services of dedicated teams and staff augmentation for affordable development :",
    links: [
      { href: "/services/dedicated-development-teams", label: "Dedicated Development Teams" },
      { href: "/services/it-staff-augmentation", label: "IT Staff Augmentation" },
      { href: "/services/remote-development-teams", label: "Remote Development Teams" },
      { href: "/services/project-based-hiring", label: "Project-Based Hiring" },
      { href: "/services/technical-consulting", label: "Technical Consulting" },
      { href: "/services/managed-development-services", label: "Managed Development Services" },
    ],
    imgSrc: "/assets/Software-Development-Banner.jpg",
    imgAlt: "Dedicated Teams & Staff Augmentation illustration",
  },
  {
    name: "Quality Assurance",
    iconImg: "/assets/icons/Quality Assurance.svg",
    desc: "We evaluate the performance of software solutions in all aspects and provide support for enhancement :",
    links: [
      { href: "/services/manual-testing", label: "Manual Testing" },
      { href: "/services/automated-testing", label: "Automated Testing" },
      { href: "/services/performance-testing", label: "Performance Testing" },
      { href: "/services/security-testing", label: "Security Testing" },
      { href: "/services/mobile-app-testing", label: "Mobile App Testing" },
      { href: "/services/qa-consulting", label: "QA Consulting" },
    ],
    imgSrc: "/assets/Quality-Assurance-IMG.png",
    imgAlt: "Quality Assurance illustration",
  },
  {
    name: "E-commerce Solutions",
    iconImg: "/assets/icons/E-commerce Solutions.svg",
    desc: "Now, develop custom e-commerce platforms with the assistance of our experts in various e-commerce platforms :",
    links: [
      { href: "/services/e-commerce-website", label: "E-commerce Website" },
      { href: "/services/marketplace-development", label: "Marketplace Development" },
      { href: "/services/b2b-commerce-solutions", label: "B2B Commerce Solutions" },
      { href: "/services/shopping-cart-integration", label: "Shopping Cart Integration" },
      { href: "/services/payment-gateway-integration", label: "Payment Gateway Integration" },
      { href: "/services/maintenance-and-support", label: "Maintenance & Support" },
    ],
    imgSrc: "/assets/E-commerce-Solutions-IMG.png",
    imgAlt: "E-commerce Solutions illustration",
  },
  {
    name: "Cloud & DevOps",
    iconImg: "/assets/icons/Cloud & DevOps.svg",
    desc: "Fulminous Software offers complete cloud development solutions, bringing you maximum accessibility :",
    links: [
      { href: "/services/cloud-migration", label: "Cloud Migration" },
      { href: "/services/cloud-infrastructure-management", label: "Cloud Infrastructure Management" },
      { href: "/services/devops-consulting", label: "DevOps Consulting" },
      { href: "/services/ci-cd-implementation", label: "CI/CD Implementation" },
      { href: "/services/containerization-and-orchestration", label: "Containerization & Orchestration" },
      { href: "/services/performance-monitoring", label: "Performance Monitoring" },
    ],
    imgSrc: "/assets/Cloud-&-DevOps-IMG.png",
    imgAlt: "Cloud & DevOps illustration",
  },
  {
    name: "AI Development",
    iconImg: "/assets/icons/AI Development.svg",
    desc: "Fulminous Software develops the latest AI solutions for all your business needs :",
    links: [
      { href: "/services/ai-development-services", label: "AI Development Services" },
      { href: "/services/generative-ai-development", label: "Generative AI Development" },
      { href: "/services/ai-chatbot-development", label: "AI Chatbot Development" },
      { href: "/services/ai-powered-app-development", label: "AI-Powered App Development" },
      { href: "/services/ai-agent-development", label: "AI Agent Development" },
      { href: "/services/ai-consulting-services", label: "AI Consulting Services" },
    ],
    imgSrc: "/assets/AI-Develoment.png",
    imgAlt: "AI Development illustration",
  },
  {
    name: "Mobile App Development",
    iconImg: "/assets/icons/Mobile App Development.svg",
    desc: "We develop custom mobile apps with trending features and engaging designs :",
    links: [
      { href: "/services/mobile-app-development", label: "Mobile App Development" },
      { href: "/services/ios-app-development", label: "iOS App Development" },
      { href: "/services/android-app-development", label: "Android App Development" },
      { href: "/services/dating-app-development", label: "Dating App Development" },
      { href: "/services/cross-platform-app-development", label: "Cross-Platform App Development" },
      { href: "/services/wearable-app-development", label: "Wearable App Development" },
    ],
    imgSrc: "/assets/Mobile-App-Development-IMG.png",
    imgAlt: "Mobile App Development illustration",
  },
  {
    name: "Web Development",
    iconImg: "/assets/icons/Web Development .svg",
    desc: "Now get responsive and feature-rich website solutions for your businesses :",
    links: [
      { href: "/services/web-application-development", label: "Web Application Development" },
      { href: "/services/e-commerce-development", label: "E-commerce Development" },
      { href: "/services/wordpress-development", label: "Wordpress Development" },
      { href: "/services/php-web-development", label: "PHP Web Development" },
      { href: "/services/custom-web-development", label: "Custom Web Development" },
      { href: "/services/progressive-web-apps-pwa", label: "Progressive Web Apps (PWA)" },
    ],
    imgSrc: "/assets/Web-Development-IMG.png",
    imgAlt: "Web Development illustration",
  },
  {
    name: "UI/UX Design",
    iconImg: "/assets/icons/ui-ux design.svg",
    desc: "We design highly engaging and attractive UI UX for your digital platforms :",
    links: [
      { href: "/services/ui-ux-design", label: "UI UX Design" },
      { href: "/services/web-design-services", label: "Web Design Services" },
      { href: "/services/startup-website-design", label: "Startup Website Design" },
      { href: "/services/hire-mvp-designers", label: "Hire MVP Designers" },
      { href: "/services/mobile-app-design", label: "Mobile App Design" },
      { href: "/services/manufacturing-web-design", label: "Manufacturing Web Design" },
    ],
    imgSrc: "/assets/UI-UX-Design.png",
    imgAlt: "UI/UX Design illustration",
  },
  {
    name: "Software Development",
    iconImg: "/assets/Software-Development-Services.png",
    desc: "We develop all types of software solutions that can grow your business :",
    links: [
      { href: "/services/custom-health-software", label: "Custom Health Software" },
      { href: "/services/legacy-software-modernization", label: "Legacy Software Modernization" },
      { href: "/services/software-maintenance-and-support", label: "Software Maintenance & Support" },
      { href: "/services/consulting-services", label: "Consulting Services" },
      { href: "/services/enterprise-software-solutions", label: "Enterprise Software Solutions" },
      { href: "/services/saas-product-development", label: "SaaS Product Development" },
    ],
    imgSrc: "/assets/Software-Development-Banner.jpg",
    imgAlt: "Software Development illustration",
  },
];

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

    function setCardHeight(panel: HTMLElement | null, instant?: boolean) {
      if (!card) return;
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

      if (dir === "next") {
        track!.appendChild(newPanel);
        newPanel.style.transform = "scale(0.94)";
        if (oldPanel) oldPanel.style.transform = "scale(1)";
        track!.style.transition = "none";
        track!.style.transform = "translateX(0)";
        void track!.offsetWidth;
        track!.style.transition = trans;
        track!.style.transform = "translateX(-100%)";
      } else {
        if (oldPanel) track!.insertBefore(newPanel, oldPanel);
        else track!.appendChild(newPanel);
        newPanel.style.transform = "scale(0.94)";
        if (oldPanel) oldPanel.style.transform = "scale(1)";
        track!.style.transition = "none";
        track!.style.transform = "translateX(-100%)";
        void track!.offsetWidth;
        track!.style.transition = trans;
        track!.style.transform = "translateX(0)";
      }
      if (oldPanel) {
        oldPanel.style.transition = trans;
        oldPanel.style.transform = "scale(0.94)";
      }
      newPanel.style.transition = trans;
      newPanel.style.transform = "scale(1)";

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
        if (track && track.lastElementChild) {
          setCardHeight(track.lastElementChild as HTMLElement, true);
        }
      }, 160);
    };
    window.addEventListener("resize", onResize);

    return () => {
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
                <div className="showcase__track" />
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
          <a className="btn btn--primary services__cta" href="#services">
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
                          <a className="showcase__link" href={link.href}>
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
