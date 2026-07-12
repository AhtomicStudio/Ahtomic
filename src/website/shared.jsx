import React from "react";
import { Wordmark } from "../components/marketing/Wordmark";
import { Button } from "../components/forms/Button";

export const pathFor = (p) => (p === "Home" ? "/" : "/" + p.toLowerCase());

export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const projectPathFor = (project) => pathFor("Work") + "/" + slugify(project.title);

// Consolidates what were two duplicated title-matching lookups (Home.jsx and
// Work.jsx) — the project detail page needs the exact same fallback logic.
export const projectImage = (project) => {
  if (project.image) return project.image;
  if (project.title === "CannaPickForMe") return "/assets/portfolio/cannapickforme/home.webp";
  if (project.title === "A Chalkboard for Two") return "/assets/portfolio/chalkboard/landing.webp";
  return "";
};

export function Nav({ page, go }) {
  const links = ["Home", "Work", "Services", "About"];
  const [open, setOpen] = React.useState(false);
  const goAndClose = (l) => { setOpen(false); go(l); };

  // Close the mobile menu if the viewport grows past the breakpoint
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const onChange = (e) => { if (e.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <nav aria-label="Main" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
      background: "rgba(10,10,11,0.75)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--line-1)",
    }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-pad)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Wordmark size={18} href="/" aria-label="Ahtomic Studio — home" onClick={(e) => { e.preventDefault(); goAndClose("Home"); }} />
        <div className="nav-links">
          {links.map((l) => (
            <a key={l} href={pathFor(l)} className="nav-link" data-active={String(page === l)} aria-current={page === l ? "page" : undefined} onClick={(e) => { e.preventDefault(); go(l); }}
              style={{
                textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "8px 12px", borderRadius: 8,
                color: page === l ? "var(--text-body)" : "var(--text-muted)",
                transition: "color 140ms var(--ease-out)",
              }}>{l}</a>
          ))}
          <Button variant="primary" size="sm" onClick={() => go("Contact")} style={{ marginLeft: 12 }}>Start a project</Button>
        </div>
        <button type="button" className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            {open
              ? <><line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" /></>
              : <><line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" /></>}
          </svg>
        </button>
      </div>
      {open && (
        <div className="nav-menu">
          {[...links, "Contact"].map((l) => (
            <a key={l} href={pathFor(l)} data-active={String(page === l)} aria-current={page === l ? "page" : undefined} onClick={(e) => { e.preventDefault(); goAndClose(l); }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

export function Footer({ go, settings = {} }) {
  const tagline = settings.footerTagline || "Websites and mobile apps, designed and built.";
  const copyright = settings.copyright || "© 2026 Ahtomic Studio";
  const email = settings.email || "ahtomicstudio@gmail.com";

  return (
    <footer style={{ borderTop: "1px solid var(--line-1)", marginTop: 128 }}>
      <div className="footer-top" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px var(--container-pad)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Wordmark size={16} sub="Studio · California" />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{tagline}</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Work", "Services", "About", "Contact"].map((l) => (
            <a key={l} href={pathFor(l)} onClick={(e) => { e.preventDefault(); go(l); }} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", padding: "6px 0" }}>{l}</a>
          ))}
          <img src="/assets/mascot/thom.webp" alt="Thom" title="Thom says hi" className="thom" style={{ height: 36, width: "auto", opacity: 0.9 }} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line-1)" }}>
        <div className="footer-bottom" style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "16px var(--container-pad)" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--text-disabled)" }}>{copyright}</span>
          <a href={`mailto:${email}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--text-muted)", textDecoration: "none" }}>{email}</a>
        </div>
      </div>
    </footer>
  );
}

export function BackToTop() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setShow(window.scrollY > 600); raf = 0; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <button type="button" className="back-to-top" data-show={String(show)} aria-label="Back to top" aria-hidden={String(!show)} tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>
      ↑
    </button>
  );
}

export function Page({ children }) {
  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-pad)" }}>{children}</div>
  );
}
