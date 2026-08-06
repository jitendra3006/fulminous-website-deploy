"use client";

import React, { useEffect } from "react";

export function Partners() {
  useEffect(() => {
    const marquees = Array.from(document.querySelectorAll<HTMLElement>(".marquee"));
    if (!marquees.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    marquees.forEach((m) => {
      const track = m.querySelector<HTMLElement>(".marquee__track");
      if (!track) return;

      if (reduce) {
        m.classList.add("is-static");
        return;
      }

      if (m.classList.contains("is-ready")) return;

      const originals = Array.from(track.children);
      originals.forEach((node) => {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
      });
      m.classList.add("is-ready");
    });
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".partners");
    const awards = document.querySelector<HTMLElement>(".awards");
    if (!section || !awards) return;

    let touchStartY = 0;
    let isRequestingFrame = false;
    let lockedScrollY: number | null = null;

    const getNavbarHeight = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      return header ? header.getBoundingClientRect().height : 79;
    };

    const handleScrollDelta = (deltaY: number, e?: Event) => {
      const maxScroll = awards.scrollHeight - awards.clientHeight;
      if (maxScroll <= 0) return;

      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;

      const rect = section.getBoundingClientRect();
      const navbarHeight = getNavbarHeight();

      const shouldLockDown =
        isScrollingDown &&
        rect.top <= navbarHeight + 30 &&
        rect.bottom > window.innerHeight * 0.4 &&
        awards.scrollTop < maxScroll - 0.5;

      const shouldLockUp =
        isScrollingUp &&
        rect.bottom >= window.innerHeight - 30 &&
        rect.top < navbarHeight + 100 &&
        awards.scrollTop > 0.5;

      if (lockedScrollY === null && (shouldLockDown || shouldLockUp)) {
        lockedScrollY = window.scrollY;
      }

      if (lockedScrollY !== null) {
        const canScrollDown = isScrollingDown && awards.scrollTop < maxScroll - 0.5;
        const canScrollUp = isScrollingUp && awards.scrollTop > 0.5;

        if (canScrollDown || canScrollUp) {
          if (e && e.cancelable) {
            e.preventDefault();
          }

          // Enforce 100% frozen page position so next section never enters
          window.scrollTo(0, lockedScrollY);

          if (!isRequestingFrame) {
            isRequestingFrame = true;
            requestAnimationFrame(() => {
              awards.scrollTop = Math.min(maxScroll, Math.max(0, awards.scrollTop + deltaY));
              isRequestingFrame = false;
            });
          }
        } else {
          // Release scroll lock ONLY when awards reach absolute bottom (maxScroll) or top (0)
          lockedScrollY = null;
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      handleScrollDelta(e.deltaY, e);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      handleScrollDelta(deltaY, e);
    };

    const onNativeScroll = () => {
      if (lockedScrollY !== null) {
        window.scrollTo(0, lockedScrollY);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, []);

  return (
    <>
      <section className="trusted" aria-labelledby="trusted-title">
        <h2 className="trusted__title" id="trusted-title">
          Trusted by Leading Companies Worldwide
        </h2>
        <div
          className="marquee"
          tabIndex={0}
          role="group"
          aria-label="Companies that trust Fulminous Software"
        >
          <ul className="marquee__track">
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/PlateRate.png" alt="PlateRate logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/Be-Active-You.png" alt="Be Active You logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/Gameson.png" alt="Gameson logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/ConocoPhillips.png" alt="ConocoPhillips logo" width={118} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-05.svg" alt="Orbit logo" width={118} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-06.svg" alt="Nova logo" width={105} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-07.svg" alt="Pulse logo" width={118} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-08.svg" alt="Zenith logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-09.svg" alt="Flux logo" width={105} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-10.svg" alt="Apex logo" width={105} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-11.svg" alt="Cobalt logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img className="marquee__logo" src="/assets/logo-12.svg" alt="Ember logo" width={118} height={40} />
            </li>
          </ul>
        </div>
      </section>

      <section className="partners" aria-labelledby="partners-title">
        <div className="partners__inner">
          <div className="partners__intro">
            <h2 className="partners__title" id="partners-title">
              Cultivating Strategic Partnerships for Business Growth
            </h2>
            <p className="partners__text">
              Our achievements reflect our commitment to innovation, quality, and delivering
              exceptional digital solutions that create lasting value for our clients.
            </p>
          </div>

          <aside className="awards" aria-label="Awards and certifications">
            <div className="awards__col awards__col--offset">
              <div className="award-card">
                <img
                  src="/assets/AWS-Certified_Cloud-Practitioner_512x512.bc006f14f986fa4f3ca238b0b62be458ce1fb5ce 3.png"
                  alt="AWS Certified Cloud Practitioner"
                  width={150}
                  height={150}
                />
              </div>
              <div className="award-card">
                <img src="/assets/TOP-FIRM.png" alt="Fulminous Software TOP FIRM" width={150} height={150} />
              </div>
              <div className="award-card">
                <img
                  src="/assets/TopSoftwareDevelopers.png"
                  alt="TOP SOFTWARE DEVELOPERS"
                  width={150}
                  height={150}
                />
              </div>
              <div className="award-card">
                <img src="/assets/GoodFirms.png" alt="Goodfirms RESEARCH PARTNER" width={150} height={150} />
              </div>
              <div className="award-card">
                <img src="/assets/AppFirmsReviewUIUX.png" alt="AppFirmsReview UI-UX Design Companies" width={150} height={150} />
              </div>
              <div className="award-card">
                <img src="/assets/BestWebCompaniesNY.png" alt="beST Web Companies in New York" width={150} height={150} />
              </div>
              <div className="award-card">
                <img
                  src="/assets/top_the_manifest_software_developers_india_2024_award.png"
                  alt="MOST REVIEWED SOFTWARE DEVELOPERS INDIA"
                  width={150}
                  height={150}
                />
              </div>
            </div>

            <div className="awards__col">
              <div className="award-card">
                <img src="/assets/PF.png" alt="PF Top Mobile App Development Company 2026" width={150} height={150} />
              </div>
              <div className="award-card">
                <img src="/assets/Top-DevOps.png" alt="Top DevOps Companies in Jaipur" width={150} height={150} />
              </div>
              <div className="award-card">
                <img src="/assets/research-partner-badge.png" alt="ESC Member Govt of India" width={150} height={150} />
              </div>
              <div className="award-card">
                <img
                  src="/assets/RightFirmsTransparent.svg"
                  alt="RightFirms Top Service Provider 2025"
                  width={150}
                  height={150}
                />
              </div>
              <div className="award-card">
                <img src="/assets/RankWatchTopWeb.png" alt="RankWatch Top Web Development Agencies 2025" width={150} height={150} />
              </div>
              <div className="award-card">
                <img src="/assets/TechReviewerECommerce.png" alt="techreviewer TOP 100 eCommerce Developers 2025" width={150} height={150} />
              </div>
              <div className="award-card">
                <img
                  src="/assets/top_the_manifest_app_development_company_india_2024_award.png"
                  alt="MOST REVIEWED APP DEVELOPMENT COMPANY INDIA"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
