"use client";

import React, { useEffect, useRef } from "react";
import { live } from "@/lib/site-config";

/* Full-bleed "Fulminous AI" band, in the slot the Upwork / Trustpilot /
   GoodFirms review row used to hold.

   ------------------------------------------------------------------
   THE SCENE IS THE ANIMATION
   ------------------------------------------------------------------
   The band's left side is the supplied clip — two robots working a holographic
   dashboard on a lit platform, the floor's circuit traces pulsing outward —
   running muted on a loop behind the design's navy. It is the whole of the
   artwork's motion, so nothing here tries to re-time it: the clip plays itself
   and the component only decides when it is worth playing.

     * nothing is fetched until the reader is within a screen of the band. The
       clip is 2.6MB and the band sits well down the page; loading it with the
       document would be paying for it whether or not anyone scrolls that far.
     * it plays while the band is on screen and pauses the moment it is not, so
       a clip nobody is looking at is not decoding frames.
     * under prefers-reduced-motion it is never fetched at all. The <video>
       carries a poster frame, so that reader gets the scene as a still and the
       band costs 70KB instead of 2.6MB.

   THE BAND HAS TWO MOMENTS OF ITS OWN
   ------------------------------------------------------------------
   1  the entrance, whenever the band comes into view. The scene fades up out of
      a push-in, the chevron's edge cuts in from the right with the white panel
      just behind it, light runs across the scene and then along that edge, the
      tip blooms where the two diagonals meet, and the copy arrives over the top
      of it — eyebrow card, headline a line at a time, lead, buttons.

   2  first touch: a pointer entering the band, a tap, a click, or a keyboard
      reaching the CTAs. The band regenerates in sequence rather than flashing —
      the edge takes the light, a pass crosses the scene, the tip blooms, and the
      copy comes back through blur a line at a time behind it.

   AND IT GOES BACK OUT AGAIN
   ------------------------------------------------------------------
   Both classes come off when the band leaves the viewport, so the whole thing
   fades back to where it started and the next arrival plays it again — and can
   be answered again. The stylesheet does the reversing: the held-back state
   carries its own short, flat timing, so going out is one half-second fade rather
   than the entrance's sequence run backwards.

   The hysteresis matters more than it looks. .is-in goes on at 22% of the band
   on screen and comes off only once the band is out of view altogether, so a
   reader parked with the band's edge in shot cannot make the copy flicker.

   On a device with no pointer there is nothing to enter the band, and asking for
   a tap on something that is not a button is a dead end — so there the second
   moment plays itself, a beat after the entrance has finished.

   THE COPY IS NOT PART OF THAT REVEAL WITHOUT JAVASCRIPT
   ------------------------------------------------------------------
   The hidden state lives behind an `is-armed` class that only JavaScript adds,
   so with scripts off or a failed hydration the copy is simply visible.

   GEOMETRY
   ------------------------------------------------------------------
   The white panel and the lighter shape behind it are the same chevron, cut with
   one clip-path they both read (--ai-chev in the stylesheet) and offset from each
   other. The chevron's tip is a percentage of the band so it keeps its place in
   the composition at any width, and the run out to its shoulders is in pixels so
   the diagonals hold their pitch instead of flattening out on a wide screen. The
   eyebrow card is a sibling of the panel, not a child: the panel's clip-path
   would cut it in half at the diagonal it is supposed to straddle. */

const SCENE_SRC = "/next-assets/fulminous-ai-scene.mp4";

/* Ratio of the band on screen at which the reveal fires and the clip starts.
   Below it the band is not yet worth playing; the clip only pauses once the band
   has left altogether, so a band sitting near the edge cannot stutter between
   the two states. */
const ENTER_RATIO = 0.22;

/* How long after the entrance the answer-to-touch plays itself where there is no
   pointer to give it. Long enough that the two do not run into each other — the
   entrance's own light is still finishing at 2.3s. */
const HOVERLESS_WAKE_DELAY = 2600;

