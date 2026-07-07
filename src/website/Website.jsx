import React from "react";
import { Button } from "../components/forms/Button";
import { Nav, Footer, BackToTop, Page, pathFor } from "./shared";
import { HomePage } from "./Home";
import { WorkPage } from "./Work";
import { ServicesPage } from "./Services";
import { AboutPage } from "./About";
import { ContactPage } from "./Contact";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const DEFAULT_CONTENT = {
  pages: {
    Home: { label: "Web studio · California", headline: "Everything, down to the", headlineAccent: "atom", intro: "Small studio, serious software. One person directs every project; AI agents handle the build. Fast, focused, no agency overhead.", cta: "Start a project" },
    Work: { label: "Selected work", headline: "Work", headlineAccent: "", intro: "Four products so far. One live, three in the works.", cta: "Start a project" },
    Services: { label: "Services", headline: "Design, build, ship", headlineAccent: "Usually all three.", intro: "Not sure which of these you need? That's normal. Tell us what you're building and we'll figure it out together.", cta: "Start a project" },
    About: { label: "About", headline: "A small studio, on", headlineAccent: "purpose", intro: "Ahtomic Studio builds websites and mobile apps from California. One person directs every project — design, scope, quality — while AI agents handle the coding.", cta: "Start a project" },
    Contact: { label: "Contact", headline: "Start a", headlineAccent: "project", intro: "Tell us what you're building. A few sentences is plenty — we'll reply within two days with honest thoughts on scope, budget, and whether we're the right fit.", cta: "Send it" },
  },
  projects: [
    { title: "CannaPickForMe", meta: "Web app · Live", tags: ["Web"], live: true, visible: true, url: "https://cannapickforme.com", blurb: "A strain matcher for adults 21+. Four questions, one personalized pick from 200+ strains." },
    { title: "A Chalkboard for Two", meta: "Web app", tags: ["Web"], live: false, visible: true, blurb: "One shared chalkboard, split down the middle. Built for leaving little notes between two people over a private link." },
    { title: "Snapacat", meta: "Mobile app · In progress", tags: ["Mobile"], live: false, visible: true, blurb: "Log photos and notes of neighborhood cats; the app turns each cat into a sprite you can collect." },
    { title: "BudSnap", meta: "Mobile app · In progress", tags: ["Mobile"], live: false, visible: true, blurb: "A living Pokédex for cannabis. A fun way of logging for a forgetful demographic." },
  ],
  appearance: { accent: "#ff3b2f", glow: true, grid: true, grain: true, cursorGlow: true, sheen: true, motion: "Full" },
  settings: { email: "ahtomicstudio@gmail.com", location: "California · Remote-friendly", replyTime: "Replies within 2 days", footerTagline: "Websites and mobile apps, designed and built.", copyright: "© 2026 Ahtomic Studio", siteTitle: "Ahtomic Studio — Websites and apps, built properly", siteDescription: "A small web studio shipping websites and mobile apps. One person directs every project; AI agents handle the build." },
};

const PAGES = ["Home", "Work", "Services", "About", "Contact"];

// Resolve the current URL to a page name; null means 404.
// Legacy hash URLs (/#work) still resolve so old links keep working.
const fromLocation = () => {
  const h = window.location.hash.replace("#", "").toLowerCase();
  const hashPage = PAGES.find((p) => p.toLowerCase() === h);
  if (hashPage) return hashPage;
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/") return "Home";
  return PAGES.find((p) => "/" + p.toLowerCase() === path) || null;
};

