import React from "react";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Page } from "./shared";

const LAST_UPDATED = "July 12, 2026";

const SECTIONS = [
  ["What we collect", [
    "Contact form: when you submit the contact form, we collect your name, email address, budget range, project type, and whatever you write in the message field. It's stored in our database (Google Firebase) and used only to respond to your inquiry.",
    "Analytics: we use Vercel Web Analytics to understand site traffic — pages visited, general location, device type. It doesn't use cookies and doesn't track you across other websites.",
  ]],
  ["How we use it", [
    "Contact form submissions are used only to reply to your inquiry. We don't sell, rent, or share your information with third parties for marketing purposes, and we don't send unsolicited marketing email.",
  ]],
  ["Data retention", [
    "We keep inquiry records as long as reasonably needed to respond and maintain a record of past conversations, and delete them on request.",
  ]],
  ["Your rights", [
    "If you're a California resident, the California Consumer Privacy Act (CCPA) gives you the right to know what personal information we hold about you, request its deletion, and opt out of its sale — we don't sell personal information, so there's nothing to opt out of. Residents of other US states have similar rights under applicable state law.",
    "To exercise any of these rights, email ahtomicstudio@gmail.com and we'll respond within a reasonable time.",
  ]],
  ["Security", [
    "Data is stored and served through established providers (Google Firebase, Vercel). We don't handle or store payment information ourselves — any payment terms for a project are covered separately in that project's agreement.",
  ]],
  ["Changes", [
    "We may update this policy occasionally. The date above reflects the most recent revision.",
  ]],
];

export function PrivacyPage({ go, data = {} }) {
  const p = data.Privacy || {
    label: "Privacy",
    headline: "Privacy",
    headlineAccent: "policy",
    intro: "What we collect through this site, and what we do with it.",
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
          Questions about this policy? <a href="mailto:ahtomicstudio@gmail.com" style={{ color: "var(--text-secondary)" }}>ahtomicstudio@gmail.com</a>
        </p>
      </div>
    </Page>
  );
}
