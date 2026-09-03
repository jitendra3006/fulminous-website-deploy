"use client";

import React from "react";

/**
 * The captcha and the submit button for the Get in Touch form.
 *
 * This is its own client component on purpose. Contact.tsx has no "use client"
 * and so its three fields are server-rendered and cost the browser no
 * JavaScript; a captcha needs state, and putting it there would have pulled the
 * whole section into the client bundle. Only this piece ships as script.
 *
 * No third-party captcha. reCAPTCHA and hCaptcha both need a site key this
 * project does not have, and both add a cross-origin request and a CSP
 * exception to a page whose payload was just cut by 50KB. The challenge below
 * is drawn locally and costs nothing over the network.
 *
 * Two challenges, not one. The canvas is what people expect a captcha to look
 * like, but a distorted image is unreadable to anyone using a screen reader
 * and cannot be made otherwise without an audio track. So the canvas is
 * aria-hidden and there is a switch to a plain arithmetic question, which is
 * real text, announces correctly, and blocks the same naive submissions. The
 * switch is a button in the tab order, not a hidden affordance.
 *
 * What this can and cannot do: a check that runs in the browser stops casual
 * bots and nothing else, because anything determined enough to read the DOM can
 * read the answer with it. Real protection is a server-side verification on
 * whatever endpoint eventually receives this form — and there is no endpoint
 * yet, so today this gates a button that does not submit anywhere.
 */

/* 1, I, l, 0 and O are left out — telling them apart in a distorted render is
   a test of the font, not of the reader. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

/* The twelve confetti pieces. Each one is a destination relative to the centre
   of the line, a turn to make on the way there, a colour and a tiny offset off
   the start; one keyframe in globals.css reads them as custom properties, so
   twelve trajectories cost one animation.

   Hand-placed rather than randomised: Math.random here would give the server
   and the client different values and break hydration, and a fixed spread beats
   most random ones anyway — this one fans wider than it is tall and throws
   more pieces up than down, which is what a popper does.

   Three colours, all already on the page: white and the pale warm tone the
   panel's own error line uses, plus --color-accent, which is the orange in the
   section heading above. Nothing here introduces a colour the design does not
   already have.

   Delays span 90ms, not zero: a burst where every piece leaves on the same
   frame looks mechanical, and 90ms is short enough to still read as one event. */
const CONFETTI = [
  { dx: "-88px", dy: "-34px", spin: "-160deg", c: "#ffffff", delay: "0ms" },
  { dx: "-64px", dy: "-58px", spin: "120deg", c: "var(--color-accent)", delay: "40ms" },
  { dx: "-38px", dy: "-72px", spin: "-90deg", c: "#ffe3b0", delay: "10ms" },
  { dx: "-14px", dy: "-80px", spin: "200deg", c: "#ffffff", delay: "70ms" },
  { dx: "14px", dy: "-78px", spin: "-140deg", c: "var(--color-accent)", delay: "20ms" },
  { dx: "40px", dy: "-68px", spin: "170deg", c: "#ffffff", delay: "60ms" },
  { dx: "66px", dy: "-54px", spin: "-110deg", c: "#ffe3b0", delay: "30ms" },
  { dx: "90px", dy: "-30px", spin: "150deg", c: "var(--color-accent)", delay: "80ms" },
  { dx: "-76px", dy: "22px", spin: "-130deg", c: "#ffe3b0", delay: "50ms" },
  { dx: "-30px", dy: "34px", spin: "100deg", c: "#ffffff", delay: "90ms" },
  { dx: "32px", dy: "32px", spin: "-180deg", c: "var(--color-accent)", delay: "0ms" },
  { dx: "78px", dy: "20px", spin: "140deg", c: "#ffffff", delay: "50ms" },
];

type Mode = "image" | "question";

function randomCode() {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return out;
}

function randomSum() {
  const a = 2 + Math.floor(Math.random() * 8);
  const b = 2 + Math.floor(Math.random() * 8);
  return { a, b, answer: String(a + b) };
}

/* Draws the code onto the canvas: each glyph on its own baseline and rotation,
   over a few arcs, so the shapes do not sit on a straight line a naive parser
   can slice. Deliberately mild — a captcha a person cannot read is a contact
   form that loses enquiries. */
