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

    /* Everything checks out. There is no endpoint on this form yet, so there is
       deliberately no success message here: telling someone their enquiry was
       sent when nothing was sent is worse than telling them nothing. Wire the
       submit to an API route and the call goes here. */
    setError("");
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
