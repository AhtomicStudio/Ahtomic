import React from "react";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Tabs } from "../components/display/Tabs";
import { Tag } from "../components/display/Tag";
import { Badge } from "../components/display/Badge";
import { Button } from "../components/forms/Button";
import { Page } from "./shared";

export function WorkPage({ go, data = {}, projects = [] }) {
  const [filter, setFilter] = React.useState("All");
  
  const p = data.Work || {
    label: "Selected work",
    headline: "Work",
    headlineAccent: "",
    intro: "Four products so far. One live, three in the works.",
    cta: "Start a project"
  };

  // Default fallback images mapping
  const getProjImage = (title, imgPath) => {
    if (imgPath) return imgPath;
    if (title === "CannaPickForMe") return "/assets/portfolio/cannapickforme/home.webp";
    if (title === "A Chalkboard for Two") return "/assets/portfolio/chalkboard/landing.webp";
    return "";
  };

  // Only show visible projects
  const visibleProjects = projects.filter(proj => proj.visible);
  
  // Filter based on selected tab
  const shown = visibleProjects.filter((proj) => 
    filter === "All" || (proj.tags && proj.tags.includes(filter))
  );

  return (
    <Page>
      <div className="page-top">
        <SectionLabel index="01">{p.label}</SectionLabel>
        <h1 className="page-title" style={{ margin: "24px 0 0", fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
          {p.headline} {p.headlineAccent && <span style={{ color: "var(--text-accent)" }}>{p.headlineAccent}</span>}
        </h1>
        <p style={{ margin: "16px 0 32px", fontSize: 16, color: "var(--text-secondary)", maxWidth: 520 }}>
          {p.intro}
        </p>
        <Tabs tabs={["All", "Web", "Mobile"]} value={filter} onChange={setFilter} />
        <div className="grid-2" style={{ marginTop: 32 }}>
          {shown.map((proj, i) => {
            const img = getProjImage(proj.title, proj.image);
            return (
              <div key={proj.title} data-reveal className="ah-card ah-card--pad-md work-tile" style={{ "--d": `${(i % 2) * 90}ms`, display: "flex", flexDirection: "column", gap: 14 }}>
                {img ? (
                  <img src={img} alt={proj.title} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top", borderRadius: "var(--radius-md)", border: "1px solid var(--line-1)", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "16/10", borderRadius: "var(--radius-md)", border: "1px dashed var(--line-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-disabled)" }}>No public screens yet</div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontSize: 19, fontWeight: 600 }}>{proj.title}</span>
                  {proj.live ? <Badge tone="positive" dot>Live</Badge> : <Badge tone="warning" dot>In progress</Badge>}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{proj.blurb}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {proj.tags && proj.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-body)", textDecoration: "none" }}>Visit <span style={{ color: "var(--text-accent)" }}>↗</span></a>
                  )}
                </div>
              </div>
            );
          })}
          {shown.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "48px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No projects match the selected filter.
            </div>
          )}
        </div>
        <div style={{ marginTop: 64, display: "flex", justifyContent: "center" }}>
          <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
        </div>
      </div>
    </Page>
  );
}
