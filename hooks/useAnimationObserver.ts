"use client";

import { useEffect } from "react";

export function useAnimationObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function notInHero(el: Element) {
      return !el.closest(".hero");
    }

    // --- tag reveal targets (skip hero) ---
    const fadeBlocks = [
      ".section-head",
      ".partners__intro",
      ".partners__title",
      ".domains__head",
      ".industries__intro",
      ".testimonials__head",
      ".blogs__intro",
      ".cases__intro",
      ".contact__left",
      ".contact__form",
      ".cta-quote__inner",
      ".trusted",
      ".values-top",
    ];
    fadeBlocks.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (notInHero(el)) el.classList.add("reveal");
      });
    });

    // tilt cards fade in
    [".service-card", ".blog-card", ".intro-card"].forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (notInHero(el)) el.classList.add("reveal", "reveal--fade", "tiltable");
      });
    });

    // staggered card groups
    const groups = [
      ".intro-card",
      ".stat",
      ".service-card",
      /* .award-card is staggered separately, below — see the note there. */
      ".domain-tab",
      ".feature-item",
      ".industry-card",
      ".testimonials__col",
      ".blog-card",
      ".case-row",
      ".office",
      ".review-stat",
      ".footer__col",
      ".footer__brand",
    ];
    groups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (notInHero(el) && !el.classList.contains("reveal"))
          el.classList.add("reveal");
      });
      const byParent = new Map<Node, Element[]>();
      document.querySelectorAll(sel).forEach((el) => {
        if (!notInHero(el) || !el.parentNode) return;
        const arr = byParent.get(el.parentNode) || [];
        arr.push(el);
        byParent.set(el.parentNode, arr);
      });
      byParent.forEach((arr) => {
        arr.forEach((el, i) => {
          (el as HTMLElement).style.setProperty(
            "--reveal-delay",
            Math.min(i, 8) * 70 + "ms"
          );
        });
      });
    });

    /* The certificates get the same entrance every other card group on the
       page has. They were left out while they were a revolving marquee — a
       per-card reveal cannot work on a track whose second half is cloned in
       after this hook has already collected its targets, so those copies sat
       at opacity:0 and the row showed gaps. The wall is static now, so the
       reveal is both possible and the only entrance they have.

       Staggered here rather than through `groups` above, because that helper
       indexes within each element's own parent. These fourteen cards are
       split across two .awards__col wrappers that display:contents flattens,
       so parent-relative delays would run 1-7 and then restart at 1 halfway
       through the second row — visibly scrambled. Indexed across the whole
       wall instead, which is the order they are laid out in.

       55ms a card, so the last one starts at 715ms: slow enough to read as a
       sweep across the rows, short enough that the wall has settled before a
       reader scrolling at normal speed reaches the section below it. */
    document.querySelectorAll<HTMLElement>(".award-card").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", i * 55 + "ms");
    });

    // case rows slide in from alternating sides
    document
      .querySelectorAll(".cases__list .case-row")
      .forEach((el, i) => {
        el.classList.add(i % 2 ? "reveal--right" : "reveal--left");
      });

    // reduced motion check
    if (reduce) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("is-visible");
        /* Nothing is going to animate on this path, so the layer .reveal's
           will-change asks for is pure overhead here — no transition to wait
           for, drop it now. See releaseLayer below for why, and for what
           needsContainingBlock is protecting. */
        if (!needsContainingBlock(el)) el.style.willChange = "auto";
      });
      return;
    }

    // number counter
    function countUp(el: HTMLElement) {
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const targetNode = el.firstChild;
      if (!targetNode || targetNode.nodeType !== 3) return;
      const target = parseInt((el.textContent || "").replace(/\D/g, ""), 10) || 0;
      const dur = 1500;
      let start: number | null = null;
      function step(ts: number) {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        if (targetNode) {
          targetNode.nodeValue = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
        }
        if (p < 1) requestAnimationFrame(step);
        else if (targetNode) {
          targetNode.nodeValue = String(target);
        }
      }
      requestAnimationFrame(step);
    }

    /* Tell the stylesheet when the hero has gone behind .content-stack.
       ------------------------------------------------------------------
       .hero is position:sticky, so it is pinned in the viewport for the whole
       document and never "scrolls off" — the thing that hides it is the opaque
       white .content-stack rising over it. Eight infinite ambient animations
       live inside the hero, most of them on properties that force a repaint
       every frame (box-shadow spread, background-position, drop-shadow), and
       they were running for the entire visit behind that panel. The rule that
       parks them is at the foot of globals.css, keyed on this class.

       Detected with an observer rather than a scroll listener: a root whose
       bottom edge sits CORNER_CLEARANCE px above the viewport top intersects
       .content-stack exactly while the stack's top is above that line, which
       is the moment the last of the hero disappears behind it. The clearance
       covers the stack's own rounded top corners — 100px on desktop, 40px
       below 768px — which are the only place the hero still shows through
       while the stack is arriving. Two callbacks per pass, no forced layout.

       The enormous top margin is deliberate: the root has to still reach
       .content-stack's bottom edge when the reader is at the foot of the page,
       or the stack would stop intersecting and every animation would start up
       again behind the footer. */
    const CORNER_CLEARANCE = 140;
    const stack = document.querySelector(".content-stack");
    const heroEl = document.querySelector(".hero");
    let heroCover: IntersectionObserver | null = null;

    const buildHeroCoverObserver = () => {
      heroCover?.disconnect();
      heroCover = null;
      if (!stack || !heroEl || !("IntersectionObserver" in window)) return;
      heroCover = new IntersectionObserver(
        (entries) => {
          const covered = entries[entries.length - 1].isIntersecting;
          /* On .hero, not on <html>. A class toggle on the root element
             invalidates style for the whole document and forces the pause
             rule's eleven selectors to be matched against all of it; measured
             at 8x throttle that bought a faster median at the cost of a much
             worse tail. Toggled here, the recalc stops at the hero subtree. */
          heroEl.classList.toggle("is-covered", covered);
        },
        {
          rootMargin: `100000px 0px -${window.innerHeight + CORNER_CLEARANCE}px 0px`,
          threshold: 0,
        }
      );
      heroCover.observe(stack);
    };

    buildHeroCoverObserver();

    /* innerHeight is baked into the rootMargin above, so the observer has to be
       rebuilt when the viewport height changes. Coalesced to a frame because a
       phone fires resize repeatedly while its URL bar slides. */
    let coverResizeFrame = 0;
    const onCoverResize = () => {
      if (coverResizeFrame) return;
      coverResizeFrame = requestAnimationFrame(() => {
        coverResizeFrame = 0;
        buildHeroCoverObserver();
      });
    };
    window.addEventListener("resize", onCoverResize, { passive: true });

    /* Hand the compositor layer back once the reveal has played.
       ------------------------------------------------------------------
       .reveal carries `will-change: opacity, transform`. That is the right
       hint while its 0.7s transition is running and the wrong one afterwards:
       will-change is a promise that the element is *about* to animate, and
       Chrome answers it by keeping a composited layer alive for as long as it
       stands. 67 elements on this page carry .reveal, none of them animate
       again after their one entrance, and .reveal.is-visible ends at
       `transform: none` — so the page settles holding 67 layers that exist
       only because of a hint nobody withdrew. A throttled scroll profile spent
       roughly 1.6s of a single mobile pass inside Layerize and Commit walking
       them.

       Dropping the hint when the transition that needed it ends does not make
       the reveal any less smooth: Chrome promotes an element on its own for
       the lifetime of a compositable opacity/transform transition, so the
       entrance is composited either way. The only difference is that the layer
       is released afterwards instead of held for the rest of the visit.

       Two shapes are deliberately left alone. `will-change: transform` also
       makes an element a containing block for absolutely positioned
       descendants, so on a position:static element that has any, taking it
       away would move them — on this page that is .testimonials__col and
       .case-row. Tested per element rather than by selector so it stays
       correct if the markup moves. */
    const settleTimers: number[] = [];

    function needsContainingBlock(el: HTMLElement) {
      if (getComputedStyle(el).position !== "static") return false;
      const kids = el.querySelectorAll<HTMLElement>("*");
      for (let i = 0; i < kids.length; i++) {
        const p = getComputedStyle(kids[i]).position;
        if (p === "absolute" || p === "fixed") return true;
      }
      return false;
    }

    function releaseLayer(el: HTMLElement) {
      let released = false;
      const finish = () => {
        if (released) return;
        released = true;
        el.removeEventListener("transitionend", onTransitionEnd);
        if (!needsContainingBlock(el)) el.style.willChange = "auto";
      };
      const onTransitionEnd = (ev: TransitionEvent) => {
        // Children transition too; only this element's own reveal counts.
        if (ev.target !== el) return;
        if (ev.propertyName !== "opacity" && ev.propertyName !== "transform") return;
        finish();
      };
      el.addEventListener("transitionend", onTransitionEnd);
      /* transitionend does not arrive if the transition never actually runs —
         a background tab, or an element whose values were already at their end
         state. One timer past the longest possible reveal (0.7s of transition
         behind up to 560ms of stagger) is the backstop. */
      settleTimers.push(window.setTimeout(finish, 2000));
    }

    // scroll reveal observer
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-visible");
            releaseLayer(e.target as HTMLElement);
            if (e.target.classList.contains("stat")) {
              const num = e.target.querySelector<HTMLElement>(".stat__number");
              if (num) countUp(num);
            }
            if (io) io.unobserve(e.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      document.querySelectorAll(".reveal").forEach((el) => {
        if (io) io.observe(el);
      });
    } else {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-visible");
      });
    }

    /* Hero mouse parallax — coalesced to one frame like the tilts below.
       --mx/--my are custom properties the hero's decorative layers read, so
       every write invalidates style for that subtree; doing it once per frame
       rather than once per pointer event lands the same value at the same
       paint. */
    const hero = document.querySelector<HTMLElement>(".hero");
    let heroPending = 0;
    let heroX = 0;
    let heroY = 0;
    const writeHero = () => {
      heroPending = 0;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((heroX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((heroY - r.top) / r.height - 0.5).toFixed(3));
    };
    const onPointerMoveHero = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !hero) return;
      heroX = e.clientX;
      heroY = e.clientY;
      if (!heroPending) heroPending = requestAnimationFrame(writeHero);
    };
    const onPointerLeaveHero = () => {
      if (!hero) return;
      if (heroPending) {
        cancelAnimationFrame(heroPending);
        heroPending = 0;
      }
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };

    if (hero) {
      hero.addEventListener("pointermove", onPointerMoveHero);
      hero.addEventListener("pointerleave", onPointerLeaveHero);
    }

    /* 3D hover tilt.
       ------------------------------------------------------------------
       The handler bodies are unchanged; what changed is how often they run. A
       pointermove listener that reads getBoundingClientRect() and then writes
       `transform` does a forced style-and-layout flush per event, and a mouse
       polling at 500 or 1000Hz delivers events far faster than the screen can
       show them — so most of those flushes were computing a transform that was
       overwritten before it ever painted.

       Coalescing to one read and one write per animation frame produces the
       same transform from the same pointer position at the same paint, because
       a frame is when it could have been painted anyway. The rect is still read
       fresh each time rather than cached on enter, so a card that moves under
       the pointer mid-hover still tilts about its real centre. */
    const tiltCleanups: Array<() => void> = [];
    function addTilt(sel: string, max: number) {
      document.querySelectorAll<HTMLElement>(sel).forEach((card) => {
        let pending = 0;
        let cx = 0;
        let cy = 0;
        const write = () => {
          pending = 0;
          const r = card.getBoundingClientRect();
          const px = (cx - r.left) / r.width - 0.5;
          const py = (cy - r.top) / r.height - 0.5;
          card.style.transform = `perspective(850px) rotateX(${(-py * max).toFixed(
            2
          )}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
        };
        const moveHandler = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          cx = e.clientX;
          cy = e.clientY;
          if (!pending) pending = requestAnimationFrame(write);
        };
        const leaveHandler = () => {
          if (pending) {
            cancelAnimationFrame(pending);
            pending = 0;
          }
          card.style.transform = "";
        };
        card.addEventListener("pointermove", moveHandler);
        card.addEventListener("pointerleave", leaveHandler);
        tiltCleanups.push(() => {
          if (pending) cancelAnimationFrame(pending);
          card.removeEventListener("pointermove", moveHandler);
          card.removeEventListener("pointerleave", leaveHandler);
        });
      });
    }
    addTilt(".service-card", 7);
    addTilt(".blog-card", 5);
    addTilt(".intro-card", 6);

    // magnetic CTA button — coalesced the same way, for the same reason
    const ctaCleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>(".site-nav__cta").forEach((btn) => {
      let pending = 0;
      let cx = 0;
      let cy = 0;
      const write = () => {
        pending = 0;
        const r = btn.getBoundingClientRect();
        /* Above 1536px the page is drawn at a CSS zoom (see the last block in
           globals.css). The rect and the pointer are in real screen pixels;
           the translate is written back as a length, which inside the zoom is
           a *design* pixel and gets multiplied again. The rect's own width
           over the unzoomed offsetWidth is that factor, so dividing by it
           keeps the pull the same distance under the cursor at every zoom.
           It is 1 at and below the baseline. */
        const k = btn.offsetWidth ? r.width / btn.offsetWidth : 1;
        btn.style.transform = `translate(${(
          ((cx - r.left - r.width / 2) * 0.3) / k
        ).toFixed(1)}px, ${(((cy - r.top - r.height / 2) * 0.4) / k).toFixed(
          1
        )}px)`;
      };
      const moveHandler = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        cx = e.clientX;
        cy = e.clientY;
        if (!pending) pending = requestAnimationFrame(write);
      };
      const leaveHandler = () => {
        if (pending) {
          cancelAnimationFrame(pending);
          pending = 0;
        }
        btn.style.transform = "";
      };
      btn.addEventListener("pointermove", moveHandler);
      btn.addEventListener("pointerleave", leaveHandler);
      ctaCleanups.push(() => {
        if (pending) cancelAnimationFrame(pending);
        btn.removeEventListener("pointermove", moveHandler);
        btn.removeEventListener("pointerleave", leaveHandler);
      });
    });

    // button ripple
    const rippleCleanups: Array<() => void> = [];
    function addRipple(sel: string, dark: boolean) {
      document.querySelectorAll<HTMLElement>(sel).forEach((btn) => {
        const clickHandler = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          /* Same real-pixels-in, design-pixels-out correction as the magnetic
             CTA above: the ripple's size and offset are written as lengths
             inside the page zoom, so they are divided by it. 1 at and below
             the 1536px baseline. */
          const k = btn.offsetWidth ? r.width / btn.offsetWidth : 1;
          const size = Math.max(btn.offsetWidth, btn.offsetHeight);
          const s = document.createElement("span");
          s.className = "ripple" + (dark ? " ripple--dark" : "");
          s.style.width = s.style.height = size + "px";
          s.style.left = (e.clientX - r.left) / k - size / 2 + "px";
          s.style.top = (e.clientY - r.top) / k - size / 2 + "px";
          btn.appendChild(s);
          setTimeout(() => {
            s.remove();
          }, 600);
        };
        btn.addEventListener("click", clickHandler);
        rippleCleanups.push(() => btn.removeEventListener("click", clickHandler));
      });
    }
    addRipple(".btn", false);
    addRipple(".cta-quote__btn", false);
    addRipple(".contact__submit", true);

    /* Blog image parallax.
       ------------------------------------------------------------------
       This was the most expensive thing on the page during a scroll, and not
       because of the parallax itself. The rAF callback read
       getBoundingClientRect() on every blog image on every frame, for the whole
       length of the document. The `r.bottom < 0 || r.top > vh` test skipped the
       *write* for an off-screen image but the read had already happened — and a
       geometry read one frame after a style write is what forces the browser to
       flush style and layout. A scroll profile showed UpdateLayoutTree and
       Layout running once per frame from the top of the page to the bottom, for
       three images sitting in one section near the foot of it.

       Same parallax, same values; it just stops running when there is nothing
       to move. An observer tracks which images are near the viewport, the
       scroll listener is only attached while at least one of them is, and the
       loop reads only those. The 240px margin means an image is already being
       tracked before it can be seen, so it arrives carrying the same --py the
       old code would have given it. */
    const pimgs = Array.from(document.querySelectorAll<HTMLElement>(".blog-card__image img"));
    let scrollHandler: (() => void) | null = null;
    let parallaxIo: IntersectionObserver | null = null;
    if (pimgs.length) {
      const live = new Set<HTMLElement>();
      let ticking = false;
      let listening = false;

      const updateParallax = () => {
        ticking = false;
        if (!live.size) return;
        const vh = window.innerHeight;
        /* Read every rect first, then write: interleaving them would force a
           fresh layout per image instead of one for the batch. */
        const rects: Array<[HTMLElement, DOMRect]> = [];
        live.forEach((img) => rects.push([img, img.getBoundingClientRect()]));
        for (const [img, r] of rects) {
          if (r.bottom < 0 || r.top > vh) continue;
          const prog = (r.top + r.height / 2 - vh / 2) / vh;
          img.style.setProperty("--py", (prog * -22).toFixed(1) + "px");
        }
      };

      scrollHandler = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      };

      const syncListener = () => {
        if (live.size && !listening) {
          listening = true;
          window.addEventListener("scroll", scrollHandler as () => void, { passive: true });
        } else if (!live.size && listening) {
          listening = false;
          window.removeEventListener("scroll", scrollHandler as () => void);
        }
      };

      if ("IntersectionObserver" in window) {
        parallaxIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) live.add(e.target as HTMLElement);
              else live.delete(e.target as HTMLElement);
            });
            syncListener();
            updateParallax();
          },
          { rootMargin: "240px 0px" }
        );
        pimgs.forEach((img) => parallaxIo!.observe(img));
      } else {
        pimgs.forEach((img) => live.add(img));
        syncListener();
      }
      updateParallax();
    }

    return () => {
      if (io) io.disconnect();
      if (parallaxIo) parallaxIo.disconnect();
      heroCover?.disconnect();
      if (coverResizeFrame) cancelAnimationFrame(coverResizeFrame);
      window.removeEventListener("resize", onCoverResize);
      heroEl?.classList.remove("is-covered");
      settleTimers.forEach((t) => window.clearTimeout(t));
      if (hero) {
        if (heroPending) cancelAnimationFrame(heroPending);
        hero.removeEventListener("pointermove", onPointerMoveHero);
        hero.removeEventListener("pointerleave", onPointerLeaveHero);
      }
      tiltCleanups.forEach((c) => c());
      ctaCleanups.forEach((c) => c());
      rippleCleanups.forEach((c) => c());
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    };
  }, []);
}
