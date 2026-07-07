import React from "react";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { Button } from "../components/forms/Button";
import { EditorLayout, SectionCard } from "./AdminShared";

const PAGE_LIST = ["Home", "Work", "Services", "About", "Contact"];

/* Mini live preview of the page hero, rendered from draft values */
function PagePreview({ page, draft, accent }) {
  const p = draft.pages[page];
  if (!p) return null;
  return (
    <div className="ah-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--line-1)", display: "flex", alignItems: "center", gap: 6 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--line-2)" }}></span>)}
        <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-disabled)" }}>ahtomic.studio{page === "Home" ? "" : "/" + page.toLowerCase()}</span>
      </div>
      <div style={{ padding: "36px 28px 40px", background: "radial-gradient(400px 180px at 50% 115%, " + accent + "26, transparent 70%)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>{p.label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.15 }}>
          {p.headline} {p.headlineAccent && <em style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: 0 }}>{p.headlineAccent}</em>}<span style={{ color: accent }}>.</span>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 340 }}>{p.intro}</p>
        {p.cta && (
          <span style={{ display: "inline-block", marginTop: 18, padding: "8px 14px", borderRadius: "var(--radius-md)", background: accent, color: "#fff", fontSize: 11.5, fontWeight: 600 }}>{p.cta}</span>
        )}
      </div>
    </div>
  );
}

export function PagesEditor({ draft, update }) {
  const [page, setPage] = React.useState("Home");
  const p = draft.pages?.[page] || { headline: "", headlineAccent: "", label: "", intro: "", cta: "" };
  const set = (field) => (e) => update((d) => { if (d.pages && d.pages[page]) d.pages[page][field] = e.target.value; });
  const accent = draft.appearance?.accent || "#ff3b2f";

  return (
    <EditorLayout preview={<PagePreview page={page} draft={draft} accent={accent} />}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PAGE_LIST.map((pg) => (
          <button key={pg} type="button" onClick={() => setPage(pg)}
            style={{
              cursor: "pointer", font: "inherit", fontSize: 13, fontWeight: 500, padding: "7px 14px",
              borderRadius: 999, border: "1px solid " + (page === pg ? "var(--line-accent)" : "var(--line-1)"),
              background: page === pg ? "var(--accent-subtle)" : "transparent",
              color: page === pg ? "var(--text-body)" : "var(--text-muted)",
              transition: "all 140ms var(--ease-out)",
            }}>{pg}</button>
        ))}
      </div>
      <SectionCard title={page + " — headline"} hint="The big line at the top of the page. The italic word is set in the serif accent face.">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <Input label="Headline" value={p.headline} onChange={set("headline")} />
          <Input label="Italic accent word" hint="Leave empty for none" value={p.headlineAccent} onChange={set("headlineAccent")} />
        </div>
        <Input label="Section label" hint="The small uppercase label above the headline" value={p.label} onChange={set("label")} />
      </SectionCard>
      <SectionCard title={page + " — copy"}>
        <Input label="Intro paragraph" textarea rows={4} value={p.intro} onChange={set("intro")} />
        {p.cta !== undefined && <Input label="Button text (call to action)" value={p.cta} onChange={set("cta")} style={{ maxWidth: 320 }} />}
      </SectionCard>
    </EditorLayout>
  );
}
