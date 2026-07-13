import React from "react";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Page } from "./shared";

const LAST_UPDATED = "July 12, 2026";

const SECTIONS = [
  ["Use of the site", [
    "This site is provided to describe Ahtomic Studio's work and let you get in touch. Don't use it to submit false information, attempt to disrupt the site, or scrape or copy its content for commercial use without permission.",
  ]],
  ["Intellectual property", [
    "The content, design, and branding on this site belong to Ahtomic Studio unless otherwise noted. Client project work referenced here — case studies, screenshots — is shown with permission.",
  ]],
  ["No warranty", [
    "The site and its content are provided “as is,” without warranties of any kind. We make reasonable efforts to keep information accurate and the site available, but don't guarantee uninterrupted access or that everything on it is error-free.",
  ]],
  ["Limitation of liability", [
    "To the extent permitted by law, Ahtomic Studio isn't liable for indirect, incidental, or consequential damages arising from your use of this site.",
  ]],
  ["Project engagements", [
    "These site-use terms don't cover the terms of an actual client project — those are set out separately in a proposal or agreement between Ahtomic Studio and the client.",
  ]],
  ["Governing law", [
    "These terms are governed by the laws of the State of California, USA, without regard to conflict-of-law principles.",
  ]],
  ["Changes", [
    "We may update these terms occasionally. Continued use of the site after a change means you accept the revised terms.",
  ]],
];

export function TermsPage({ go, data = {} }) {
  const p = data.Terms || {
    label: "Terms",
    headline: "Terms of",
    headlineAccent: "service",
    intro: "The terms that cover using this website — not any specific client project.",
  };

  return (
    <Page>
      <div className="page-top" style={{ maxWidth: 680 }}>
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
        <p style={{ margin: "20px 0 0", fontSize: 14, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Last updated {LAST_UPDATED}
        </p>
        <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          {p.intro}
        </p>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 36 }}>
          {SECTIONS.map(([heading, paras]) => (
            <div key={heading}>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{heading}</h2>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                {paras.map((para, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)" }}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ margin: "56px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
          Questions about these terms? <a href="mailto:ahtomicstudio@gmail.com" style={{ color: "var(--text-secondary)" }}>ahtomicstudio@gmail.com</a>
        </p>
      </div>
    </Page>
  );
}
