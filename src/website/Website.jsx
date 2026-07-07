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

  // Canvas deformation grid logic
  React.useEffect(() => {
    const canvas = document.getElementById("grid-canvas");
    if (!canvas || !siteData) return;
    
    const a = siteData.appearance || {};
    if (!a.grid) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || a.motion === "Off";
    const ctx = canvas.getContext("2d");
    const CELL = 72, AMP = 26;
    let W = 0, H = 0, dpr = 1, field = null, fw = 0, fh = 0, fx = 0, fy = 0;
    let raf = 0, timer = 0;

    const buildField = () => {
      fw = Math.min(W * 0.38, 560); fh = 160;
      fx = W * 0.56; fy = 100;
      const off = document.createElement("canvas");
      off.width = Math.ceil(fw); off.height = fh;
      const c = off.getContext("2d");
      c.font = "700 " + Math.floor(fh * 0.72) + "px 'Space Grotesk', sans-serif";
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

    const draw = (p) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      
      // Vertical lines
      ctx.strokeStyle = "rgba(217,220,226,0.033)";
      ctx.beginPath();
      for (let x = 0.5; x < W; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      ctx.stroke();
      
      // Horizontal lines
      const bandTop = fy - AMP, bandBot = fy + fh + AMP;
      const pull = (x, y) => {
        let dy = 0, hit = 0;
        for (let s = -AMP; s <= AMP; s += 4) {
          const val = ink(x, y + s);
          if (val > 0.35) {
            const q = s * val;
            if (Math.abs(q) > Math.abs(dy)) dy = q;
            hit = Math.max(hit, val);
          }
        }
        return { dy, hit };
      };
      
      const drawDeformed = (y, alpha) => {
        ctx.strokeStyle = "rgba(217,220,226," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 4) ctx.lineTo(x, y + pull(x, y).dy * p);
        ctx.stroke();
        
        if (p > 0.15) {
          ctx.strokeStyle = "rgba(255,80,68," + (0.42 * p).toFixed(3) + ")";
          ctx.beginPath();
          let drawing = false;
          for (let x = 0; x <= W; x += 4) {
            const { dy, hit } = pull(x, y);
            if (hit) {
              if (!drawing) {
                ctx.moveTo(x, y + dy * p);
                drawing = true;
              } else {
                ctx.lineTo(x, y + dy * p);
              }
            } else {
              drawing = false;
            }
          }
          ctx.stroke();
        }
      };

      for (let y = 0.5; y < H; y += CELL) {
        if (p > 0 && y > bandTop && y < bandBot) {
          drawDeformed(y, 0.033 + 0.035 * p);
          continue;
        }
        ctx.strokeStyle = "rgba(217,220,226,0.033)";
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Sub-lines in band
      if (p > 0.05) {
        const SUB = CELL / 4;
        for (let y = 0.5 + SUB; y < H; y += SUB) {
          if (Math.abs((y - 0.5) % CELL) < 1) continue;
          if (y > bandTop && y < bandBot) drawDeformed(y, 0.05 * p);
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildField();
      draw(0);
    };

    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const cycle = () => {
      const t0 = performance.now();
      const step = (t) => {
        const el = t - t0;
        let p;
        if (el < 2000) p = ease(el / 2000);
        else if (el < 5000) p = 1;
        else if (el < 7000) p = 1 - ease((el - 5000) / 2000);
        else {
          draw(0);
          raf = 0;
          timer = setTimeout(cycle, 14000);
          return;
        }
        draw(p);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    
    // The deforming-grid signature animation only runs on "Full" motion
    if (!reduced && a.motion !== "Off" && a.motion !== "Subtle") {
      const kickoff = () => { timer = setTimeout(cycle, 3500); };
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          buildField();
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
      if (timer) clearTimeout(timer);
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
