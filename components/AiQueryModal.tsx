"use client";

import React, { useState, useEffect, useRef } from "react";

interface AiQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function AiQueryModal({ isOpen, onClose, initialQuery = "" }: AiQueryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync initialQuery and handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      if (initialQuery) setQuery(initialQuery);
      setIsAnimatingOut(false);
      setStatus("idle");
      document.body.style.overflow = "hidden";
      setTimeout(() => nameInputRef.current?.focus(), 120);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialQuery]);

  // Handle ESC Key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
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
    }, 220);
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
    <div
      className={`ai-modal-backdrop ${isAnimatingOut ? "is-closing" : "is-opening"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div
        className={`ai-modal-card ${isAnimatingOut ? "is-closing" : "is-opening"}`}
      >
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-header-left">
            <span className="ai-modal-sparkle-icon" aria-hidden="true">
              <svg className="modal-sparkles-svg" viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="ai-badge-star ai-badge-star--purple" d="M16 4 C16.5 8 18.5 10 22.5 10.5 C18.5 11 16.5 13 16 17 C15.5 13 13.5 11 9.5 10.5 C13.5 10 15.5 8 16 4 Z" fill="#7e22ce" />
                <path className="ai-badge-star ai-badge-star--pink" d="M16 26 C16.3 28.5 17.8 30 20.3 30.3 C17.8 30.6 16.3 32.1 16 34.6 C15.7 32.1 14.2 30.6 11.7 30.3 C14.2 30 15.7 28.5 16 26 Z" fill="#be185d" />
                <path className="ai-badge-star ai-badge-star--blue" d="M36 11 C36.7 17 39.7 20 45.7 20.7 C39.7 21.4 36.7 24.4 36 30.4 C35.3 24.4 32.3 21.4 26.3 20.7 C32.3 20 35.3 17 36 11 Z" fill="#1e40af" />
              </svg>
            </span>
            <div>
              <h2 id="ai-modal-title" className="ai-modal-title">
                Ask our AI
              </h2>
              <p className="ai-modal-subtitle">
                Tell us about your project and we'll guide you.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="ai-modal-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="ai-modal-form">
          {/* Name Field */}
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

          {/* Email Field */}
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

          {/* Ask Anything Textarea */}
          <div className="ai-modal-field">
            <textarea
              className="ai-modal-textarea"
              rows={4}
              placeholder="Describe your project or ask your question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="ai-modal-actions">
            <button
              type="submit"
              className={`ai-modal-submit-btn ${status}`}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" && (
                <>
                  <span className="ai-modal-spinner" aria-hidden="true" />
                  Sending...
                </>
              )}
              {status === "success" && (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Query Submitted Successfully
                </>
              )}
              {status === "idle" && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Ask AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