function paint(canvas: HTMLCanvasElement, code: string) {
  const ratio = window.devicePixelRatio || 1;
  const w = 168;
  const h = 52;
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(ratio, ratio);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(22, 74, 158, 0.25)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * h);
    ctx.bezierCurveTo(w * 0.3, Math.random() * h, w * 0.6, Math.random() * h, w, Math.random() * h);
    ctx.stroke();
  }

  const step = w / (CODE_LENGTH + 1);
  for (let i = 0; i < code.length; i++) {
    const ch = code.charAt(i);
    ctx.save();
    ctx.translate(step * (i + 1), h / 2 + (Math.random() * 8 - 4));
    ctx.rotate((Math.random() * 24 - 12) * (Math.PI / 180));
    ctx.font = "700 26px Poppins, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = i % 2 === 0 ? "#164a9e" : "#0f2e70";
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = "rgba(22, 74, 158, 0.35)";
  for (let i = 0; i < 40; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
}

export function ContactCaptcha() {
  const [mode, setMode] = React.useState<Mode>("image");
  const [code, setCode] = React.useState("");
  const [sum, setSum] = React.useState(() => ({ a: 0, b: 0, answer: "" }));
  const [entry, setEntry] = React.useState("");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const issue = React.useCallback((next: Mode) => {
    setEntry("");
    setError("");
    if (next === "image") {
      const c = randomCode();
      setCode(c);
      /* The canvas may not be mounted on the very first issue, so painting is
         driven by the effect below rather than from here. */
    } else {
      setSum(randomSum());
    }
  }, []);

  /* First challenge, once, on mount — Math.random on the server would give the
     client a different answer than the markup it hydrated. */
  React.useEffect(() => {
    issue("image");
  }, [issue]);

  React.useEffect(() => {
    if (mode === "image" && code && canvasRef.current) paint(canvasRef.current, code);
  }, [mode, code]);

  const expected = mode === "image" ? code : sum.answer;

  function handleSubmit() {
    const name = document.querySelector<HTMLInputElement>("#contact-name");
    const email = document.querySelector<HTMLInputElement>("#contact-email");
    const brief = document.querySelector<HTMLTextAreaElement>("#contact-brief");

    if (!name?.value.trim()) { setError("Please add your name."); name?.focus(); return; }
    if (!email?.value.trim()) { setError("Please add your work email."); email?.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      setError("That email address does not look right."); email.focus(); return;
    }
    if (!brief?.value.trim()) { setError("Please tell us a little about the project."); brief?.focus(); return; }

    if (!entry.trim()) { setError("Please complete the check below."); return; }
    if (entry.trim().toUpperCase() !== expected.toUpperCase()) {
      setError("That did not match. Here is a new one.");
      if (mode === "image") { const c = randomCode(); setCode(c); } else { setSum(randomSum()); }
      setEntry("");
      return;
    }

    /* Everything checks out. The confirmation below is UI only — there is still
       no endpoint on this form, so nothing has left the browser at this point.
       Wire the submit to an API route and the call goes here, before setSent,
       so the message follows a real response rather than standing in for one. */
    setError("");
    setSent(true);
  }

  /* Once it has been sent, the challenge and the button have nothing left to
     do, so the confirmation takes their place rather than stacking under them.
     role="status" on the line itself: it appears in response to a press, and a
     polite live region is what announces that without stealing focus. */
  if (sent) {
    return (
      <p className="contact__thanks" role="status" aria-live="polite">
        <span className="contact__thanks-confetti" aria-hidden="true">
          {CONFETTI.map((piece, i) => (
            <span
              key={i}
              className="contact__thanks-piece"
              style={
                {
                  "--dx": piece.dx,
                  "--dy": piece.dy,
                  "--spin": piece.spin,
                  "--c": piece.c,
                  "--delay": piece.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
        Thanks for your query
      </p>
    );
  }

  return (
    <>
      <div className="contact__field contact__captcha">
        <label className="contact__label" htmlFor="contact-captcha">
          {mode === "image"
            ? "Type the characters you see"
            : `What is ${sum.a} + ${sum.b}?`}
        </label>

        <div className="contact__captcha-row">
          {mode === "image" ? (
            <canvas
              ref={canvasRef}
              className="contact__captcha-canvas"
              /* The distorted glyphs are not readable content — the label above
                 carries the instruction and the question mode carries the
                 accessible challenge. */
              aria-hidden="true"
            />
          ) : null}

          <input
            className="contact__input contact__captcha-input"
            id="contact-captcha"
            name="captcha"
            type="text"
            inputMode={mode === "image" ? "text" : "numeric"}
            autoComplete="off"
            spellCheck={false}
            maxLength={mode === "image" ? CODE_LENGTH : 3}
            placeholder={mode === "image" ? "e.g. 4KQ7M" : "Your answer"}
            value={entry}
            onChange={(e) => { setEntry(e.target.value); if (error) setError(""); }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "contact-captcha-error" : undefined}
          />

          <button
            type="button"
            className="contact__captcha-refresh"
            onClick={() => (mode === "image" ? issue("image") : setSum(randomSum()))}
            aria-label="Get a different challenge"
            title="Get a different challenge"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="contact__captcha-alt"
          onClick={() => {
            const next: Mode = mode === "image" ? "question" : "image";
            setMode(next);
            issue(next);
            if (next === "question") setSum(randomSum());
          }}
        >
          {mode === "image" ? "Can’t read it? Answer a question instead" : "Show the picture instead"}
        </button>

        {/* aria-live so the message is announced when it appears rather than
            only being visible. */}
        <p
          className="contact__captcha-error"
          id="contact-captcha-error"
          role="status"
          aria-live="polite"
        >
          {error}
        </p>
      </div>

      <button className="contact__submit" type="button" onClick={handleSubmit}>
        Get Free Proposal
      </button>
    </>
  );
}
