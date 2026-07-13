import React from "react";
import { m } from "motion/react";
import { revealProps } from "./motion";
import { Button } from "../components/forms/Button";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { ProjectCard } from "../components/marketing/ProjectCard";
import { Card } from "../components/display/Card";
import { Page, projectImage, projectPathFor, slugify } from "./shared";

// A comma reads as a small, awkward mark at hero-headline size — this
// stands in for it: a tiny atom (red nucleus, silver orbit rings), echoing
// the "atom" accent word that follows later in the same line. Reuses the
// existing dot-pop keyframe/timing (see styles.css) for its one-shot
// entrance — same precedent as the red period, no new motion vocabulary,
// and no infinite loop (brand rule: "no bounces, no infinite loops").
//
// Hovering spins it up; leaving lets it coast back down instead of
// stopping dead. Driven by a manual rAF loop on a nested span (so its
// rotate transform never fights dot-pop's scale transform on the outer
// span) rather than an m.*/animate value — that keeps the loop itself
// hover-gated: it unsubscribes the moment velocity reaches zero, so
// there's no persistent rAF at rest either, not just no visible motion.
// Checked against both reduced-motion signals (OS setting + CMS
// "Motion: Off") at hover-start, the same two signals MotionProvider
// gates m.* components on — nothing here animates before a hover, so a
// one-time check per hover is enough.
function AtomSpark() {
  const spinRef = React.useRef(null);
  const angle = React.useRef(0);
  const velocity = React.useRef(0);
  const hovered = React.useRef(false);
  const raf = React.useRef(null);
  const lastT = React.useRef(null);

  const MAX_V = 620; // deg/s top spin speed
  const ACCEL = 1000; // deg/s^2 while hovered
  const DECEL = 480; // deg/s^2 while coasting down

  const tick = (now) => {
    if (lastT.current == null) lastT.current = now;
    const dt = Math.min(0.05, (now - lastT.current) / 1000);
    lastT.current = now;

    velocity.current = hovered.current
      ? Math.min(MAX_V, velocity.current + ACCEL * dt)
      : Math.max(0, velocity.current - DECEL * dt);
    angle.current = (angle.current + velocity.current * dt) % 360;
    if (spinRef.current) spinRef.current.style.transform = `rotate(${angle.current}deg)`;

    if (hovered.current || velocity.current > 0.5) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = null;
      lastT.current = null;
    }
  };

  const startLoop = () => {
    if (raf.current == null) {
      lastT.current = null;
      raf.current = requestAnimationFrame(tick);
    }
  };

  const motionAllowed = () =>
    typeof window !== "undefined" &&
    document.documentElement.dataset.motion !== "Off" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleEnter = () => {
    if (!motionAllowed()) return;
    hovered.current = true;
    startLoop();
  };
  const handleLeave = () => {
    hovered.current = false;
  };

  React.useEffect(() => () => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
  }, []);

  return (
    <span
      aria-hidden="true"
      className="dot-pop"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: "inline-flex", width: "0.62em", height: "0.62em", margin: "0 0.16em", verticalAlign: "0.03em" }}
    >
      <span ref={spinRef} style={{ display: "inline-flex", width: "100%", height: "100%" }}>
        <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ overflow: "visible" }}>
          <ellipse cx="12" cy="12" rx="11" ry="4.4" fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" opacity="0.55" />
          <ellipse cx="12" cy="12" rx="11" ry="4.4" fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" opacity="0.55" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="11" ry="4.4" fill="none" stroke="var(--text-secondary)" strokeWidth="1.4" opacity="0.55" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2.8" fill="var(--accent)" />
        </svg>
      </span>
    </span>
  );
}

// Splits the headline on its first comma and renders the AtomSpark glyph in
// its place instead of the literal character — falls back to plain text
// untouched if there's no comma, so editing the copy later never breaks.
function renderHeadline(text) {
  const i = text.indexOf(",");
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <AtomSpark />
      {text.slice(i + 1).replace(/^\s+/, "")}
    </>
  );
}

export function HomePage({ go, data = {}, projects = [] }) {
  const p = data.Home || {
    label: "Web studio · California",
    headline: "Everything, down to the",
    headlineAccent: "atom",
    intro: "Small studio, serious software. One person directs every project; AI agents handle the build. Fast, focused, no agency overhead.",
    cta: "Start a project"
  };

  // Filter for visible projects
  const visibleProjects = projects.filter(proj => proj.visible).slice(0, 2);

  return (
    <div>
      <header className="hero-section">
        <Page>
          <div style={{ position: "relative", maxWidth: 780 }}>
            <m.div {...revealProps(0)} style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              {p.label}
            </m.div>
            <m.h1 {...revealProps(90)} className="hero-title" style={{ margin: 0, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-tight)" }}>
              {renderHeadline(p.headline)}{" "}
              {p.headlineAccent && (
                <span style={{ color: "var(--text-accent)" }}>{p.headlineAccent}</span>
              )}
              <span className="dot-pop">.</span>
            </m.h1>
            <m.p {...revealProps(180)} style={{ margin: "24px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 520 }}>
              {p.intro}
            </m.p>
            <m.div {...revealProps(260)} className="btn-row" style={{ marginTop: 36 }}>
              <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
              <Button variant="secondary" size="lg" onClick={() => go("Work")}>View work</Button>
            </m.div>
          </div>
        </Page>
      </header>

      <Page>
        <m.div {...revealProps(0)}><SectionLabel index="01">Selected work</SectionLabel></m.div>
        <div className="grid-2" style={{ marginTop: 32 }}>
          {visibleProjects.map((proj, i) => (
            <m.div key={proj.title} {...revealProps((i + 1) * 80)}>
              <ProjectCard
                title={proj.title}
                meta={proj.meta}
                image={projectImage(proj)}
                href={projectPathFor(proj)}
                onClick={(e) => { e.preventDefault(); go("Work", slugify(proj.title)); }}
                priority={i === 0}
              />
            </m.div>
          ))}
          {visibleProjects.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "40px 0", color: "var(--text-muted)", fontSize: 14 }}>
              No portfolio projects have been published yet.
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <Button variant="ghost" onClick={() => go("Work")}>All work →</Button>
        </div>
      </Page>

      <Page>
        <div style={{ marginTop: 96 }}>
          <m.div {...revealProps(0)}><SectionLabel index="02">What we do</SectionLabel></m.div>
          <div className="grid-3" style={{ marginTop: 32 }}>
            {[
              ["Websites", "Marketing sites and web apps. Fast, accessible, maintained."],
              ["Mobile apps", "iOS and Android products, from concept to store."],
              ["Design & brand", "Interfaces, identities, and the systems behind them."],
            ].map(([t, d], i) => (
              <m.div key={t} {...revealProps(i * 90)}>
                <Card padding="lg" interactive style={{ height: "100%" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{t}</div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{d}</p>
                </Card>
              </m.div>
            ))}
          </div>
        </div>
      </Page>
    </div>
  );
}
