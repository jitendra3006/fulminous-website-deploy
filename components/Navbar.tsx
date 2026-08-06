"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMobileMenu } from "@/hooks/useMobileMenu";

const IconDiamond = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="#0052cc" />
  </svg>
);

const IconStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="#0052cc" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#0052cc" strokeWidth="2.5" />
    <circle cx="12" cy="12" r="3" fill="#0052cc" />
  </svg>
);

const IconSmileD = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H5V4Z" fill="#0052cc" />
  </svg>
);

const IconRibbon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20C6 13.3726 11.3726 8 18 8V14C14.6863 14 12 16.6863 12 20H6Z" fill="#0052cc" />
    <path d="M18 4C10.268 4 4 10.268 4 18H10C10 13.5817 13.5817 10 18 10V4Z" fill="#0052cc" />
  </svg>
);

export function Navbar() {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const ignoreScrollUntil = useRef<number>(0);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback((delay = 200) => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, delay);
  }, [cancelClose]);

  const handleNavMouseEnter = (menuName: string) => {
    cancelClose();
    setActiveDropdown(menuName);
  };

  const handleNavMouseLeave = () => {
    scheduleClose(200);
  };

  const handleDropdownMouseEnter = () => {
    cancelClose();
  };

  const handleDropdownMouseLeave = () => {
    scheduleClose(200);
  };

  const handleTopNavClick = (menuName: string) => {
    cancelClose();
    ignoreScrollUntil.current = Date.now() + 1000;
    setActiveDropdown(menuName);
    closeMenu();
  };

  const handleNavKeyDown = (e: React.KeyboardEvent, menuName: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cancelClose();
      setActiveDropdown(activeDropdown === menuName ? null : menuName);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelClose();
      setActiveDropdown(null);
    }
  };

  const handleLinkClick = () => {
    cancelClose();
    setActiveDropdown(null);
    closeMenu();
  };

  const updateDropdownPositions = () => {
    const navItems = document.querySelectorAll<HTMLElement>(".site-nav__item--has-dropdown");
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const margin = 16;

    navItems.forEach((item) => {
      const dropdown = item.querySelector<HTMLElement>(".mega-dropdown");
      if (!dropdown) return;

      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;

      const isWhoWeAre = dropdown.classList.contains("mega-dropdown--who-we-are");
      const isTech = dropdown.classList.contains("mega-dropdown--technology");
      const targetMaxWidth = isWhoWeAre ? 840 : isTech ? 1120 : 1060;

      const dropdownWidth = Math.min(targetMaxWidth, vw - margin * 2);
      const idealLeft = itemCenter - dropdownWidth / 2;
      const minLeft = margin;
      const maxLeft = vw - dropdownWidth - margin;
      const clampedLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));

      const parentLeft = itemRect.left;
      const relativeDropdownLeft = clampedLeft - parentLeft;
      const pointerOffset = itemCenter - clampedLeft;

      dropdown.style.setProperty("--dropdown-width", `${dropdownWidth}px`);
      dropdown.style.setProperty("--dropdown-left", `${relativeDropdownLeft}px`);
      dropdown.style.setProperty("--pointer-left", `${pointerOffset}px`);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelClose();
        setActiveDropdown(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const header = document.querySelector(".site-header");
      if (header && !header.contains(event.target as Node)) {
        cancelClose();
        setActiveDropdown(null);
      }
    };

    const handleScroll = () => {
      if (Date.now() < ignoreScrollUntil.current) {
        return;
      }
      cancelClose();
      setActiveDropdown(null);
    };

    const handlePosUpdate = () => {
      updateDropdownPositions();
    };

    handlePosUpdate();
    window.addEventListener("resize", handlePosUpdate, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handlePosUpdate);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeDropdown, cancelClose]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__logo" href="#" aria-label="Fulminous Software home">
          <img
            src="/assets/Fulminous-Logo.png"
            alt="Fulminous Software logo"
            width={177}
            height={46}
          />
        </a>

        <button
          className="site-header__toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          onClick={toggleMenu}
        >
          <span className="hamburger__line" />
          <span className="hamburger__line" />
          <span className="hamburger__line" />
        </button>

        <nav
          className={`site-nav ${isOpen ? "is-open" : ""}`}
          id="primary-nav"
          aria-label="Primary"
        >
          <ul className="site-nav__list">
            {/* WHO WE ARE */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "who-we-are" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("who-we-are")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#who-we-are"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "who-we-are"}
                onClick={() => handleTopNavClick("who-we-are")}
                onKeyDown={(e) => handleNavKeyDown(e, "who-we-are")}
              >
                Who We Are <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--who-we-are"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  {/* Col 1: Company */}
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Company</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#about-us" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">About Us</span>
                            <span className="mega-dropdown__item-desc">Get creative inspiration</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#our-team" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Team</span>
                            <span className="mega-dropdown__item-desc">Stunning web design</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#career" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Career</span>
                            <span className="mega-dropdown__item-desc">Join our global team</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#contact" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Contact Us</span>
                            <span className="mega-dropdown__item-desc">Artistic visual expression</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 2: Why Fulminous */}
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Why Fulminous</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#reviews" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Client Reviews</span>
                            <span className="mega-dropdown__item-desc">Impactful storytelling</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#clients" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Clients</span>
                            <span className="mega-dropdown__item-desc">Functional digital products</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#partners" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Our Partners</span>
                            <span className="mega-dropdown__item-desc">Beautiful crafted prints</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#awards" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Awards &amp; Memberships</span>
                            <span className="mega-dropdown__item-desc">Recognized industry leader</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Col 3: Partner With Us */}
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Partner With Us</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#associate-partnership" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Associate Partnership</span>
                            <span className="mega-dropdown__item-desc">Collaborative growth</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#strategic-partnership" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Strategic Partnership</span>
                            <span className="mega-dropdown__item-desc">Long-term synergy</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#referral-partnership" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Referral Partnership</span>
                            <span className="mega-dropdown__item-desc">Earn referral rewards</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            {/* SERVICES */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "services" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("services")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#services"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "services"}
                onClick={() => handleTopNavClick("services")}
                onKeyDown={(e) => handleNavKeyDown(e, "services")}
              >
                Services <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--services"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Browse by Services</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#mobile-app" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Mobile App Development</span>
                            <span className="mega-dropdown__item-desc">Native &amp; cross-platform apps</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#web-dev" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Web Development</span>
                            <span className="mega-dropdown__item-desc">Responsive web applications</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#cross-platform" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Cross Platform Apps</span>
                            <span className="mega-dropdown__item-desc">Single codebase solutions</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#ecommerce" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Ecommerce Solutions</span>
                            <span className="mega-dropdown__item-desc">Custom online store platforms</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#ui-ux" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">UI &amp; UX Designing</span>
                            <span className="mega-dropdown__item-desc">Engaging digital interfaces</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title mega-dropdown__title--hidden" aria-hidden="true">Solutions</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#opensource" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Opensource Development</span>
                            <span className="mega-dropdown__item-desc">Flexible &amp; scalable platforms</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#qa" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Quality Assurance</span>
                            <span className="mega-dropdown__item-desc">Automated &amp; manual testing</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#nft" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">NFT Development</span>
                            <span className="mega-dropdown__item-desc">Web3 &amp; blockchain solutions</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#prototype" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">App Prototype &amp; Strategy</span>
                            <span className="mega-dropdown__item-desc">Wireframes &amp; user journeys</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#staff" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Dedicated Teams</span>
                            <span className="mega-dropdown__item-desc">Staff augmentation &amp; experts</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title mega-dropdown__title--hidden" aria-hidden="true">Services Col 3</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#cloud" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Cloud Computing</span>
                            <span className="mega-dropdown__item-desc">AWS, Azure &amp; GCP hosting</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#ai-dev" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">AI Development</span>
                            <span className="mega-dropdown__item-desc">ML &amp; LLM smart models</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#legacy" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Legacy Modernization</span>
                            <span className="mega-dropdown__item-desc">System upgrades &amp; refactoring</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#game" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Game Development</span>
                            <span className="mega-dropdown__item-desc">Immersive gaming apps</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Digital Marketing</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#seo" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">SEO &amp; Growth</span>
                            <span className="mega-dropdown__item-desc">Search engine optimization</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#ppc" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">PPC Campaigns</span>
                            <span className="mega-dropdown__item-desc">Targeted ad marketing</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                    <a className="btn--outline-primary mega-dropdown__btn" href="#services" onClick={handleLinkClick} style={{ marginTop: "16px", display: "inline-block" }}>
                      View More Services &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </li>

            {/* TECHNOLOGY */}
            <li
              className={`site-nav__item site-nav__item--has-dropdown ${activeDropdown === "technology" ? "is-open" : ""}`}
              onMouseEnter={() => handleNavMouseEnter("technology")}
              onMouseLeave={handleNavMouseLeave}
            >
              <a
                className="site-nav__link"
                href="#technology"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "technology"}
                onClick={() => handleTopNavClick("technology")}
                onKeyDown={(e) => handleNavKeyDown(e, "technology")}
              >
                Technology <span className="chevron">▾</span>
              </a>
              <div
                className="mega-dropdown mega-dropdown--technology"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="mega-dropdown__inner">
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Backend</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#nodejs" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">NodeJS &amp; Express</span>
                            <span className="mega-dropdown__item-desc">Event-driven backends</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#dotnet" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">.NET &amp; C# Solutions</span>
                            <span className="mega-dropdown__item-desc">Enterprise Microsoft stack</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#php" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">PHP &amp; Laravel</span>
                            <span className="mega-dropdown__item-desc">Web &amp; CMS platforms</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#python" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Python &amp; Django</span>
                            <span className="mega-dropdown__item-desc">AI &amp; data science engine</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Frontend</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#reactjs" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">ReactJS &amp; Next.js</span>
                            <span className="mega-dropdown__item-desc">Interactive web interfaces</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#angular" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Angular Framework</span>
                            <span className="mega-dropdown__item-desc">Enterprise web applications</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#fullstack" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">MERN &amp; MEAN Stack</span>
                            <span className="mega-dropdown__item-desc">End-to-end web stack</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                    <h4 className="mega-dropdown__title" style={{ marginTop: "16px" }}>Cloud &amp; DevOps</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#aws" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">AWS &amp; Azure Cloud</span>
                            <span className="mega-dropdown__item-desc">Cloud infrastructure</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">Mobile</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#ios" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">iOS (Swift)</span>
                            <span className="mega-dropdown__item-desc">Native Apple applications</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#android" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconRibbon /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Android (Kotlin)</span>
                            <span className="mega-dropdown__item-desc">Native Google applications</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#react-native" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">React Native</span>
                            <span className="mega-dropdown__item-desc">Cross-platform mobile</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#flutter" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconStar /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Flutter Development</span>
                            <span className="mega-dropdown__item-desc">Pixel-perfect mobile UI</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="mega-dropdown__col">
                    <h4 className="mega-dropdown__title">CMS</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#wordpress" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconTarget /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">WordPress &amp; WooCommerce</span>
                            <span className="mega-dropdown__item-desc">Popular CMS engine</span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#headless" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconSmileD /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Strapi / Sanity CMS</span>
                            <span className="mega-dropdown__item-desc">Headless API content</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                    <h4 className="mega-dropdown__title" style={{ marginTop: "16px" }}>Salesforce Development</h4>
                    <ul className="mega-dropdown__list">
                      <li>
                        <a href="#salesforce" className="mega-dropdown__item" onClick={handleLinkClick}>
                          <span className="mega-dropdown__item-icon"><IconDiamond /></span>
                          <span className="mega-dropdown__item-text">
                            <span className="mega-dropdown__item-title">Salesforce Services</span>
                            <span className="mega-dropdown__item-desc">CRM implementation</span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className="site-nav__item">
              <a className="site-nav__link" href="#blogs" onClick={handleLinkClick}>
                Blogs
              </a>
            </li>
            <li className="site-nav__item">
              <a className="site-nav__link" href="#portfolio" onClick={handleLinkClick}>
                Portfolio
              </a>
            </li>
          </ul>

          <a
            className="btn btn--primary site-nav__cta"
            href="#contact"
            onClick={handleLinkClick}
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
}
