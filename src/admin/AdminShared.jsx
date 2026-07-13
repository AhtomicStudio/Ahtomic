import React from "react";
import * as Icons from "lucide-react";
import { Wordmark } from "../components/marketing/Wordmark";
import { Button } from "../components/forms/Button";
import { Badge } from "../components/display/Badge";

/* Native Lucide icon renderer from lucide-react */
export function Icon({ name, size = 16, stroke = 1.5, style }) {
  const LucideIcon = Icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={stroke} style={style} />;
}

const ADMIN_SECTIONS = [
  { id: "pages", label: "Pages", icon: "FileText", desc: "Edit headlines and copy" },
  { id: "projects", label: "Projects", icon: "FolderOpen", desc: "Manage portfolio work" },
  { id: "inquiries", label: "Inquiries", icon: "Inbox", desc: "Contact form submissions" },
  { id: "settings", label: "Settings", icon: "Settings", desc: "Contact and site details" },
];

export function AdminSidebar({ section, setSection, onLogout }) {
  return (
    <aside aria-label="Dashboard sections" style={{ width: 248, flexShrink: 0, borderRight: "1px solid var(--line-1)", display: "flex", flexDirection: "column", background: "var(--black-900)" }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--line-1)" }}>
        <Wordmark size={16} sub="Site dashboard" href="#" />
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: 12 }}>
        {ADMIN_SECTIONS.map((s) => {
          const active = section === s.id;
          return (
            <button key={s.id} type="button" onClick={() => setSection(s.id)} aria-current={active ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer",
                padding: "10px 12px", borderRadius: "var(--radius-md)", border: "1px solid transparent",
                background: active ? "var(--surface-raised)" : "transparent",
                borderColor: active ? "var(--line-1)" : "transparent",
                color: active ? "var(--text-body)" : "var(--text-muted)",
                font: "inherit", fontSize: 14, fontWeight: 500,
                transition: "background 140ms var(--ease-out), color 140ms var(--ease-out)",
              }}>
              <Icon name={s.icon} size={17} style={{ color: active ? "var(--text-accent)" : "currentColor" }} />
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {s.label}
                <span style={{ fontSize: 11.5, fontWeight: 400, color: "var(--text-disabled)" }}>{s.desc}</span>
              </span>
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--line-1)", display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="/" target="_blank" rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>
          <Icon name="ExternalLink" size={15} /> View live site
        </a>
        <button onClick={onLogout}
          style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "var(--danger)" }}>
          <Icon name="LogOut" size={15} /> Log out
        </button>
      </div>
    </aside>
  );
}

export function AdminTopbar({ title, dirty, onSave, onDiscard, onPublish, savedAt, publishing }) {
  return (
    <header style={{ height: 64, flexShrink: 0, borderBottom: "1px solid var(--line-1)", display: "flex", alignItems: "center", justifySpace: "between", justifyContent: "space-between", padding: "0 24px", background: "rgba(10,10,11,0.75)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: "var(--tracking-tight)" }}>{title}</h1>
        {dirty ? <Badge tone="warning" dot>Unsaved changes</Badge> : savedAt ? <Badge tone="positive" dot>All changes saved</Badge> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Button variant="ghost" size="sm" onClick={onDiscard} disabled={!dirty}>Discard changes</Button>
        <Button variant="secondary" size="sm" onClick={onSave} disabled={!dirty}>Save draft</Button>
        <Button variant="primary" size="sm" onClick={onPublish} disabled={publishing}>
          {publishing ? "Publishing..." : "Publish site"}
        </Button>
      </div>
    </header>
  );
}

export function EditorLayout({ children, preview }) {
  const [wide, setWide] = React.useState(() => window.innerWidth >= 1150);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1150px)");
    const onChange = (e) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    setWide(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const two = preview && wide;
  return (
    <div style={{ display: "grid", gridTemplateColumns: two ? "minmax(0, 1fr) minmax(0, 440px)" : "minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>{children}</div>
      {preview && (
        <div style={{ position: "sticky", top: 88, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-disabled)" }}>Live Preview</div>
          {preview}
        </div>
      )}
    </div>
  );
}

export function SectionCard({ title, hint, children }) {
  return (
    <div className="ah-card ah-card--pad-lg" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h2>
        {hint && <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{hint}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}
