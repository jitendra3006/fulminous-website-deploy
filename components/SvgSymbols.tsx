import React from "react";

export function SvgSymbols() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      focusable="false"
    >
      <symbol id="icon-star" viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01z" />
      </symbol>

      {/* --- INDUSTRY GRAPHICS --- */}
      <symbol id="icon-health" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#E8F8F0" />
        <path d="M20 9c-4 0-7 3-7 7 0 6 7 12 7 16 0-4 7-10 7-16 0-4-3-7-7-7z" className="industry-svg-accent" fill="#10B981" />
        <path d="M16 16h8M20 12v8" className="industry-svg-stroke" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </symbol>

      <symbol id="icon-bank" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#EFF6FF" />
        <path d="M20 7L6 15h28L20 7z" className="industry-svg-accent" fill="#2563EB" />
        <path d="M10 18v11M16.5 18v11M23.5 18v11M30 18v11" className="industry-svg-stroke" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="6" y="29" width="28" height="4" rx="1" className="industry-svg-accent" fill="#2563EB" />
      </symbol>

      <symbol id="icon-building" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#F3E8FF" />
        <rect x="10" y="7" width="20" height="26" rx="4" className="industry-svg-accent" fill="#7C3AED" />
        <rect x="14" y="11" width="4" height="4" rx="1" fill="#DDD6FE" />
        <rect x="22" y="11" width="4" height="4" rx="1" fill="#DDD6FE" />
        <rect x="14" y="18" width="4" height="4" rx="1" fill="#DDD6FE" />
        <rect x="22" y="18" width="4" height="4" rx="1" fill="#DDD6FE" />
        <rect x="17" y="26" width="6" height="7" fill="#C4B5FD" />
      </symbol>

      <symbol id="icon-travel" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#E0F2FE" />
        <path d="M32 10L18 21l-5-5-6 2 7 6 2 8 4-4-2-6 14-12z" className="industry-svg-accent" fill="#0284C7" />
        <circle cx="11" cy="30" r="3.5" fill="#38BDF8" opacity="0.6" />
      </symbol>

      <symbol id="icon-media" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#FCE7F3" />
        <rect x="6" y="8" width="28" height="24" rx="6" className="industry-svg-accent" fill="#DB2777" />
        <polygon points="17,14 27,20 17,26" fill="#FFFFFF" />
      </symbol>

      <symbol id="icon-ecommerce" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#ECFDF5" />
        <circle cx="14" cy="31" r="3" className="industry-svg-accent" fill="#059669" />
        <circle cx="28" cy="31" r="3" className="industry-svg-accent" fill="#059669" />
        <path d="M7 8h5l4 17h16l4-11H14" className="industry-svg-stroke" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </symbol>

      <symbol id="icon-education" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#EEF2FF" />
        <path d="M20 8L4 16l16 8 16-8L20 8z" className="industry-svg-accent" fill="#4F46E5" />
        <path d="M9 19v8c0 3 5 5 11 5s11-2 11-5v-8" className="industry-svg-stroke" fill="none" stroke="#4338CA" strokeWidth="2.5" />
        <path d="M32 16.5v10" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      </symbol>

      <symbol id="icon-food" viewBox="0 0 40 40">
        <rect x="0" y="0" width="40" height="40" rx="12" className="industry-svg-bg" fill="#FEF3C7" />
        <path d="M14 9v10M18 9v10M10 9v10c0 2.5 1.8 4 4 4s4-1.5 4-4" className="industry-svg-stroke" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="14" y1="23" x2="14" y2="31" className="industry-svg-stroke" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M26 9c0 5 2.5 7 2.5 11v11" className="industry-svg-stroke" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </symbol>

      <symbol id="icon-game" viewBox="0 0 24 24">
        <rect x="2" y="7.5" width="20" height="9" rx="4.5" />
        <line x1="7" y1="10.5" x2="7" y2="13.5" />
        <line x1="5.5" y1="12" x2="8.5" y2="12" />
        <circle cx="16" cy="11" r="1" />
        <circle cx="18" cy="13" r="1" />
      </symbol>
      <symbol id="icon-teams" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c0-3.2 2.6-5 5.5-5s5.5 1.8 5.5 5" />
        <circle cx="17.5" cy="9" r="2.2" />
        <path d="M16 14.2c2.4.2 4.5 1.6 4.5 4.8" />
      </symbol>
      <symbol id="icon-qa" viewBox="0 0 24 24">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4h6v3H9z" />
        <path d="M8.5 12.5l2 2 4-4.2" />
      </symbol>
      <symbol id="icon-cloud" viewBox="0 0 24 24">
        <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.4A3.6 3.6 0 1117.4 18H7z" fill="#0089D6" />
      </symbol>

      {/* --- RICH COLORFUL TECH LOGOS --- */}
      <symbol id="logo-react" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="4" fill="#61DAFB" />
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="#61DAFB" strokeWidth="2" transform="rotate(30 20 20)" />
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="#61DAFB" strokeWidth="2" transform="rotate(90 20 20)" />
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="#61DAFB" strokeWidth="2" transform="rotate(150 20 20)" />
      </symbol>

      <symbol id="logo-angular" viewBox="0 0 40 40">
        <polygon points="20,4 35,9 30,31 20,37 10,31 5,9" fill="#DD0031" />
        <polygon points="20,4 35,9 30,31 20,37" fill="#C3002F" />
        <polygon points="20,9 12,25 15.5,25 17.5,20 22.5,20 24.5,25 28,25" fill="#FFFFFF" />
        <polygon points="20,13 18.5,17 21.5,17" fill="#DD0031" />
      </symbol>

      <symbol id="logo-vue" viewBox="0 0 40 40">
        <polygon points="20,35 2,4 10,4 20,21 30,4 38,4" fill="#41B883" />
        <polygon points="20,35 2,4 10,4 20,21 30,4 38,4" fill="#35495E" clipPath="polygon(20 35, 10 4, 30 4)" />
      </symbol>

      <symbol id="logo-node" viewBox="0 0 40 40">
        <polygon points="20,4 35,12 35,28 20,36 5,28 5,12" fill="#339933" />
        <path d="M20 12v16M12 16l8 4 8-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </symbol>

      <symbol id="logo-python" viewBox="0 0 40 40">
        <path d="M19.5 4c-6.8 0-6.4 3-6.4 3v3.1h6.5v.9H10.2S4 10.3 4 17.2c0 6.9 5.4 6.6 5.4 6.6h3.2v-4.5c0-5.1 4.4-4.8 4.4-4.8h6.5V8.4s.5-4.4-4-4.4zm-3.6 2.7a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" fill="#3776AB" />
        <path d="M20.5 36c6.8 0 6.4-3 6.4-3v-3.1h-6.5v-.9h9.4s6.2.7 6.2-6.2c0-6.9-5.4-6.6-5.4-6.6h-3.2v4.5c0 5.1-4.4 4.8-4.4 4.8h-6.5v6.1s-.5 4.4 4 4.4zm3.6-2.7a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z" fill="#FFD43B" />
      </symbol>

      <symbol id="logo-java" viewBox="0 0 40 40">
        <path d="M16 31s-3 1.5 2 2c5.5.5 8.5.5 12-1 0 0-2.5 1.5-6.5 1.5-5 0-8.5-1.5-7.5-2.5z" fill="#EA2D2E" />
        <path d="M14 26s-3 1.5 2.5 2c6.5.6 10.5.5 14.5-1.5 0 0-3 1.5-7.5 1.5-5.5 0-9.5-1-9.5-2z" fill="#5382A1" />
        <path d="M21 9c2 2.5.5 5-1.5 7.5-2 2.5-1.5 4.5.5 6.5 0 0-3-1.5-2.5-4.5.5-3.5 3.5-5 3.5-9.5z" fill="#F8981D" />
      </symbol>

      <symbol id="logo-graphql" viewBox="0 0 40 40">
        <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" fill="none" stroke="#E10098" strokeWidth="2.5" />
        <circle cx="20" cy="4" r="3.5" fill="#E10098" />
        <circle cx="34" cy="12" r="3.5" fill="#E10098" />
        <circle cx="34" cy="28" r="3.5" fill="#E10098" />
        <circle cx="20" cy="36" r="3.5" fill="#E10098" />
        <circle cx="6" cy="28" r="3.5" fill="#E10098" />
        <circle cx="6" cy="12" r="3.5" fill="#E10098" />
      </symbol>

      <symbol id="logo-database" viewBox="0 0 40 40">
        <ellipse cx="20" cy="9" rx="14" ry="5" fill="#336791" />
        <path d="M6 9v8c0 2.8 6.3 5 14 5s14-2.2 14-5V9" fill="none" stroke="#336791" strokeWidth="2" />
        <ellipse cx="20" cy="17" rx="14" ry="5" fill="#4183C4" />
        <path d="M6 17v8c0 2.8 6.3 5 14 5s14-2.2 14-5v-8" fill="none" stroke="#336791" strokeWidth="2" />
        <ellipse cx="20" cy="25" rx="14" ry="5" fill="#2B5B84" />
      </symbol>

      <symbol id="logo-mean" viewBox="0 0 40 40">
        <rect x="5" y="5" width="14" height="14" rx="3" fill="#E23237" />
        <rect x="21" y="5" width="14" height="14" rx="3" fill="#41B883" />
        <rect x="5" y="21" width="14" height="14" rx="3" fill="#61DAFB" />
        <rect x="21" y="21" width="14" height="14" rx="3" fill="#339933" />
      </symbol>

      <symbol id="logo-mern" viewBox="0 0 40 40">
        <path d="M20 4L35 12V28L20 36L5 28V12L20 4Z" fill="#117D40" />
        <circle cx="20" cy="20" r="7" fill="#61DAFB" />
      </symbol>

      <symbol id="logo-frontend" viewBox="0 0 40 40">
        <rect x="4" y="8" width="32" height="24" rx="4" fill="#F06529" />
        <path d="M4 14h32" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="9" cy="11" r="1.5" fill="#FFFFFF" />
        <circle cx="14" cy="11" r="1.5" fill="#FFFFFF" />
        <circle cx="19" cy="11" r="1.5" fill="#FFFFFF" />
        <path d="M12 21l-3 3 3 3M20 21l3 3-3 3M17 20l-2 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>

      <symbol id="logo-flutter" viewBox="0 0 40 40">
        <polygon points="24,4 9,19 16,26 31,11" fill="#47C5FB" />
        <polygon points="16,26 23,33 31,33 24,26" fill="#00569E" />
        <polygon points="16,26 24,18 31,25 23,33" fill="#02569B" />
      </symbol>

      <symbol id="logo-swift" viewBox="0 0 40 40">
        <rect x="4" y="4" width="32" height="32" rx="8" fill="#F05138" />
        <path d="M29 27c-6-5-8-10-8-16 0 0 7 7 11 9-3-6-9-10-14-12 0 0 3 4 2 8-3-4-8-7-14-8 5 5 9 11 12 16-4-2-7-2-9-1 4 3 9 4 14 4z" fill="#FFFFFF" />
      </symbol>

      <symbol id="logo-kotlin" viewBox="0 0 40 40">
        <polygon points="36,4 4,36 4,4" fill="#7F52FF" />
        <polygon points="36,36 20,20 36,4" fill="#C757BC" />
        <polygon points="4,36 20,20 36,36" fill="#F88909" />
      </symbol>

      <symbol id="logo-wordpress" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="#21759B" />
        <path d="M6.5 20a13.5 13.5 0 0 0 20.6 11.4L13.8 13.7 8.3 28.6A13.4 13.4 0 0 1 6.5 20zm20.8 1.4c0-2.2-.8-3.7-1.5-4.9-.9-1.4-1.8-2.6-1.8-4 0-1.6 1.2-3.1 2.9-3.1h.4A13.5 13.5 0 0 1 33.5 20c0 4.7-2.4 8.8-6.2 11.4z" fill="#FFFFFF" />
      </symbol>

      <symbol id="logo-shopify" viewBox="0 0 40 40">
        <path d="M27.5 7.8s-2.1.6-3.8 2.3c-1.2 1.2-1.7 2.8-1.9 3.8l-3.3-1c-.5-.2-1.1.1-1.3.6l-3.7 11.2s-2-3.3-4.5-3.3c-2.4 0-3.3 1.8-3.3 3.1 0 4.2 6.4 8.7 12 11.5h.3c.2 0 .4-.1.5-.2l12.2-6.5c1.4-.7 2.2-2.1 2.2-3.7V10l-6.4-2.2z" fill="#96BF48" />
        <path d="M27.5 7.8l-6.4 17.5 4.8 1.4 7.6-4.1V10l-6-2.2z" fill="#5E8E3E" />
      </symbol>

      <symbol id="logo-aws" viewBox="0 0 40 40">
        <rect x="4" y="4" width="32" height="32" rx="6" fill="#232F3E" />
        <path d="M12 14h3l2.5 8 2.5-8h3l-4 12h-3zm16 0v12h-3V14z" fill="#FF9900" />
        <path d="M10 28c8 4 16 2 20-2" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
      </symbol>

      <symbol id="logo-docker" viewBox="0 0 40 40">
        <rect x="8" y="16" width="5" height="5" rx="1" fill="#2496ED" />
        <rect x="14" y="16" width="5" height="5" rx="1" fill="#2496ED" />
        <rect x="20" y="16" width="5" height="5" rx="1" fill="#2496ED" />
        <rect x="14" y="10" width="5" height="5" rx="1" fill="#2496ED" />
        <rect x="20" y="10" width="5" height="5" rx="1" fill="#2496ED" />
        <rect x="26" y="16" width="5" height="5" rx="1" fill="#2496ED" />
        <path d="M4 24c2 5 8 8 16 8 10 0 16-5 16-8H4z" fill="#2496ED" />
      </symbol>

      <symbol id="icon-sparkles" viewBox="0 0 24 24">
        <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3z" />
        <path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9L18 14z" />
      </symbol>
      <symbol id="icon-bot" viewBox="0 0 24 24">
        <rect x="4" y="8" width="16" height="11" rx="3" fill="#0089D6" />
        <circle cx="12" cy="4" r="1" fill="#0089D6" />
        <path d="M12 5v3M8.5 13v1M15.5 13v1M9 16.5h6" stroke="#FFFFFF" strokeWidth="1.5" />
      </symbol>
    </svg>
  );
}
