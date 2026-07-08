import React from "react";
import { Input } from "../components/forms/Input";
import { Switch } from "../components/forms/Switch";
import { Button } from "../components/forms/Button";
import { Radio } from "../components/forms/Radio";
import { EditorLayout, SectionCard } from "./AdminShared";

const ACCENT_CHOICES = [
  { name: "Signal red", value: "#ff3b2f" },
  { name: "Crimson", value: "#e03e36" },
  { name: "Coral", value: "#ff6a55" },
  { name: "Deep red", value: "#e02318" },
];

function AppearancePreview({ draft }) {
  const a = draft.appearance || {};
  return (
    <div className="ah-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ position: "relative", padding: "34px 26px 38px", overflow: "hidden" }}>
        {a.grid && (
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(217,220,226,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(217,220,226,0.05) 1px, transparent 1px)", backgroundSize: "36px 36px", maskImage: "linear-gradient(180deg, black, transparent 90%)", WebkitMaskImage: "linear-gradient(180deg, black, transparent 90%)" }}></div>
        )}
        {a.glow && <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(320px 160px at 50% 115%, " + a.accent + "2e, transparent 70%)" }}></div>}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.15 }}>
            Websites and apps, built{" "}
            <em style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: 0, ...(a.sheen ? { background: "var(--silver-sheen)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } : {}) }}>properly</em>
            <span style={{ color: a.accent }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <span style={{ padding: "7px 13px", borderRadius: "var(--radius-md)", background: a.accent, color: "#fff", fontSize: 11, fontWeight: 600 }}>Start a project</span>
            <span style={{ padding: "7px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--line-2)", color: "var(--text-secondary)", fontSize: 11, fontWeight: 500 }}>See the work</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppearanceEditor({ draft, update }) {
  const a = draft.appearance || {};
  const setBool = (field) => (e) => update((d) => { if (d.appearance) d.appearance[field] = e.target.checked; });
  return (
    <EditorLayout preview={<AppearancePreview draft={draft} />}>
      <SectionCard title="Accent color" hint="Used for buttons, links, the headline period, and background glows.">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {ACCENT_CHOICES.map((c) => {
            const active = a.accent === c.value;
            return (
              <button key={c.value} type="button" onClick={() => update((d) => { if (d.appearance) d.appearance.accent = c.value; })}
                aria-pressed={active} aria-label={"Set accent color to " + c.name}
                style={{
                  cursor: "pointer", font: "inherit", display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 14px 8px 8px", borderRadius: 999,
                  border: "1px solid " + (active ? "var(--line-accent)" : "var(--line-1)"),
                  background: active ? "var(--accent-subtle)" : "transparent",
                  color: active ? "var(--text-body)" : "var(--text-muted)", fontSize: 13, fontWeight: 500,
                }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: c.value, boxShadow: active ? "0 0 0 2px var(--surface-page), 0 0 0 3.5px " + c.value : "none" }}></span>
                {c.name}
              </button>
            );
          })}
        </div>
      </SectionCard>
      <SectionCard title="Background effects" hint="All effects are lightweight and switch off automatically for visitors who prefer reduced motion.">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Switch label="Red glow behind page content" checked={a.glow} onChange={setBool("glow")} />
          <Switch label="Faint background grid" checked={a.grid} onChange={setBool("grid")} />
          <Switch label="Film grain texture" checked={a.grain} onChange={setBool("grain")} />
          <Switch label="Silver shine on the italic headline word" checked={a.sheen} onChange={setBool("sheen")} />
        </div>
      </SectionCard>
      <SectionCard title="Motion" hint="How much things move as visitors scroll and navigate.">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {["Full", "Subtle", "Off"].map((m) => (
            <Radio key={m} name="motion" label={m} checked={a.motion === m} onChange={() => update((d) => { if (d.appearance) d.appearance.motion = m; })} />
          ))}
        </div>
      </SectionCard>
    </EditorLayout>
  );
}

export function SettingsEditor({ draft, update }) {
  const s = draft.settings || {};
  const set = (field) => (e) => update((d) => { if (d.settings) d.settings[field] = e.target.value; });
  return (
    <EditorLayout>
      <SectionCard title="Contact details" hint="Shown in the footer and used by the contact form.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label="Contact email" type="email" value={s.email || ""} onChange={set("email")} />
          <Input label="Location line" value={s.location || ""} onChange={set("location")} />
        </div>
        <Input label="Reply-time promise" hint='Shown on the contact page, e.g. "Replies within 2 days"' value={s.replyTime || ""} onChange={set("replyTime")} style={{ maxWidth: 420 }} />
      </SectionCard>
      <SectionCard title="Footer">
        <Input label="Footer tagline" value={s.footerTagline || ""} onChange={set("footerTagline")} />
        <Input label="Copyright line" value={s.copyright || ""} onChange={set("copyright")} style={{ maxWidth: 420 }} />
      </SectionCard>
      <SectionCard title="Browser tab" hint="What shows in search results and the browser tab.">
        <Input label="Site title" value={s.siteTitle || ""} onChange={set("siteTitle")} />
        <Input label="Site description" textarea rows={2} value={s.siteDescription || ""} onChange={set("siteDescription")} />
      </SectionCard>
    </EditorLayout>
  );
}
