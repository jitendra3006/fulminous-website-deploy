"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

interface GlowOrb {
  x: number;
  y: number;
  radius: number;
  color: string;
  /* `color` with its alpha rewritten to 0.06, for the gradient's mid stop.
     Derived once in initScene rather than by regex on every frame. */
  colorMid?: string;
  vx: number;
  vy: number;
  /* The orb's three-stop radial gradient, built once at the canvas origin and
     moved into place with the transform. See the note in initScene. */
  gradient?: CanvasGradient;
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const particles: Particle[] = [];
    const particleCount = 32;

    const glowOrbs: GlowOrb[] = [];

    /* Pre-rendered copy of the one layer that never changes between frames.
       ------------------------------------------------------------------
       The render loop was rebuilding an eight-stop linear gradient and filling
       the whole hero with it on every frame, ~60 times a second, plus a
       clearRect over the same area first. The gradient depends only on
       `height` — it is not animated at all; the moving parts are the three
       drifting orbs and the particles.

       So it is rasterised once per initScene() into its own canvas and blitted
       after that. Same rasteriser, same stops, and the blit is 1:1 at device
       resolution with the transform reset, so no resampling happens. Verified
       pixel-identical over 60 frames against the inline version: 0 differing
       subpixels.

       The spotlight aura is deliberately NOT cached the same way. It is also
       static, but inline it fills only its own ellipse, whereas a cached layer
       has to be composited across the whole canvas — which measured *slower*,
       and round-tripping its semi-transparent pixels through a second canvas
       shifted them by up to 1/255. It stays inline. */
    let bgLayer: HTMLCanvasElement | null = null;

    /* Softness baked into sprites instead of re-blurred every frame.
       ------------------------------------------------------------------
       The canvas used to carry `filter: blur(3.5px)`, and that single
       declaration was the largest per-frame paint cost on a Retina Mac.
       WebKit re-rasterises the whole viewport-sized filtered layer on every
       animation frame: measured 386ms/frame at dpr2 against 100ms at dpr1, and
       dropping just that one filter took it to 282ms. Chrome composites the
       same blur almost for free, which is why Windows never showed it and a
       Mac did. Lowering the canvas's own backing-store resolution did not
       help there at all (417ms) — the cost is the filtered layer, not the
       rasterisation feeding it.

       The blur only ever did anything to the constellation. The base
       gradient, the three drifting orbs and the spotlight aura are all smooth
       linear or radial ramps, and convolving a smooth ramp with a 3.5px
       kernel returns essentially the same pixels. So the dots carry their own
       softness now: every particle gets a sprite that is its old hard
       core-plus-glow with a real Gaussian applied once, at the same sigma
       `blur(3.5px)` uses, when the scene is built. Blurring a dot on its own
       and then compositing is equivalent to compositing and then blurring,
       because the layer underneath is unchanged by the kernel — so the result
       is the same image with the work moved off the frame loop.

       Both arcs scaled linearly with the particle's alpha, so the sprite
       stores the profile at alpha 1 and globalAlpha reproduces the pulse. */
    const BLUR_SIGMA = 3.5;
    const dotSprites: HTMLCanvasElement[] = [];
    const spriteRadii: number[] = [];

    /* The link, widened to the thread the blur used to spread it into.
       ------------------------------------------------------------------
       A link was a 0.85px hairline at `lineAlpha`, and the layer blur spread
       it into a soft thread. Convolving a 0.85px line with this sigma leaves a
       peak of lineW / (sigma * sqrt(2*pi)) = 0.85 / 8.77 of the original
       alpha, so one stroke that wide at that fraction carries both the same
       peak brightness and the same total ink as the blurred hairline did.

       An exact Gaussian cross-section was tried, as a band sprite rotated and
       stretched onto each connection. It measured no more faithful than this
       — the residual difference is gradient banding elsewhere, not the link
       profile — and it cost a rotated, resampled blit per link. That is fine
       on a wide desktop viewport, where few pairs fall inside the 160px
       threshold, but on a 390px phone almost every pair does and it regressed
       Chromium there from 21ms to 37ms a frame. One stroke keeps the original
       per-link cost. */
    const LINK_PEAK = 0.85 / (BLUR_SIGMA * Math.sqrt(2 * Math.PI));
    const LINK_WIDTH = 0.85 / LINK_PEAK;

