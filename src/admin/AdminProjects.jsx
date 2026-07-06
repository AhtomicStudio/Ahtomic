import React from "react";
import { Input } from "../components/forms/Input";
import { Button } from "../components/forms/Button";
import { Badge } from "../components/display/Badge";
import { Tag } from "../components/display/Tag";
import { Switch } from "../components/forms/Switch";
import { EditorLayout, Icon } from "./AdminShared";

export function ProjectsEditor({ draft, update }) {
  const [editing, setEditing] = React.useState(null); // index being edited
  const projects = draft.projects || [];
  
  const move = (i, dir) => update((d) => {
    const j = i + dir;
    if (j < 0 || j >= d.projects.length) return;
    const [it] = d.projects.splice(i, 1);
    d.projects.splice(j, 0, it);
  });
  
  const setField = (i, field) => (e) => update((d) => { d.projects[i][field] = e.target.value; });
  
  const addProject = () => {
    update((d) => { 
      if (!d.projects) d.projects = [];
      d.projects.push({ title: "New project", meta: "Web app", tags: ["Web"], blurb: "", live: false, visible: true }); 
    });
    setEditing(projects.length);
  };

  return (
    <EditorLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-muted)" }}>Shown on the Work page and the home page grid, in this order.</p>
        <Button variant="secondary" size="sm" onClick={addProject}>
          <Icon name="Plus" size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} />
          Add project
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {projects.map((p, i) => (
          <div key={i} className="ah-card ah-card--pad-md" style={{ display: "flex", flexDirection: "column", gap: 14, opacity: p.visible ? 1 : 0.55 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={"Move " + p.title + " up"} style={{ all: "unset", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? "var(--text-disabled)" : "var(--text-muted)", lineHeight: 0, padding: 2 }}>
                  <Icon name="ChevronUp" size={15} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label={"Move " + p.title + " down"} style={{ all: "unset", cursor: i === projects.length - 1 ? "default" : "pointer", color: i === projects.length - 1 ? "var(--text-disabled)" : "var(--text-muted)", lineHeight: 0, padding: 2 }}>
                  <Icon name="ChevronDown" size={15} />
                </button>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{p.title}</span>
                <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{p.meta}</span>
                {p.live ? <Badge tone="positive" dot>Live</Badge> : <Badge tone="warning" dot>In progress</Badge>}
              </div>
              <Switch label={p.visible ? "Shown" : "Hidden"} checked={p.visible} onChange={(e) => update((d) => { d.projects[i].visible = e.target.checked; })} />
              <Button variant="ghost" size="sm" onClick={() => setEditing(editing === i ? null : i)}>
                {editing === i ? "Close" : "Edit"}
              </Button>
            </div>
            {editing === i && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--line-1)", paddingTop: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Input label="Project name" value={p.title} onChange={setField(i, "title")} />
                  <Input label="Type line" hint='e.g. "Web app · Live"' value={p.meta} onChange={setField(i, "meta")} />
                </div>
                <Input label="Description" textarea rows={3} value={p.blurb} onChange={setField(i, "blurb")} />
                <Input label="Live URL" hint="Shown as a Visit link on the Work page when set" placeholder="https://" value={p.url || ""} onChange={setField(i, "url")} style={{ maxWidth: 420 }} />
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <Switch label="Mark as live" checked={p.live} onChange={(e) => update((d) => { d.projects[i].live = e.target.checked; })} />
                  <div style={{ display: "flex", gap: 6 }}>
                    {(p.tags || []).map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                  <Button variant="ghost" size="sm" style={{ marginLeft: "auto", color: "var(--danger)" }}
                    onClick={() => { setEditing(null); update((d) => { d.projects.splice(i, 1); }); }}>
                    <Icon name="Trash2" size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                    Delete project
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="ah-card ah-card--pad-md" style={{ textAlign: "center", color: "var(--text-muted)", borderStyle: "dashed" }}>
            No projects added yet. Click "Add project" to start building your portfolio.
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
