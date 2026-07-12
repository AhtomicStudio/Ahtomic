import React from "react";
import { m } from "motion/react";
import { revealProps } from "./motion";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Badge } from "../components/display/Badge";
import { Tag } from "../components/display/Tag";
import { Button } from "../components/forms/Button";
import { Page, projectImage } from "./shared";

const SECTIONS = [
  ["challenge", "The challenge"],
  ["approach", "The approach"],
  ["outcome", "The outcome"],
];

export function ProjectDetailPage({ go, project }) {
  const img = projectImage(project);

  return (
    <Page>
      <div className="page-top" style={{ maxWidth: 720 }}>
        <SectionLabel index="01">{(project.tags && project.tags[0]) || "Case study"}</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
          <h1 className="page-title" style={{ margin: 0, fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
            {project.title}<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          {project.live ? <Badge tone="positive" dot>Live</Badge> : <Badge tone="warning" dot>In progress</Badge>}
        </div>
        {project.blurb && (
          <p style={{ margin: "20px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
            {project.blurb}
          </p>
        )}
        <div className="btn-row" style={{ marginTop: 28 }}>
          {project.url && (
            <Button variant="primary" size="lg" href={project.url} target="_blank" rel="noreferrer">
              Visit the live site <span aria-hidden="true">↗</span>
            </Button>
          )}
          <Button variant="secondary" size="lg" onClick={() => go("Work")}>Back to work</Button>
        </div>
      </div>

      {img && (
        <m.div {...revealProps(0)} style={{ marginTop: 48 }}>
          <img
            src={img}
            alt={project.title}
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "top", borderRadius: "var(--radius-md)", border: "1px solid var(--line-1)", display: "block" }}
          />
        </m.div>
      )}

      {project.tags && project.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {project.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      )}

      <div style={{ maxWidth: 640, marginTop: 80, display: "flex", flexDirection: "column", gap: 40 }}>
        {SECTIONS.map(([field, label], i) => project[field] && (
          <m.div key={field} {...revealProps(i * 90)}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
              {label}
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
              {project[field]}
            </p>
          </m.div>
        ))}
      </div>

      <div className="svc-cta" style={{ marginTop: 80, borderTop: "1px solid var(--line-1)", paddingTop: 32, maxWidth: 640 }}>
        <p style={{ margin: 0, fontSize: 16, color: "var(--text-secondary)", maxWidth: 480 }}>
          Building something like this? Tell us what you're working on.
        </p>
        <Button variant="primary" size="lg" onClick={() => go("Contact")}>Start a project</Button>
      </div>
    </Page>
  );
}
