"use client";

import React, { useEffect } from "react";

/* Runs `fn` once the browser is idle, and no later than `timeout`.
   ------------------------------------------------------------------
   Everything this file does on mount is for a section that starts well below
   the fold: cloning 21 logos for the marquee loop, and measuring the awards
   column to size the scroll runway. Both were running inside hydration, where
   the clone is a burst of DOM writes and the measure is a forced reflow —
   directly on the critical path for a section nobody can see yet.
   Deferring changes nothing on screen. The marquee's animation is gated on the
   `is-ready` class this code adds, so until it runs the track simply sits
   still, and the runway variables it sets only matter once the pin is reached.
   requestIdleCallback's own timeout is the backstop on a busy page; the
   setTimeout is the fallback for Safari, which still lacks the API. */
function whenIdle(fn: () => void, timeout = 1500): () => void {
  const ric = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  }).requestIdleCallback;

  if (typeof ric === "function") {
    const id = ric(fn, { timeout });
    return () => (window as unknown as { cancelIdleCallback?: (i: number) => void }).cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

export function Partners() {
  useEffect(() => {
    const marquees = Array.from(document.querySelectorAll<HTMLElement>(".marquee"));
    if (!marquees.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clone = () =>
      marquees.forEach((m) => {
        const track = m.querySelector<HTMLElement>(".marquee__track");
        if (!track) return;

        if (reduce) {
          m.classList.add("is-static");
          return;
        }

        if (m.classList.contains("is-ready")) return;

        const originals = Array.from(track.children);
        /* Built off-document and appended once: 21 appendChild calls straight
           into the live track meant the browser could invalidate layout 21
           times over. */
        const frag = document.createDocumentFragment();
        originals.forEach((node) => {
          const copy = node.cloneNode(true) as HTMLElement;
          copy.setAttribute("aria-hidden", "true");
          copy.setAttribute("tabindex", "-1");
          frag.appendChild(copy);
        });
        track.appendChild(frag);
        m.classList.add("is-ready");
      });

    return whenIdle(clone);
  }, []);

  // Desktop: pin the partners block with CSS `position: sticky` and drive the
  // awards column from the page's own scroll offset.
  //
  // The previous implementation hijacked the wheel event — preventDefault on
  // every tick, then window.scrollTo back to a locked Y while it hand-scrolled
  // the awards column. That can never be smooth: wheel scrolling is composited
  // off the main thread, so the browser had already painted a scrolled frame
  // before our snap-back ran, and the heading visibly bounced once per tick.
  // Nothing is blocked now. The page scrolls natively; we only read the pin's
  // progress and translate the awards track, so the text cannot move at all.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = document.querySelector<HTMLElement>(".partners");
    const inner = document.querySelector<HTMLElement>(".partners__inner");
    const viewport = document.querySelector<HTMLElement>(".awards");
    const track = document.querySelector<HTMLElement>(".awards__track");
    if (!section || !inner || !viewport || !track) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let distance = 0;

    const clear = () => {
      track.style.transform = "";
      section.style.removeProperty("--pin-extra");
      section.style.removeProperty("--pin-top");
    };

    const apply = () => {
      frame = 0;
      if (distance <= 0) return;

      const styles = getComputedStyle(section);
      const padTop = parseFloat(styles.paddingTop) || 0;
      const padBottom = parseFloat(styles.paddingBottom) || 0;
      const pinTop = parseFloat(getComputedStyle(inner).top) || 0;

      // Sticky travels inside the section's content box, so the runway spacer
      // below .partners__inner is exactly how far the pin can move — which is
      // exactly `distance`. Read it off the live box rather than assuming.
      const startTop = pinTop - padTop;
      const endTop = pinTop - (section.offsetHeight - padBottom - inner.offsetHeight);
      const travel = startTop - endTop;
      if (travel <= 0) return;

      const raw = (startTop - section.getBoundingClientRect().top) / travel;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      // translate3d keeps the column on the compositor — no layout, no reflow
      // of the text beside it.
      track.style.transform = `translate3d(0, ${-(progress * distance).toFixed(2)}px, 0)`;
    };

    const measure = () => {
      if (!desktop.matches || reduce.matches) {
        distance = 0;
        clear();
        return;
      }

      const header = document.querySelector<HTMLElement>(".site-header");
      const headerHeight = header ? header.getBoundingClientRect().height : 79;
      // Sit just under the fixed navbar, but never push the block off the
      // bottom of a short viewport.
      const pinTop = Math.max(
        headerHeight + 8,
        Math.min(headerHeight + 32, window.innerHeight - inner.offsetHeight - 24)
      );
      section.style.setProperty("--pin-top", `${pinTop}px`);

      const styles = getComputedStyle(viewport);
      const visible =
        viewport.clientHeight -
        (parseFloat(styles.paddingTop) || 0) -
        (parseFloat(styles.paddingBottom) || 0);
      // scrollHeight is the fallback: if anything ever constrains the track's
      // box again, offsetHeight collapses to the visible height and the column
      // would silently stop travelling. scrollHeight still reports the content.
      const natural = Math.max(track.offsetHeight, track.scrollHeight);
      distance = Math.max(0, natural - visible);
      // The runway is the extra section height the pin scrolls through, and the
      // column finishes travelling exactly as the pin releases — so the ratio
      // between the two IS the badges' speed. At 1:1 they slid past at the full
      // scroll rate while the heading beside them stood still, which read as the
      // section rushing by. A longer runway for the same travel means the same
      // badges cross the same window over more scrolling, i.e. slower: at 1.7
      // they move at about 0.6x the page. Raise this to slow them further.
      // apply() re-derives `travel` from the live box, so it needs no changes.
      const PACE = 1.7;
      section.style.setProperty("--pin-extra", `${Math.round(distance * PACE)}px`);
      apply();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    /* Deferred, not skipped. measure() reads getComputedStyle, offsetHeight,
       scrollHeight and a bounding rect — a forced reflow of the whole awards
       column, which was running inside hydration for a block the user cannot
       see yet. Until it runs `distance` is 0, and apply() returns immediately
       on that, so an early scroll simply finds the column not yet pinned —
       exactly what it does today before the first measure lands. */
    const cancelIdle = whenIdle(measure);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    reduce.addEventListener("change", measure);

    // Badge images are unsized until they decode; re-measure so the runway
    // matches the real column height instead of a short first guess.
    const images = Array.from(track.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure);
    });

    return () => {
      cancelIdle();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
      reduce.removeEventListener("change", measure);
      images.forEach((img) => img.removeEventListener("load", measure));
      clear();
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
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/PlateRate.webp" alt="PlateRate logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Be-Active-You.webp" alt="Be Active You logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Gameson.webp" alt="Gameson logo" width={130} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/ConocoPhillips.png" alt="ConocoPhillips logo" width={118} height={40} />
            </li>
            {/* Every width/height below carries that file's real ratio so the
                row reserves the right box before the PNG decodes —
                .marquee__logo overrides both with height:44px / width:auto,
                but the intrinsic ratio is what stops the track jumping on
                load. Ratios: 1050x301, 332x191, 235x193, 2560x739, 500x200. */}
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Visual Objects.png" alt="Visual Objects logo" width={140} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/C3S.webp" alt="Complete Student Support System logo" width={70} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Ekolo.webp" alt="Ekolo logo" width={49} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Microsoft Azure.webp" alt="Microsoft Azure logo" width={138} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/BCI Computers.webp" alt="BCI Computers logo" width={100} height={40} />
            </li>
            {/* Real client logos replace the placeholder Orbit…Ember marks.
                The source files arrived on a shared 500x200 canvas, so each
                mark carried a different amount of baked-in white padding and
                the row's spacing read as uneven. The files are now trimmed to
                the mark itself at a common 120px cap height; the width/height
                below is that trimmed ratio, which is what makes the visual gaps
                match. .marquee__logo still overrides to height:44px/auto. */}
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/StayInsure.jpg" alt="Stay Insure logo" width={89} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Tapasya-Classes.jpg" alt="Tapasya Classes logo" width={53} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Easy-Recovery.jpg" alt="Easy Recovery logo" width={39} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/FaceVue-Aesthetics.jpg" alt="FaceVue Aesthetics logo" width={40} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Muknogy-Micro-Finance.webp" alt="Muknogy Micro Finance Foundation logo" width={86} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Planet-Alpha-Corp.webp" alt="Planet Alpha Corp Forest Carbon Legacy logo" width={178} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/PCI.webp" alt="PCI logo" width={40} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Sanatan-Bazaar.webp" alt="Sanatan Bazaar logo" width={55} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Techno-Winner.webp" alt="Techno Winner logo" width={36} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/DSR-Ludo.webp" alt="DSR Ludo logo" width={51} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Kuchoriya-Tech-Soft.jpg" alt="Kuchoriya Tech Soft logo" width={42} height={40} />
            </li>
            <li className="marquee__item">
              <img
              decoding="async"
              loading="eager" fetchPriority="low" className="marquee__logo" src="/assets/Star-Ludo.jpg" alt="Star Ludo logo" width={40} height={40} />
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
            {/* The track is what moves; .awards stays put as the clipping
                window. On mobile it collapses to display:contents so the
                existing grid keeps treating the cards as its own items. */}
            <div className="awards__track">
              <div className="awards__col awards__col--offset">
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy"
                    src="/assets/AWS-Certified_Cloud-Practitioner_512x512.bc006f14f986fa4f3ca238b0b62be458ce1fb5ce 3.webp"
                    alt="AWS Certified Cloud Practitioner"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/TOP-FIRM.webp" alt="Fulminous Software TOP FIRM" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy"
                    src="/assets/TopSoftwareDevelopers.webp"
                    alt="TOP SOFTWARE DEVELOPERS"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/GoodFirms.webp" alt="Goodfirms RESEARCH PARTNER" width={150} height={150} />
                </div>
                <div className="award-card">
                  {/* The two filenames are swapped in /assets: this one holds
                      the beST Web Companies badge and BestWebCompaniesNY.png
                      holds the AppFirmsReview badge. The alt text follows what
                      each file actually shows rather than what it is called —
                      renaming the files would be the real fix. */}
                  <img
              decoding="async"
              loading="lazy" src="/assets/AppFirmsReviewUIUX.png" alt="beST Web Companies in New York" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/BestWebCompaniesNY.png" alt="AppFirmsReview Top Rated UI-UX Design Companies" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy"
                    src="/assets/top_the_manifest_software_developers_india_2024_award.webp"
                    alt="MOST REVIEWED SOFTWARE DEVELOPERS INDIA"
                    width={150}
                    height={150}
                  />
                </div>
              </div>

              <div className="awards__col">
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/PF.webp" alt="PF Top Mobile App Development Company 2026" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/Top-DevOps.webp" alt="Top DevOps Companies in Jaipur" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/research-partner-badge.webp" alt="ESC Member Govt of India" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy"
                    src="/assets/RightFirmsTransparent.svg"
                    alt="RightFirms Top Service Provider 2025"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/RankWatchTopWeb.png" alt="RankWatch Top Web Development Agencies 2025" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy" src="/assets/TechReviewerECommerce.webp" alt="techreviewer TOP 100 eCommerce Developers 2025" width={150} height={150} />
                </div>
                <div className="award-card">
                  <img
              decoding="async"
              loading="lazy"
                    src="/assets/top_the_manifest_app_development_company_india_2024_award.webp"
                    alt="MOST REVIEWED APP DEVELOPMENT COMPANY INDIA"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Scroll runway for the sticky pin — its height is the exact distance
            the awards column has left to travel. Desktop only; height comes
            from --pin-extra, which the effect measures. */}
        <div className="partners__runway" aria-hidden="true" />
      </section>
    </>
  );
}
