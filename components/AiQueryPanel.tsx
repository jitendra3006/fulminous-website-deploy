"use client";

import React, { useState, useEffect, useRef } from "react";

interface AiQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

/**
 * Inline expansion of the sticky "Ask anything..." dock — not a modal.
 *
 * It replaces the collapsed pill in place, at the same spot on screen, with no
 * backdrop, no overlay and no body scroll lock: the page behind stays fully
 * visible and scrollable, the way an expanding comment box behaves.
 *
 * The ai-modal-* class names are kept on the inner fields so the existing
 * input, textarea and button styling carries over untouched; only the wrapper
 * differs.
 */
export function AiQueryPanel({ isOpen, onClose, initialQuery = "" }: AiQueryPanelProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef<HTMLTextAreaElement>(null);

  // Re-measure on every keystroke: reset to auto first so the box can shrink
  // again when text is deleted, then take the content's own height.
  useEffect(() => {
    const el = queryRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialQuery) setQuery(initialQuery);
    setIsAnimatingOut(false);
    setStatus("idle");
    const timer = setTimeout(() => nameInputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      onClose();
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        handleClose();
        setName("");
        setEmail("");
        setQuery("");
        setStatus("idle");
      }, 1400);
    }, 900);
  };

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div className="ai-panel-dock">
      <div
        className={`ai-panel ${isAnimatingOut ? "is-closing" : "is-opening"}`}
        role="region"
        aria-label="Ask anything"
      >
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            {/* The heading is gone — the bar at the foot of the panel already
                says "Ask anything...", so repeating it up here read as a
                duplicate. The sparkle cluster that sat beside it is gone too:
                with the heading removed it was decorating a single line of
                small grey text, and the same cluster is already on the bar at
                the foot of the panel. Only the one-line intro stays. */}
            <div>
              <p className="ai-modal-subtitle">
                Tell us about your project and we'll guide you.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ai-modal-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ai-modal-form">
          <div className="ai-modal-field">
            <div className="ai-modal-input-wrap">
              <span className="ai-modal-field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                ref={nameInputRef}
                type="text"
                className="ai-modal-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="ai-modal-field">
            <div className="ai-modal-input-wrap">
              <span className="ai-modal-field-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                className="ai-modal-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Feedback sits above the bar, not below it: anything underneath
              would shove the bar off its spot the moment it appeared. */}
          {status !== "idle" && (
            <div className={`ai-panel-status is-${status}`} role="status">
              {status === "loading" ? (
                <>
                  <span className="ai-modal-spinner" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Query Submitted Successfully
                </>
              )}
            </div>
          )}

          {/* The description box is gone: the dock's own "Ask anything..." bar
              takes its place, unchanged — same sparkle, same input, same send
              arrow. It is a plain div here rather than a form (a form cannot
              nest inside one) and its button submits this panel. It is the last
              thing in the panel, and the panel is pinned by its bottom edge, so
              this row keeps its place on screen no matter how the form grows. */}
          <div className="ai-panel-search">
            <span className="hero__search-spark" aria-hidden="true">
              <svg className="search-sparkles-svg" viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="ai-badge-star ai-badge-star--purple" d="M16 4 C16.5 8 18.5 10 22.5 10.5 C18.5 11 16.5 13 16 17 C15.5 13 13.5 11 9.5 10.5 C13.5 10 15.5 8 16 4 Z" fill="#7e22ce" />
                <path className="ai-badge-star ai-badge-star--pink" d="M16 26 C16.3 28.5 17.8 30 20.3 30.3 C17.8 30.6 16.3 32.1 16 34.6 C15.7 32.1 14.2 30.6 11.7 30.3 C14.2 30 15.7 28.5 16 26 Z" fill="#be185d" />
                <path className="ai-badge-star ai-badge-star--blue" d="M36 11 C36.7 17 39.7 20 45.7 20.7 C39.7 21.4 36.7 24.4 36 30.4 C35.3 24.4 32.3 21.4 26.3 20.7 C32.3 20 35.3 17 36 11 Z" fill="#1e40af" />
              </svg>
            </span>
            {/* A textarea, not an input: the text has to stay readable as it is
                typed rather than scrolling out of sight inside one line. It
                grows a line at a time, and since the panel is pinned by its
                bottom edge, the whole form rises with it. */}
            <textarea
              ref={queryRef}
              className="hero__search-input ai-panel-search-input"
              rows={1}
              placeholder="Ask anything..."
              aria-label="Ask anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends, as it would from the dock's pill; Shift+Enter
                // is the way to add a line.
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              required
            />
            <button
              className="hero__search-send"
              type="submit"
              aria-label="Send message"
              disabled={status === "loading" || status === "success"}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="none" stroke="#164a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
