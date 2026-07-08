import React from "react";
import { m } from "motion/react";
import { revealProps } from "./motion";
import { Button } from "../components/forms/Button";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { ProjectCard } from "../components/marketing/ProjectCard";
import { Card } from "../components/display/Card";
import { Page } from "./shared";

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

  // Map local paths to public/src assets
  const getProjImage = (title, imgPath) => {
    if (imgPath) return imgPath;
    if (title === "CannaPickForMe") return "/assets/portfolio/cannapickforme/home.webp";
    if (title === "A Chalkboard for Two") return "/assets/portfolio/chalkboard/landing.webp";
    return "";
  };

  return (
    <div>
      <header className="hero-section">
        <Page>
          <div style={{ position: "relative", maxWidth: 780 }}>
            <m.div {...revealProps(0)} style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              {p.label}
            </m.div>
            <m.h1 {...revealProps(90)} className="hero-title" style={{ margin: 0, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-tight)" }}>
              {p.headline}{" "}
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
                image={getProjImage(proj.title, proj.image)}
                onClick={(e) => { e.preventDefault(); go("Work"); }}
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
