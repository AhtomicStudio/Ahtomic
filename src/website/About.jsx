import React from "react";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Button } from "../components/forms/Button";
import { Page } from "./shared";

export function AboutPage({ go, data = {} }) {
  const p = data.About || {
    label: "About",
    headline: "A small studio, on",
    headlineAccent: "purpose",
    intro: "Ahtomic Studio builds websites and mobile apps from California. One person directs every project — design, scope, quality — while AI agents handle the coding.",
    cta: "Start a project"
  };

  return (
    <Page>
      <div className="page-top" style={{ maxWidth: 720 }}>
        <SectionLabel index="01">{p.label}</SectionLabel>
        <h1 className="page-title" style={{ margin: "24px 0 0", fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
          {p.headline}{" "}
          {p.headlineAccent && (
            <em className="hl-em" style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: 0 }}>
              {p.headlineAccent}
            </em>
          )}
          <span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20, fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          <p style={{ margin: 0 }}>{p.intro}</p>
          <p style={{ margin: 0 }}>I'm not a classically trained developer — I run every project personally, and tools like Claude and Gemini turn a clear brief into real, working software. No account managers, no handoffs, same person from first call to launch.</p>
        </div>
        <div className="btn-row" style={{ marginTop: 64, alignItems: "center" }}>
          <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
          <Button variant="secondary" size="lg" onClick={() => go("Work")}>See the work</Button>
          <img src="/assets/mascot/thom.webp" alt="Thom the mascot" title="Thom — quality control" className="thom" style={{ height: 40, width: "auto" }} />
        </div>
      </div>
    </Page>
  );
}