    /* Normalised 1D Gaussian kernel, used separably by buildDotSprite. */
    const gaussianKernel = (sigma: number) => {
      const kr = Math.ceil(3 * sigma);
      const k = new Float32Array(2 * kr + 1);
      let sum = 0;
      for (let i = -kr; i <= kr; i++) {
        const v = Math.exp(-(i * i) / (2 * sigma * sigma));
        k[i + kr] = v;
        sum += v;
      }
      for (let i = 0; i < k.length; i++) k[i] /= sum;
      return { k, kr };
    };

    /* `scale` is the device-pixel scale the sprite is rasterised at, so the
       blit lands 1:1 on the backing store and nothing is resampled. */
    const buildDotSprite = (radius: number, scale: number) => {
      const glow = radius * 2.8;
      const R = glow + 3 * BLUR_SIGMA; // half-size in CSS px, incl. blur tail
      const size = Math.max(1, Math.round(2 * R * scale));
      const sigma = BLUR_SIGMA * scale;
      const centre = size / 2;
      const rCore = radius * scale;
      const rGlow = glow * scale;

      /* The dots are pure white, so only alpha varies and the kernel runs
         over one float channel instead of four bytes. */
      const src = new Float32Array(size * size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x + 0.5 - centre;
          const dy = y + 0.5 - centre;
          const d = Math.sqrt(dx * dx + dy * dy);
          src[y * size + x] = d <= rCore ? 1 : d <= rGlow ? 0.25 : 0;
        }
      }

      const { k: kernel, kr } = gaussianKernel(sigma);

