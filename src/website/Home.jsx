import React from "react";
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
    if (title === "CannaPickForMe") return "/assets/portfolio/cannapickforme/home.png";
    if (title === "A Chalkboard for Two") return "/assets/portfolio/chalkboard/landing.png";
    return "";
  };

  return (
    <div>
      <header className="hero-section">
        <Page>
          <div style={{ position: "relative", maxWidth: 780 }}>
            <div data-reveal style={{ "--d": "0ms", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
              {p.label}
            </div>
            <h1 data-reveal className="hero-title" style={{ "--d": "90ms", margin: 0, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-tight)" }}>
              {p.headline}{" "}
              {p.headlineAccent && (
                <span style={{ color: "var(--text-accent)" }}>{p.headlineAccent}</span>
              )}
              <span className="dot-pop">.</span>
            </h1>
            <p data-reveal style={{ "--d": "180ms", margin: "24px 0 0", fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 520 }}>
              {p.intro}
            </p>
            <div data-reveal className="btn-row" style={{ "--d": "260ms", marginTop: 36 }}>
              <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
              <Button variant="secondary" size="lg" onClick={() => go("Work")}>View work</Button>
            </div>
          </div>
        </Page>
      </header>

      <Page>
        <div data-reveal><SectionLabel index="01">Selected work</SectionLabel></div>
        <div className="grid-2" style={{ marginTop: 32 }}>
          {visibleProjects.map((proj, i) => (
            <div key={proj.title} data-reveal style={{ "--d": `${(i + 1) * 80}ms` }}>
              <ProjectCard
                title={proj.title}
                meta={proj.meta}
                image={getProjImage(proj.title, proj.image)}
                onClick={(e) => { e.preventDefault(); go("Work"); }}
              />
            </div>
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
          <div data-reveal><SectionLabel index="02">What we do</SectionLabel></div>
          <div className="grid-3" style={{ marginTop: 32 }}>
            {[
              ["Websites", "Marketing sites and web apps. Fast, accessible, maintained."],
              ["Mobile apps", "iOS and Android products, from concept to store."],
              ["Design & brand", "Interfaces, identities, and the systems behind them."],
            ].map(([t, d], i) => (
              <div key={t} data-reveal style={{ "--d": `${i * 90}ms` }}>
                <Card padding="lg" interactive style={{ height: "100%" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{t}</div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{d}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Page>
    </div>
  );
}
