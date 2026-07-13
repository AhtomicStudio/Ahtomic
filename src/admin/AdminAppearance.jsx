import React from "react";
import { Input } from "../components/forms/Input";
import { EditorLayout, SectionCard } from "./AdminShared";

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