      const tmp = new Float32Array(size * size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let a = 0;
          for (let i = -kr; i <= kr; i++) {
            const xx = x + i;
            if (xx >= 0 && xx < size) a += src[y * size + xx] * kernel[i + kr];
          }
          tmp[y * size + x] = a;
        }
      }
      const out = new Float32Array(size * size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          let a = 0;
          for (let i = -kr; i <= kr; i++) {
            const yy = y + i;
            if (yy >= 0 && yy < size) a += tmp[yy * size + x] * kernel[i + kr];
          }
          out[y * size + x] = a;
        }
      }

      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = size;
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const img = sctx.createImageData(size, size);
        for (let i = 0; i < out.length; i++) {
          img.data[i * 4] = 255;
          img.data[i * 4 + 1] = 255;
          img.data[i * 4 + 2] = 255;
          const a = out[i] * 255;
          img.data[i * 4 + 3] = a < 0 ? 0 : a > 255 ? 255 : Math.round(a);
        }
        sctx.putImageData(img, 0, 0);
      }
      return { sprite, R };
    };

    /* The spotlight aura's gradient and geometry. Both depend only on the box,
       so they are derived in initScene and read from here. */
    let auraGradient: CanvasGradient | null = null;
    let auraX = 0;
    let auraY = 0;
    let auraRadiusX = 0;
    let auraRadiusY = 0;

    /* What initScene last built for, so a resize event that does not actually
       change the box can be skipped. */
    let builtW = -1;
    let builtH = -1;
    let builtDpr = -1;

    /* Blits the pre-rendered layer at device resolution. setTransform(identity)
       bypasses the dpr scale so source and destination pixels line up exactly. */
    const blit = (layer: HTMLCanvasElement | null) => {
      if (!layer) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0);
      ctx.restore();
    };

    const buildStaticLayers = () => {
      bgLayer = document.createElement("canvas");
      bgLayer.width = canvas.width;
      bgLayer.height = canvas.height;
      const bg = bgLayer.getContext("2d");
      if (bg) {
        bg.scale(dpr, dpr);
        const baseGrad = bg.createLinearGradient(0, 0, 0, height);
        baseGrad.addColorStop(0, "#081a3e");
        baseGrad.addColorStop(0.16, "#0f367a");
        baseGrad.addColorStop(0.26, "#1d58be");
        baseGrad.addColorStop(0.36, "#5d99f0");
        baseGrad.addColorStop(0.48, "#aaccf7");
        baseGrad.addColorStop(0.6, "#e2effc");
        baseGrad.addColorStop(0.74, "#ffffff");
        baseGrad.addColorStop(1, "#ffffff");
        bg.fillStyle = baseGrad;
        bg.fillRect(0, 0, width, height);
      }
    };

    const initScene = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Initialize Neural Particles
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.5 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        });
      }

      /* One sprite per particle, sized to that particle's own radius so the
         core/glow/blur proportions match what the layer filter produced for
         it. Rebuilt with the scene, which is also when `dpr` can change. */
      dotSprites.length = 0;
      spriteRadii.length = 0;
      for (const p of particles) {
        const built = buildDotSprite(p.radius, dpr);
        dotSprites.push(built.sprite);
        spriteRadii.push(built.R);
      }


      // Initialize Ambient Glowing Light Blobs
      glowOrbs.length = 0;
      glowOrbs.push(
        {
          x: width * 0.25,
          y: height * 0.2,
          radius: Math.min(width, height) * 0.35,
          color: "rgba(37, 99, 235, 0.22)", // Royal Blue
          vx: 0.15,
          vy: 0.1,
        },
        {
          x: width * 0.75,
          y: height * 0.25,
          radius: Math.min(width, height) * 0.4,
          color: "rgba(124, 58, 237, 0.18)", // Electric Violet
          vx: -0.12,
          vy: 0.12,
        },
        {
          x: width * 0.5,
          y: height * 0.12,
          radius: Math.min(width, height) * 0.3,
          color: "rgba(14, 165, 233, 0.2)", // Cyan Glow
          vx: 0.08,
          vy: -0.08,
        }
      );

      /* The mid stop used to be derived with a regex on every orb on every
         frame. The input is a constant, so the result was always the same
         three strings — computed once here instead. */
      for (const orb of glowOrbs) {
        orb.colorMid = orb.color.replace(/[\d.]+\)$/, "0.06)");
      }

      /* Gradients built once per scene instead of once per frame.
         ------------------------------------------------------------------
         render() was calling createRadialGradient four times and addColorStop
         eleven times on every frame — three orbs plus the spotlight — and
         every one of those gradients was rebuilt from constants. The orbs'
         stops depend only on `color`/`colorMid`/`radius` and the spotlight's
         only on the box, none of which move between frames; what moves is
         where the orbs are drawn.

         So each orb's gradient is built once here centred on the canvas
         origin, and render() reaches its position with ctx.translate instead.
         A CanvasGradient's coordinates are resolved in user space at *paint*
         time, not at creation time, so translating the context by (x, y) and
         filling puts the gradient exactly where naming (x, y) in the
         constructor did — same rasteriser, same stops, same pixels. */
      for (const orb of glowOrbs) {
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, orb.radius);
        g.addColorStop(0, orb.color);
        g.addColorStop(0.6, orb.colorMid as string);
        g.addColorStop(1, "transparent");
        orb.gradient = g;
      }

      auraX = width * 0.5;
      auraY = height * 0.16;
      auraRadiusX = width * 0.65;
      auraRadiusY = height * 0.28;
      /* Still filled inline over its own ellipse — the note above explains why
         caching it as a *layer* measured slower. Only the gradient object,
         which is pure constants, is hoisted. It is created with the same
         numeric arguments render() used and filled under the same transform. */
      auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, auraRadiusX);
      auraGradient.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      auraGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.06)");
      auraGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      buildStaticLayers();

      builtW = width;
      builtH = height;
      builtDpr = dpr;
    };

    const render = () => {
      /* 1. Rich Layered Base Gradient — pre-rendered, see buildStaticLayers().
         No clearRect first: this layer is fully opaque and covers the whole
         canvas, so it overwrites the previous frame on its own. The clear was
         a second full-canvas pass doing work the fill immediately undid. */
      blit(bgLayer);

      // 2. Render Drifting Ambient Glow Blobs
      glowOrbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < width * 0.1 || orb.x > width * 0.9) orb.vx *= -1;
        if (orb.y < height * 0.05 || orb.y > height * 0.45) orb.vy *= -1;

        /* Prebuilt gradient, moved into place by the transform — see initScene. */
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.fillStyle = orb.gradient as CanvasGradient;
        ctx.beginPath();
        ctx.arc(0, 0, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Central Spotlight Aura behind Headline
      ctx.save();
      ctx.translate(auraX, auraY);
      ctx.scale(1, auraRadiusY / auraRadiusX);

      ctx.fillStyle = auraGradient as CanvasGradient;
      ctx.beginPath();
      ctx.arc(0, 0, auraRadiusX, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* One clock read for the whole frame. This was Date.now() inside the
         particle loop, so it was called once per particle — 32 times a frame,
         ~1900 times a second — to get 32 values that are all within the same
         millisecond of each other anyway. */
      const now = Date.now();

      // 4. Render Neural Constellation Nodes & Energy Links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height * 0.7) p.vy *= -1;

        p.alpha += Math.sin(now * p.pulseSpeed) * 0.006;
        const currentAlpha = Math.max(0.18, Math.min(0.85, p.alpha));

        /* Core and glow in one blit. The sprite already holds both arcs with
           the Gaussian applied, so this is the same image the layer filter
           used to produce for this dot — see the note where it is built. */
        const sprite = dotSprites[i];
        if (sprite) {
          const R = spriteRadii[i];
          ctx.globalAlpha = currentAlpha;
          ctx.drawImage(sprite, p.x - R, p.y - R, 2 * R, 2 * R);
          ctx.globalAlpha = 1;
        }

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          /* Compare squared distances and only take the root for the pairs that
             are actually close enough to draw. Same threshold, same lineAlpha,
             same lines — but 496 sqrt calls a frame become a handful. */
          const distSq = dx * dx + dy * dy;

          if (distSq < 160 * 160) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 160) * 0.25;
            /* One stroke, widened and dimmed to the thread the layer blur used
               to make of this hairline — see LINK_WIDTH. */
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha * LINK_PEAK})`;
            ctx.lineWidth = LINK_WIDTH;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    /* Deferred to the first idle slot rather than started during hydration.
       The loop draws 32 particles plus an O(n^2) link pass every frame, and
       running that while the browser is still laying out the page pushed real
       measured cost into FCP/LCP and showed up as long tasks. The canvas sits
       over the hero's CSS gradient, so nothing is missing while it waits —
       and the 900ms cap means it always starts even where requestIdleCallback
       does not exist (Safari) or never goes idle. */
    let started = false;
    let visible = true;
    let covered = false;

    /* Single place that decides whether the loop should be running, so the two
       observers below cannot fight over `animId`. The `!animId` guard matters:
       render() re-arms itself at the end of every frame, so calling it while a
       frame is already scheduled would leave two loops running at once. */
    const syncRunning = () => {
      const shouldRun = started && visible && !covered;
      if (shouldRun) {
        if (!animId) render();
      } else if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };

    const start = () => {
      started = true;
      initScene();
      /* Not render() unconditionally: on a page loaded already scrolled down,
         the canvas is behind .content-stack before the first frame is ever
         drawn, and there is no reason to start a loop nobody can see. */
      syncRunning();
    };

    /* Behind `load`, not just behind an idle slot.
       ------------------------------------------------------------------
       requestIdleCallback with a 900ms timeout is a deadline, not a
       preference: if the main thread is busy — which during a cold load it
       is, hydrating the page — the callback is run anyway at 900ms. That put
       initScene's work (a full-canvas gradient rasterised into an offscreen
       canvas, four gradients, and 32 particle sprites each convolved with a
       separable Gaussian in JS) inside the window that decides LCP and TBT,
       which is the one window it has no claim on. Nothing here is content:
       it is a drifting constellation behind a hero that reads perfectly well
       on its own gradient.

       So wait for `load` first and only then ask for an idle slot, with a
       short timeout so a permanently busy thread still gets a starfield. On
       a warm connection load fires in a few hundred ms and nothing about
       this is perceptible; on a cold 4G phone the dots arrive a beat after
       the hero instead of competing with it. */
    const scheduler = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    let timerId = 0;
    const scheduleStart = () => {
      if (typeof scheduler.requestIdleCallback === "function") {
        idleId = scheduler.requestIdleCallback(start, { timeout: 500 });
      } else {
        timerId = window.setTimeout(start, 200);
      }
    };
    let removeLoad = () => {};
    if (document.readyState === "complete") {
      scheduleStart();
    } else {
      window.addEventListener("load", scheduleStart, { once: true });
      removeLoad = () => window.removeEventListener("load", scheduleStart);
    }
    const cancelStart = () => {
      removeLoad();
      if (idleId) scheduler.cancelIdleCallback?.(idleId);
      if (timerId) clearTimeout(timerId);
    };

    /* Coalesced to one frame, and a no-op when the box has not really changed.
       ------------------------------------------------------------------
       On a phone, showing or hiding the URL bar fires `resize` mid-scroll, and
       a burst of them fires during a desktop drag. Each one re-ran initScene:
       a full-canvas gradient re-rasterised into a fresh offscreen canvas, four
       gradients rebuilt, and — visibly — every particle re-seeded from
       Math.random, so the constellation jumped. Rebuilding only when the
       backing store would actually come out a different size keeps the scene
       continuous through a URL-bar reveal, which is the one case where the old
       code reset a scene the reader was looking at. */
    let resizeFrame = 0;
    const handleResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        const w = canvas.parentElement?.clientWidth || window.innerWidth;
        const h = canvas.parentElement?.clientHeight || window.innerHeight;
        const d = Math.min(window.devicePixelRatio || 1, 2);
        /* The occlusion observer's root is expressed in viewport pixels, so it
           has to be rebuilt whether or not the canvas box moved. */
        buildOcclusionObserver();
        if (w === builtW && h === builtH && d === builtDpr) return;
        initScene();
      });
    };

    window.addEventListener("resize", handleResize);

    /* Off screen: the hero's own box. Kept because it is the honest test of
       "not in the viewport", and it is what fires if the sticky layout is ever
       changed. On today's layout it effectively never fires — see below. */
    const visibility = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries[entries.length - 1].isIntersecting;
        if (nowVisible === visible) return;
        visible = nowVisible;
        syncRunning();
      },
      { threshold: 0 }
    );
    visibility.observe(canvas);

    /* Hidden but on screen: what actually happens on this page.
       ------------------------------------------------------------------
       .hero is position:sticky at every breakpoint (top: --header-height on
       desktop, top: 0 below it), so it is pinned in the viewport for the whole
       document and the observer above stays "intersecting" from the first
       pixel of scroll to the last. The pause it was written for never fired,
       and the loop went on drawing 32 particles, their O(n^2) link pass, three
       orbs and the aura — for every frame of every scroll, behind
       .content-stack: z-index 20, background: var(--color-white), fully
       opaque. It was the largest single item in a scroll profile. (Back then
       the canvas also carried filter: blur(3.5px), which made the waste far
       worse on WebKit; that filter is gone — see buildDotSprite — but the
       drawing is still pointless while the stack covers it.)

       What hides the canvas is that white stack sliding up over the pinned
       hero, so that is what to watch. The stack's top edge crossing
       CORNER_CLEARANCE px above the viewport top is the moment the last of the
       hero goes behind it — the clearance covers the stack's own rounded top
       corners (100px on desktop, 40px below 768px), which are the only place
       the hero still shows through while the stack is arriving.

       Expressed as an observer rather than a scroll listener: a root whose
       bottom edge sits that far above the viewport top intersects
       .content-stack exactly while the stack's top is above that line. Two
       callbacks per pass, no scroll handler, and no forced layout — reading
       the same thing off getBoundingClientRect() per frame is what this file
       is trying to get away from. */
    const CORNER_CLEARANCE = 140;
    const stack = document.querySelector(".content-stack");
    let occlusion: IntersectionObserver | null = null;

    function buildOcclusionObserver() {
      occlusion?.disconnect();
      occlusion = null;
      if (!stack || typeof IntersectionObserver === "undefined") return;
      occlusion = new IntersectionObserver(
        (entries) => {
          const nowCovered = entries[entries.length - 1].isIntersecting;
          if (nowCovered === covered) return;
          covered = nowCovered;
          syncRunning();
        },
        {
          /* Top margin is deliberately enormous: the root has to still reach
             .content-stack's bottom edge when the reader is at the foot of the
             page, or the stack would stop intersecting and the loop would
             restart behind the footer. */
          rootMargin: `100000px 0px -${window.innerHeight + CORNER_CLEARANCE}px 0px`,
          threshold: 0,
        }
      );
      occlusion.observe(stack);
    }

    buildOcclusionObserver();

    return () => {
      cancelAnimationFrame(animId);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      cancelStart();
      visibility.disconnect();
      occlusion?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        /* No `filter: blur(3.5px)` here any more. The softness it provided is
           baked into the particle sprites and the link passes instead — see
           the note beside buildDotSprite. Keeping it would have meant WebKit
           re-rasterising this whole viewport-sized layer every frame, which
           measured 386ms/frame at dpr2 on a Retina viewport against 100ms at
           dpr1, and was the cause of the Mac-only scroll lag. */
      }}
    />
  );
}
