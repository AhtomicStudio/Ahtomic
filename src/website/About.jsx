import React from "react";
import { m } from "motion/react";
import { revealProps } from "./motion";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Button } from "../components/forms/Button";
import { Card } from "../components/display/Card";
import { Page } from "./shared";

function CountUp({ to }) {
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const target = parseInt(to, 10);
      const t0 = performance.now();
      const dur = 900;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}</span>;
}

export function AboutPage({ go, data = {}, projects = [] }) {
  const p = data.About || {
    label: "About",
    headline: "A small studio, on",
    headlineAccent: "purpose",
    intro: "Ahtomic Studio builds websites and mobile apps from California. One person directs every project — design, scope, quality — while AI agents handle the coding.",
    cta: "Start a project"
  };

  // Dynamically calculate project counts
  const totalProjects = String(projects.length);
  const liveProjects = String(projects.filter(proj => proj.live).length);

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
          <p style={{ margin: 0 }}>We take on a few projects at a time and stay with them. Most of our work is long relationships: ship, measure, improve.</p>
        </div>
        <div className="stats-grid" style={{ marginTop: 48 }}>
          {[
            [totalProjects, "products shipped or shipping"],
            [liveProjects, "live and in use today"],
            ["1", "point of contact, always"]
          ].map(([n, d], i) => (
            <m.div key={d} {...revealProps(i * 90)}>
              <Card className="stat-card" style={{ height: "100%", padding: 20 }}>
                <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "var(--tracking-display)" }}>
                  <CountUp to={n} />
                  <span style={{ color: "var(--accent)" }}>.</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{d}</div>
              </Card>
            </m.div>
          ))}
        </div>
        <div className="btn-row" style={{ marginTop: 64 }}>
          <Button variant="primary" size="lg" onClick={() => go("Contact")}>{p.cta || "Start a project"}</Button>
          <Button variant="secondary" size="lg" onClick={() => go("Work")}>See the work</Button>
        </div>
      </div>
    </Page>
  );
}
