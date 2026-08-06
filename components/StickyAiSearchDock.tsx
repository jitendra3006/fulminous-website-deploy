"use client";

import React, { useState } from "react";
import { AiQueryModal } from "./AiQueryModal";

export function StickyAiSearchDock() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="sticky-ai-dock-container" onClick={handleOpenModal}>
        <form className="hero__search is-sticky" onSubmit={handleOpenModal}>
          <span className="hero__search-spark" aria-hidden="true">
            <svg className="search-sparkles-svg" viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 1. Top-Left Deep Purple Star */}
              <path
                className="ai-badge-star ai-badge-star--purple"
                d="M16 4 C16.5 8 18.5 10 22.5 10.5 C18.5 11 16.5 13 16 17 C15.5 13 13.5 11 9.5 10.5 C13.5 10 15.5 8 16 4 Z"
                fill="#7e22ce"
              />
              {/* 2. Bottom-Left Deep Pink/Magenta Star */}
              <path
                className="ai-badge-star ai-badge-star--pink"
                d="M16 26 C16.3 28.5 17.8 30 20.3 30.3 C17.8 30.6 16.3 32.1 16 34.6 C15.7 32.1 14.2 30.6 11.7 30.3 C14.2 30 15.7 28.5 16 26 Z"
                fill="#be185d"
              />
              {/* 3. Deep Royal Blue Star */}
              <path
                className="ai-badge-star ai-badge-star--blue"
                d="M36 11 C36.7 17 39.7 20 45.7 20.7 C39.7 21.4 36.7 24.4 36 30.4 C35.3 24.4 32.3 21.4 26.3 20.7 C32.3 20 35.3 17 36 11 Z"
                fill="#1e40af"
              />
            </svg>
          </span>
          <input
            className="hero__search-input"
            type="text"
            placeholder="Ask anything..."
            aria-label="Ask anything"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ cursor: "pointer" }}
          />
          <button className="hero__search-send" type="submit" aria-label="Send message">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13"
                stroke="#164a9e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                fill="none"
                stroke="#164a9e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

      <AiQueryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialQuery={searchValue}
      />
    </>
  );
}
