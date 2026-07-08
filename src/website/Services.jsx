import React from "react";
import { m } from "motion/react";
import { revealProps } from "./motion";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Card } from "../components/display/Card";
import { Button } from "../components/forms/Button";
import { Page } from "./shared";

const SERVICES = [
  ["01", "Websites", "Marketing sites, web apps, and everything between. Built fast, built to last, easy to update.", ["Next.js / modern web", "Performance & SEO", "CMS when you need one"]],
  ["02", "Mobile apps", "iOS and Android products from first sketch to the app store, including the backend behind them.", ["Native feel", "Store submission", "Analytics wired in"]],
  ["03", "Design & brand", "Interfaces, identity, and design systems — designed and shipped under one direction.", ["UI/UX design", "Design systems", "Brand foundations"]],
];

export function ServicesPage({ go, data = {} }) {
  const p = data.Services || {
    label: "Services",
    headline: "Design, build, ship",
    headlineAccent: "Usually all three.",
    intro: "Not sure which of these you need? That's normal. Tell us what you're building and we'll figure it out together.",
    cta: "Start a project"
  };

  return (
    <Page>
      <div className="page-top">
        <SectionLabel index="01">{p.label}</SectionLabel>
        <h1 className="page-title" style={{ margin: "24px 0 0", fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
          {p.headline}{p.headline.endsWith('.') ? '' : <span style={{ color: "var(--accent)" }}>.</span>}{" "}
          {p.headlineAccent && (
            <em className="hl-em" style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: 0 }}>
              {p.headlineAccent}
            </em>
          )}
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>
          {SERVICES.map(([n, title, body, points], i) => (
            <m.div key={n} {...revealProps(i * 90)}>
              <Card padding="lg" className="svc-row">
                <div className="svc-grid">
                  <span className="svc-index" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-accent)" }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "var(--tracking-tight)" }}>{title}</div>
                    <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{body}</p>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {points.map((pt) => (
                      <li key={pt} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 10, alignItems: "baseline" }}>
                        <span style={{ color: "var(--text-accent)" }}>→</span>{pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </m.div>
          ))}
        </div>
        <div className="svc-cta" style={{ marginTop: 64, borderTop: "1px solid var(--line-1)", paddingTop: 32 }}>
          <p style={{ margin: 0, fontSize: 16, color: "var(--text-secondary)", maxWidth: 480 }}>
            {p.intro}
          </p>
          <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
        </div>
      </div>
    </Page>
  );
}
