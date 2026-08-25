import React from "react";
import { SOCIAL_PROFILES, live } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__cols">
            <div className="footer__brand">
              <img
              decoding="async"
              loading="lazy"
                className="footer__logo"
                src="/assets/Fulminous-Logo.webp"
                alt="Fulminous Software logo"
                width={177}
                height={46}
              />
              <p className="footer__tagline">
                We strive for excellence and focus on consistent delivery and sensible simplification.
              </p>
              {/* All five were href="#". They now point at the company's own
                  profiles, each of which was checked to resolve — the same
                  URLs the Organization schema lists in sameAs, which is how a
                  search engine ties this site to those accounts. */}
              <div className="footer__social">
                <a
                  href={SOCIAL_PROFILES.facebook}
                  aria-label="Fulminous Software on Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.78 5.6c1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.23 0-1.62.77-1.62 1.56V12h2.78l-.44 3h-2.34v6.8c4.56-.93 8-4.96 8-9.8z"
                    />
                  </svg>
                </a>
                <a
                  href={SOCIAL_PROFILES.youtube}
                  aria-label="Fulminous Software on YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    />
                  </svg>
                </a>
                <a
                  href={SOCIAL_PROFILES.instagram}
                  aria-label="Fulminous Software on Instagram"
                  className="footer__social-icon--dense"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
                    />
                  </svg>
                </a>
                <a
                  href={SOCIAL_PROFILES.x}
                  aria-label="Fulminous Software on X (Twitter)"
                  className="footer__social-icon--dense"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </a>
                <a
                  href={SOCIAL_PROFILES.linkedin}
                  aria-label="Fulminous Software on LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <nav className="footer__col" aria-label="Services">
              <ul className="footer__list">
                <li>AI Development Services</li>
                <li>Mobile App Development</li>
                <li>Web Development</li>
                <li>Mobile Game Development</li>
                <li>Ecommerce Development</li>
                <li>UI &amp; UX Designing</li>
                <li>Opensource Development</li>
                <li>Quality Assurance</li>
                <li>Consulting Services</li>
                <li>Maintenance &amp; Support</li>
              </ul>
            </nav>

            <nav className="footer__col" aria-label="More services">
              <ul className="footer__list">
                <li>NFT Development</li>
                <li>App Prototype &amp; Strategy</li>
                <li>Wearable App Development</li>
                <li>Progressive Web Apps</li>
                <li>Dedicated Teams</li>
                <li>IoT Development</li>
                <li>Cloud Computing</li>
                <li>Legacy Software Modernization</li>
                <li>Cross Platform App Development</li>
              </ul>
            </nav>

            <nav className="footer__col" aria-label="Company">
              <h3 className="footer__heading">Company</h3>
              <ul className="footer__list">
                <li>
                  <a
                    className="footer__link"
                    href={live("/about-us")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/services")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/career")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Career
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/contact-us")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/portfolios")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/privacy-policy")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className="footer__link"
                    href={live("/refund-policy")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Refund Policy
                  </a>
                </li>
              </ul>
            </nav>

            <div className="footer__col">
              <h3 className="footer__heading">Contact</h3>
              {/* Non-breaking spaces inside the brackets. With ordinary
                  spaces the two-up footer column on a phone broke the line
                  after the "(" — "+ 1 803 999 3940 (" then "USA )" — because
                  that space is a legal break point. The number and the
                  country tag now each stay whole, and the only break left is
                  the one before the bracket. Renders identically on desktop,
                  where the whole line fits anyway. */}
              <div className="footer__contact-block">
                <p>+ 1 803 999 3940 (&nbsp;USA&nbsp;)</p>
                <p>+ 44 7867048979 (&nbsp;UK&nbsp;)</p>
                <p>+ 91 9680567092 (&nbsp;IND&nbsp;)</p>
              </div>
              <div className="footer__contact-block">
                <p>help@fulminous.tech</p>
                <p>hr@fulminous.tech</p>
              </div>
            </div>
          </div>

          <div className="footer__offices">
            <div className="office">
              <img
              decoding="async"
              loading="lazy" className="office__map" src="/assets/UK Office.webp" alt="Map of UK office location" width={520} height={223} />
              <p className="office__name">UK Office</p>
              <p className="office__addr">
                <strong>Address:</strong> 31 Lemington Gardens, IG39TX, Seven kings, London
              </p>
              <p className="office__phone">+44-786 704 8979</p>
            </div>
            <div className="office-divider" />
            <div className="office">
              <img
              decoding="async"
              loading="lazy" className="office__map" src="/assets/USA Office.webp" alt="Map of USA office location" width={520} height={223} />
              <p className="office__name">USA Office</p>
              <p className="office__addr">
                <strong>Address:</strong> 1113, WA Gamble Rd, Manning, South Carolina, 29102
              </p>
              <p className="office__phone">+44-786 704 8979</p>
            </div>
            <div className="office-divider" />
            <div className="office">
              <img
              decoding="async"
              loading="lazy" className="office__map" src="/assets/AUS Office.webp" alt="Map of Australia office location" width={520} height={223} />
              <p className="office__name">AUS Office</p>
              <p className="office__addr">
                <strong>Address:</strong> 20 Mckinlay Ave Adelaide 5086, AUS
              </p>
              <p className="office__phone">+44-786 704 8979</p>
            </div>
            <div className="office-divider" />
            <div className="office">
              <img
              decoding="async"
              loading="lazy" className="office__map" src="/assets/IND Office.webp" alt="Map of India office location" width={520} height={223} />
              <p className="office__name">IND Office</p>
              <p className="office__addr">
                <strong>Address:</strong> B-54 Kings Rd, Nirman Nagar, Jaipur, Raj. 302019
              </p>
              <p className="office__phone">+91-935 141 8445</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            Copyright © 2026 Fulminous. All Rights Reserved
          </p>
          {/* Privacy Policy and Terms both have real published pages and now
              link to them. Disclaimer does not exist on the live site, so it
              stays as plain text rather than becoming an invented URL —
              .footer__legal a only overrides colour and underline, both of
              which it already inherits, so the row looks unchanged. Wire it
              up once the client publishes a disclaimer page. */}
          <p className="footer__legal">
            <a href={live("/privacy-policy")} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            | Disclaimer |{" "}
            <a href={live("/term-and-conditions")} target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