export function WebsiteView() {
  const [page, setPage] = React.useState(fromLocation);
  const [siteData, setSiteData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const go = (p) => {
    if (p !== page) {
      window.history.pushState({}, "", pathFor(p));
      setPage(p);
    }
    window.scrollTo(0, 0);
  };

  // Normalize legacy hash URLs to real paths once on mount
  React.useEffect(() => {
    if (window.location.hash && page) {
      window.history.replaceState({}, "", pathFor(page));
    }
  }, []);

  // Load public data on mount
  React.useEffect(() => {
    const fetchPublicData = async () => {
      try {
        if (db) {
          const docRef = doc(db, "site-content", "public");
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setSiteData(snap.data());
          } else {
            setSiteData(DEFAULT_CONTENT);
          }
        } else {
          // Fallback to localStorage or default
          const raw = localStorage.getItem("ahtomic-dashboard-public-v1") || localStorage.getItem("ahtomic-dashboard-draft-v1");
          setSiteData(raw ? JSON.parse(raw) : DEFAULT_CONTENT);
        }
      } catch (err) {
        console.error("Failed to fetch public site content:", err);
        setSiteData(DEFAULT_CONTENT);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  // Browser back/forward
  React.useEffect(() => {
    const onPop = () => {
      setPage(fromLocation());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Per-page title, meta description, and canonical URL
  React.useEffect(() => {
    if (!siteData) return;
    const settings = siteData.settings || {};
    const brand = settings.siteTitle ? settings.siteTitle.split(" — ")[0] : "Ahtomic Studio";
    document.title = page === "Home"
      ? (settings.siteTitle || "Ahtomic Studio — Websites and apps, built properly")
      : page
        ? `${page} — ${brand}`
        : `Page not found — ${brand}`;

    // Home uses the site description; other pages use their intro copy
    const pageData = page ? (siteData.pages || {})[page] : null;
    const desc = page === "Home"
      ? (settings.siteDescription || "")
      : (pageData && pageData.intro) || settings.siteDescription || "";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && desc) metaDesc.setAttribute("content", desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && page) canonical.setAttribute("href", "https://ahtomic.studio" + (page === "Home" ? "/" : pathFor(page)));
  }, [page, siteData]);

  // Reveal elements on scroll
  React.useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page, loading]);

  // Ambient parallax scrolling effect
  React.useEffect(() => {
    const amb = document.getElementById("ambient");
    const onScroll = () => {
      if (amb) amb.style.transform = `translateY(${window.scrollY * -0.04}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor glow effect
  React.useEffect(() => {
    const glow = document.getElementById("cursor-glow");
    if (!glow || window.matchMedia("(hover: none)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false;
    const tick = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; x = tx; y = ty; glow.style.opacity = "1"; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => { glow.style.opacity = "0"; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Canvas grid: word-warp reveal ("Ahtomic") + electrical pulses along the lines
  React.useEffect(() => {
    const canvas = document.getElementById("grid-canvas");
    if (!canvas || !siteData) return;

    const a = siteData.appearance || {};
    if (!a.grid) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || a.motion === "Off";
    const animate = !reduced && a.motion !== "Subtle";
    const ctx = canvas.getContext("2d");
    const CELL = 72, AMP = 30, STEP = 2, SUB = CELL / 6;
    const BASE = "rgba(217,220,226,0.033)";
    let W = 0, H = 0, dpr = 1, field = null, fw = 0, fh = 0, fx = 0, fy = 0;
    let bandLines = []; // precomputed displacement per line: { y, sub, dys, hits }
    let raf = 0, wordTimer = 0, pulseTimer = 0;
    let wordT0 = -1;    // start time of active word reveal, -1 = idle
    let pulses = [];
    let lastT = 0;

    const buildField = () => {
      // Bigger letterform than v1 (160px -> 200px tall, wider box) = legible strokes
      fh = 200;
      fw = Math.min(W * 0.5, 720);
      fx = Math.max(W * 0.52, W - fw - 48); fy = 72;
      const off = document.createElement("canvas");
      off.width = Math.ceil(fw); off.height = fh;
      const c = off.getContext("2d");
      c.font = "700 " + Math.floor(fh * 0.7) + "px 'Space Grotesk', sans-serif";
      c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = "#fff";
      c.fillText("Ahtomic", fw / 2, fh / 2);
      field = c.getImageData(0, 0, off.width, off.height);
    };

    const ink = (x, y) => {
      if (!field) return 0;
      const px = Math.round(x - fx), py = Math.round(y - fy);
      if (px < 0 || py < 0 || px >= field.width || py >= field.height) return 0;
      return field.data[(py * field.width + px) * 4 + 3] / 255;
    };

    // Precompute how each band line bends. Instead of "push away from ink"
    // (v1 — smeared the glyphs), each point is attracted to the weighted
    // CENTER of nearby ink, so lines converge onto stroke centerlines and
    // the word reads cleanly when several lines bunch onto it.
    const computeLine = (y) => {
      const n = Math.floor(W / STEP) + 1;
      const dys = new Float32Array(n), hits = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = i * STEP;
        let wsum = 0, csum = 0;
        for (let s = -AMP; s <= AMP; s += 2) {
          const val = ink(x, y + s);
          if (val > 0.3) {
            // distance falloff: lines sitting on/near a stroke snap to its
            // center; lines further away bend gently instead of spiking
            const w = val * (1 - 0.8 * Math.pow(Math.abs(s) / AMP, 2));
            wsum += w; csum += s * w;
          }
        }
        if (wsum > 0) dys[i] = csum / wsum;
      }
      // small box blur along x so bends flow instead of kinking
      const sm = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let acc = 0, cnt = 0;
        for (let k = -2; k <= 2; k++) { const j = i + k; if (j >= 0 && j < n) { acc += dys[j]; cnt++; } }
        sm[i] = acc / cnt;
      }
      // red only where the bent line actually lands on a glyph stroke —
      // keeps the red the letterform itself, not the warp artifacts
      for (let i = 0; i < n; i++) hits[i] = ink(i * STEP, y + sm[i]);
      return { y, dys: sm, hits };
    };

    const buildBand = () => {
      bandLines = [];
      if (!field) return;
      const top = fy - AMP, bot = fy + fh + AMP;
      for (let y = 0.5; y < H; y += CELL) {
        if (y > top && y < bot) bandLines.push({ sub: false, ...computeLine(y) });
      }
      for (let y = 0.5 + SUB; y < H; y += SUB) {
        if (Math.abs((y - 0.5) % CELL) < 1) continue;
        if (y > top && y < bot) bandLines.push({ sub: true, ...computeLine(y) });
      }
    };

    const drawLine = (line, p, alpha) => {
      ctx.strokeStyle = "rgba(217,220,226," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, line.y);
      for (let i = 0; i < line.dys.length; i++) ctx.lineTo(i * STEP, line.y + line.dys[i] * p);
      ctx.stroke();
      // red trace only where the line actually sits on a glyph stroke
      if (p > 0.2) {
        ctx.strokeStyle = "rgba(255,80,68," + (0.6 * p).toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let drawing = false;
        for (let i = 0; i < line.dys.length; i++) {
          if (line.hits[i] > 0.5) {
            const px = i * STEP, py = line.y + line.dys[i] * p;
            if (!drawing) { ctx.moveTo(px, py); drawing = true; } else ctx.lineTo(px, py);
          } else drawing = false;
        }
        ctx.stroke();
      }
    };

    const draw = (p) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = BASE;
      ctx.beginPath();
      for (let x = 0.5; x < W; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      ctx.stroke();

      const top = fy - AMP, bot = fy + fh + AMP;
      ctx.beginPath();
      for (let y = 0.5; y < H; y += CELL) {
        if (p > 0 && y > top && y < bot) continue; // drawn deformed below
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();

      if (p > 0) {
        for (const line of bandLines) {
          if (line.sub) { if (p > 0.05) drawLine(line, p, 0.045 * p); }
          else drawLine(line, p, 0.033 + 0.04 * p);
        }
      }
    };

    // --- Electrical pulses: a bright head with a fading tail that runs along
    // grid lines, occasionally turning 90° at intersections. Random timing,
    // random routes; capped so red stays a signal, not a wash.
    const snap = (v) => 0.5 + Math.round((v - 0.5) / CELL) * CELL;
    const makePulse = () => {
      const pts = [];
      const horiz = Math.random() < 0.55;
      // bias spawns toward the upper 2/3 where the canvas mask keeps them visible
      let x = snap(Math.random() * W);
      let y = snap(Math.random() * H * 0.66);
      let dir = Math.random() < 0.5 ? 1 : -1;
      let axis = horiz ? "x" : "y";
      if (axis === "x") x = dir === 1 ? -CELL : W + CELL;
      pts.push({ x, y });
      const turns = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0;
      let total = 0;
      const segs = turns + 1;
      for (let i = 0; i < segs; i++) {
        const len = snap(CELL * (2 + Math.random() * (i === segs - 1 ? 9 : 4))) - 0.5;
        if (axis === "x") x += dir * len; else y += dir * len;
        pts.push({ x, y });
        total += len;
        axis = axis === "x" ? "y" : "x";
        dir = Math.random() < 0.5 ? 1 : -1;
      }
      return {
        pts, total,
        dist: 0,
        speed: 280 + Math.random() * 360,
        tail: 70 + Math.random() * 90,
        glow: Math.random() < 0.35, // some pulses run hotter
      };
    };

    const pointAt = (pulse, d) => {
      if (d <= 0) d = 0;
      let acc = 0;
      for (let i = 1; i < pulse.pts.length; i++) {
        const a0 = pulse.pts[i - 1], a1 = pulse.pts[i];
        const len = Math.abs(a1.x - a0.x) + Math.abs(a1.y - a0.y);
        if (d <= acc + len) {
          const t = len === 0 ? 0 : (d - acc) / len;
          return { x: a0.x + (a1.x - a0.x) * t, y: a0.y + (a1.y - a0.y) * t };
        }
        acc += len;
      }
      return pulse.pts[pulse.pts.length - 1];
    };

    const drawPulses = (dt) => {
      for (const pu of pulses) pu.dist += pu.speed * dt;
      pulses = pulses.filter((pu) => pu.dist - pu.tail < pu.total);
      for (const pu of pulses) {
        const head = Math.min(pu.dist, pu.total);
        const maxA = pu.glow ? 0.6 : 0.4;
        const N = 9;
        for (let i = 0; i < N; i++) {
          const d0 = pu.dist - pu.tail + (pu.tail * i) / N;
          const d1 = pu.dist - pu.tail + (pu.tail * (i + 1)) / N;
          if (d1 <= 0 || d0 >= pu.total) continue;
          const p0 = pointAt(pu, d0), p1 = pointAt(pu, Math.min(d1, pu.total));
          ctx.strokeStyle = "rgba(255,80,68," + (maxA * ((i + 1) / N)).toFixed(3) + ")";
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
        if (pu.dist <= pu.total) {
          const hp = pointAt(pu, head);
          ctx.save();
          if (pu.glow) { ctx.shadowColor = "rgba(255,59,47,0.9)"; ctx.shadowBlur = 10; }
          ctx.fillStyle = "rgba(255,120,105,0.95)";
          ctx.beginPath(); ctx.arc(hp.x, hp.y, pu.glow ? 1.8 : 1.3, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }
    };

    // --- One shared frame loop; runs only while something is animating.
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const wordP = (now) => {
      if (wordT0 < 0) return 0;
      const el = now - wordT0;
      if (el < 2000) return ease(el / 2000);
      if (el < 6500) return 1;                      // hold longer (was 3s) — time to read it
      if (el < 8300) return 1 - ease((el - 6500) / 1800);
      wordT0 = -1;
      wordTimer = setTimeout(startWord, 12000 + Math.random() * 6000);
      return 0;
    };

    const loop = (t) => {
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      draw(wordP(t));
      drawPulses(dt);
      if (wordT0 >= 0 || pulses.length) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        draw(0);
      }
    };

    const ensureLoop = () => {
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); }
    };

    const startWord = () => { wordT0 = performance.now(); ensureLoop(); };
    const spawnPulse = () => {
      if (pulses.length < 3) {
        pulses.push(makePulse());
        if (Math.random() < 0.25 && pulses.length < 3) pulses.push(makePulse()); // occasional double-strike
      }
      ensureLoop();
      pulseTimer = setTimeout(spawnPulse, 1800 + Math.random() * 3800);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildField();
      buildBand();
      draw(0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Word reveal + pulses only on "Full" motion
    if (animate) {
      const kickoff = () => {
        wordTimer = setTimeout(startWord, 3500);
        pulseTimer = setTimeout(spawnPulse, 1600);
      };
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          buildField();
          buildBand();
          draw(0);
          kickoff();
        });
      } else {
        kickoff();
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      if (wordTimer) clearTimeout(wordTimer);
      if (pulseTimer) clearTimeout(pulseTimer);
    };
  }, [siteData]);

  // Apply admin-controlled appearance settings to the document
  React.useEffect(() => {
    if (!siteData) return;
    const a = siteData.appearance || {};
    const accent = a.accent || "#ff3b2f";
    // Hover shades for each accent choice offered in the dashboard
    const HOVER = { "#ff3b2f": "#ff6a55", "#e03e36": "#ff6a55", "#ff6a55": "#ff8a78", "#e02318": "#ff3b2f" };
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-hover", HOVER[accent] || accent);
    document.documentElement.dataset.motion = a.motion || "Full";
    document.documentElement.dataset.sheen = String(a.sheen !== false);
  }, [siteData]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
        Loading Ahtomic Studio...
      </div>
    );
  }

  const a = siteData.appearance || {};

  const pages = {
    Home: <HomePage go={go} data={siteData.pages} projects={siteData.projects} />,
    Work: <WorkPage go={go} data={siteData.pages} projects={siteData.projects} />,
    Services: <ServicesPage go={go} data={siteData.pages} />,
    About: <AboutPage go={go} data={siteData.pages} projects={siteData.projects} />,
    Contact: <ContactPage data={siteData} />,
  };

  return (
    <div data-screen-label={page || "404"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <a href="#main-content" className="skip-link" onClick={(e) => { e.preventDefault(); const m = document.getElementById("main-content"); if (m) m.focus(); }}>Skip to content</a>
      
      {a.grid && (
        <div className="backdrop" aria-hidden="true">
          <canvas id="grid-canvas"></canvas>
        </div>
      )}
      
      {a.glow !== false && (
        <div className="ambient" id="ambient" aria-hidden="true">
          {PAGES.map((p) => (
            <div key={p} className={`amb-${p}`} data-on={String(p === page)}></div>
          ))}
        </div>
      )}
      
      {a.cursorGlow && (
        <div className="cursor-glow" id="cursor-glow" aria-hidden="true"></div>
      )}

      {a.grain && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99, pointerEvents: "none", opacity: 0.15,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.86 0 0 0 0 0.89 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}></div>
      )}

      <Nav page={page} go={go} />
      
      <main id="main-content" tabIndex={-1} key={page || "404"} className="page-enter" style={{ flex: 1, position: "relative", zIndex: 1, outline: "none" }}>
        {page ? pages[page] : <NotFound go={go} />}
      </main>
      
      <Footer go={go} settings={siteData.settings} />
      <BackToTop />
    </div>
  );
}

function NotFound({ go }) {
  return (
    <Page>
      <div className="page-top" style={{ maxWidth: 640, paddingBottom: 40 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>
          404 — page not found
        </div>
        <h1 className="page-title" style={{ margin: "24px 0 0", fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
          Nothing at this address<span style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p style={{ margin: "20px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
          The page moved, or it never existed. Thom checked twice.
        </p>
        <div className="btn-row" style={{ marginTop: 36, alignItems: "center" }}>
          <Button variant="primary" size="lg" onClick={() => go("Home")}>Back to home</Button>
          <img src="/assets/mascot/thom.webp" alt="Thom the mascot, shrugging" className="thom" style={{ height: 44, width: "auto" }} />
        </div>
      </div>
    </Page>
  );
}
