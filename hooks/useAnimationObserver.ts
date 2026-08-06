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
      ".award-card",
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

    // case rows slide in from alternating sides
    document
      .querySelectorAll(".cases__list .case-row")
      .forEach((el, i) => {
        el.classList.add(i % 2 ? "reveal--right" : "reveal--left");
      });

    // reduced motion check
    if (reduce) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-visible");
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

    // scroll reveal observer
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-visible");
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

    // hero mouse parallax
    const hero = document.querySelector<HTMLElement>(".hero");
    const onPointerMoveHero = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const onPointerLeaveHero = () => {
      if (!hero) return;
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    };

    if (hero) {
      hero.addEventListener("pointermove", onPointerMoveHero);
      hero.addEventListener("pointerleave", onPointerLeaveHero);
    }

    // 3D hover tilt
    const tiltCleanups: Array<() => void> = [];
    function addTilt(sel: string, max: number) {
      document.querySelectorAll<HTMLElement>(sel).forEach((card) => {
        const moveHandler = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(850px) rotateX(${(-py * max).toFixed(
            2
          )}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
        };
        const leaveHandler = () => {
          card.style.transform = "";
        };
        card.addEventListener("pointermove", moveHandler);
        card.addEventListener("pointerleave", leaveHandler);
        tiltCleanups.push(() => {
          card.removeEventListener("pointermove", moveHandler);
          card.removeEventListener("pointerleave", leaveHandler);
        });
      });
    }
    addTilt(".service-card", 7);
    addTilt(".blog-card", 5);
    addTilt(".intro-card", 6);

    // magnetic CTA button
    const ctaCleanups: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>(".site-nav__cta").forEach((btn) => {
      const moveHandler = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.3).toFixed(
          1
        )}px, ${((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1)}px)`;
      };
      const leaveHandler = () => {
        btn.style.transform = "";
      };
      btn.addEventListener("pointermove", moveHandler);
      btn.addEventListener("pointerleave", leaveHandler);
      ctaCleanups.push(() => {
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
          const size = Math.max(r.width, r.height);
          const s = document.createElement("span");
          s.className = "ripple" + (dark ? " ripple--dark" : "");
          s.style.width = s.style.height = size + "px";
          s.style.left = e.clientX - r.left - size / 2 + "px";
          s.style.top = e.clientY - r.top - size / 2 + "px";
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

    // blog image parallax
    const pimgs = Array.from(document.querySelectorAll<HTMLElement>(".blog-card__image img"));
    let scrollHandler: (() => void) | null = null;
    if (pimgs.length) {
      let ticking = false;
      const updateParallax = () => {
        const vh = window.innerHeight;
        pimgs.forEach((img) => {
          const r = img.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const prog = (r.top + r.height / 2 - vh / 2) / vh;
          img.style.setProperty("--py", (prog * -22).toFixed(1) + "px");
        });
        ticking = false;
      };
      scrollHandler = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
      updateParallax();
    }

    return () => {
      if (io) io.disconnect();
      if (hero) {
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