export function FulminousAiBanner() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverless = window.matchMedia("(hover: none)");

    /* React sets `muted` as a property rather than an attribute, and an unmuted
       clip is refused autoplay outright — so it is set again here, where the
       element itself can be reached. */
    const video = videoRef.current;
    if (video) video.muted = true;

    const load = () => {
      if (!video || video.src || motion.matches) return;
      video.src = SCENE_SRC;
      video.load();
    };

    const play = () => {
      if (!video || motion.matches) return;
      load();
      /* Autoplay can still be refused — a data-saver setting, a policy this page
         does not know about. The poster frame is already showing, so a refusal
         costs the motion and nothing else. */
      const started = video.play();
      if (started && typeof started.catch === "function") started.catch(() => {});
    };

    const pause = () => {
      if (video && !video.paused) video.pause();
    };

    /* The answer to being touched. Once per visit to the band: the listeners stay
       attached, and `woken` is what stops a second pointerenter replaying it —
       reset when the band leaves so the next arrival can be answered too. Under
       reduced motion it is not worth arming at all; the stylesheet has nothing
       for it to play. */
    let wakeTimer = 0;
    let woken = false;

    const wake = () => {
      window.clearTimeout(wakeTimer);
      wakeTimer = 0;
      if (motion.matches || woken) return;
      woken = true;
      /* A reader who reaches the band with the keyboard, or taps it, before it
         has been seen still gets the entrance first — the class the light hangs
         off is the same one. */
      el.classList.add("is-in");
      el.classList.add("is-woken");
      play();
    };

    if (!motion.matches) {
      /* pointerenter rather than mouseenter so pen and touch report through the
         same path, and focusin so a keyboard reaching the CTAs counts. */
      el.addEventListener("pointerenter", wake);
      el.addEventListener("pointerdown", wake);
      el.addEventListener("focusin", wake);
    }

    /* Out of view: the stylesheet takes the band back to its held-back state, the
       clip stops decoding frames nobody is watching, and the answer-to-touch is
       re-armed for the next arrival.

       The two classes come off on separate frames, and that is not fussiness. The
       copy's opacity is held by a *keyframe* while .is-woken is on, and dropping
       an animation is not something CSS can transition from — take both classes
       at once and the text vanishes instantly instead of fading. Taking .is-woken
       first hands the copy back to .is-in, which is holding it at the same
       opacity, so nothing moves; .is-in coming off a frame later is then an
       ordinary transition and it fades. */
    let unwind = 0;

    const leave = () => {
      window.clearTimeout(wakeTimer);
      wakeTimer = 0;
      woken = false;
      el.classList.remove("is-woken");
      cancelAnimationFrame(unwind);
      unwind = requestAnimationFrame(() => {
        unwind = 0;
        el.classList.remove("is-in");
      });
      pause();
    };

    /* Fetching starts a screen early, so the first frame is decoded by the time
       the band arrives rather than the reader watching the poster swap. */
    const near =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (!entries.some((entry) => entry.isIntersecting)) return;
              load();
              near?.disconnect();
            },
            { rootMargin: "500px 0px" }
          );

    const io =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[entries.length - 1];

              if (entry.intersectionRatio >= ENTER_RATIO) {
                cancelAnimationFrame(unwind);
                unwind = 0;
                el.classList.add("is-in");
                play();

                /* HOVERLESS: no pointer to enter the band, so the second moment
                   is played for the reader once the entrance has landed. */
                if (hoverless.matches && !woken && !wakeTimer) {
                  wakeTimer = window.setTimeout(wake, HOVERLESS_WAKE_DELAY);
                }
              } else if (!entry.isIntersecting) {
                leave();
              }
            },
            { threshold: [0, ENTER_RATIO, 0.6] }
          );

    if (near && io) {
      near.observe(el);
      io.observe(el);
    } else {
      /* No IntersectionObserver: show the band finished and let the clip run. */
      el.classList.add("is-in");
      play();
    }

    /* Only now is the reveal under JavaScript's control; without this class the
       stylesheet leaves the copy plainly visible. */
    el.classList.add("is-armed");

    /* Turning reduced motion on mid-visit stops the clip where it stands and
       leaves the poster frame in its place. */
    const onMotionChange = () => {
      if (motion.matches) pause();
      else if (el.classList.contains("is-in")) play();
    };
    motion.addEventListener("change", onMotionChange);

    return () => {
      near?.disconnect();
      io?.disconnect();
      motion.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(unwind);
      window.clearTimeout(wakeTimer);
      el.removeEventListener("pointerenter", wake);
      el.removeEventListener("pointerdown", wake);
      el.removeEventListener("focusin", wake);
      pause();
      el.classList.remove("is-in", "is-armed", "is-woken");
    };
  }, []);

  return (
    <section className="ai-banner" ref={ref} aria-labelledby="ai-banner-title">
      {/* The scene. `isolation: isolate` on this element in the stylesheet is
          what keeps the tint's blend inside the band. */}
      <div className="ai-banner__scene" aria-hidden="true">
        <video
          ref={videoRef}
          className="ai-banner__video"
          poster="/next-assets/fulminous-ai-scene.webp"
          preload="none"
          muted
          loop
          playsInline
          disablePictureInPicture
          tabIndex={-1}
        />
        {/* Hue and saturation only, so the clip's cool teal reads as the design's
            royal blue without losing any of the scene's detail. */}
        <span className="ai-banner__tint" />
        <span className="ai-banner__vignette" />
        {/* A light pass across the scene: once on entry, once on first touch. */}
        <span className="ai-banner__scan" />
      </div>

      {/* The eyebrow, on its own card, straddling the chevron. Sits before the
          panel in the source so that when the band stacks on narrow screens it
          lands between the scene and the copy with no repositioning. */}
      <p className="ai-banner__tab">Fulminous AI</p>

      {/* The lighter chevron, offset out from the panel so a band of it shows
          along the diagonals. It also carries the glint that runs along them. */}
      <span className="ai-banner__edge" aria-hidden="true" />

      {/* The bloom at the chevron's point. After the edge and before the panel, so
          its right half is covered and the light reads as coming off the tip. */}
      <span className="ai-banner__pulse" aria-hidden="true" />

      <div className="ai-banner__panel">
        <div className="ai-banner__inner">
          <div className="ai-banner__content">
            {/* A block per line rather than a <br>: each one arrives on its own
                beat, going in and again on first touch. */}
            <h2 className="ai-banner__title" id="ai-banner-title">
              <span className="ai-banner__line">Smarter Systems,</span>
              <span className="ai-banner__line">Built Around Your Business.</span>
            </h2>

            <p className="ai-banner__lead">
              Fulminous helps businesses adopt practical AI &mdash; chatbots, intelligent
              automation, and data-driven decision systems that plug straight into the
              workflows and tools your teams already use.
            </p>

            <div className="ai-banner__actions">
              {/* The advisory session is the contact form already on this page;
                  the second link goes to the AI page on the live site, which is
                  the same destination the Services menu uses. */}
              <a className="ai-banner__btn ai-banner__btn--primary" href="#contact">
                Book Your AI Advisory Session
              </a>
              <a
                className="ai-banner__btn ai-banner__btn--ghost"
                href={live("/enterprise-ai-development-company")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discover Fulminous AI
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
