import React from "react";
import { AnimatePresence, m } from "motion/react";
import { MotionProvider, pageTransition } from "./motion";
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
  appearance: { accent: "#ff3b2f", glow: true, grid: true, grain: true, sheen: true, motion: "Full" },
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

  // Scroll reveals are now handled per-component by Framer Motion's
  // whileInView (see revealVariants in ./motion) — no page-level observer
  // needed; it re-evaluates naturally on every render, including content
  // that changes without a page navigation (e.g. the Work page's tabs).

  // Ambient parallax scrolling effect
  React.useEffect(() => {
    const amb = document.getElementById("ambient");
    const onScroll = () => {
      if (amb) amb.style.transform = `translateY(${window.scrollY * -0.04}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    const CELL = 72;
    const BASE = "rgba(217,220,226,0.033)";
    let W = 0, H = 0, dpr = 1, field = null, fw = 0, fh = 0, fx = 0, fy = 0;
    let particles = []; // each: { tx, ty, gridX, gridY, delay, exitDelay, orbitRad, orbitSpeed, orbitAngle, mx, my, mvx, mvy, color }
    let raf = 0, wordTimer = 0, pulseTimer = 0;
    let wordT0 = -1;    // start time of active word reveal, -1 = idle
    let wordPhase = "idle", lastWordPhase = "idle";
    let pulses = [];
    let sparks = [];
    let textPulses = []; // electricity pulses running on the letter particle paths
    let lastT = 0;

    // Real-time pointer tracking variables for logo hover intensification
    let mouseX = -10000, mouseY = -10000;

    const buildField = () => {
      // The offscreen canvas that captures the letterform must always be
      // sized to fit the FULL measured word — a fixed font size on a fixed
      // narrow canvas silently cropped "Ahtomic" to a centered slice that
      // read as "ton" on mobile. Font size scales with viewport width, and
      // if the measured word still overflows the available space, we shrink
      // the font until it fits, so the whole word is always captured.
      const margin = 16;
      const maxFieldWidth = Math.max(160, W - margin * 2);
      const measure = document.createElement("canvas").getContext("2d");
      let fontPx = Math.round(Math.max(40, Math.min(140, W * 0.11)));
      measure.font = "700 " + fontPx + "px 'Space Grotesk', sans-serif";
      let textWidth = measure.measureText("Ahtomic").width;
      if (textWidth > maxFieldWidth) {
        fontPx = Math.max(24, Math.floor(fontPx * (maxFieldWidth / textWidth)));
        measure.font = "700 " + fontPx + "px 'Space Grotesk', sans-serif";
        textWidth = measure.measureText("Ahtomic").width;
      }

      fh = Math.round(fontPx * 1.5);
      fw = Math.ceil(textWidth + 24); // small pad so glyph edges never touch the canvas edge
      fx = Math.max(margin, Math.min(W * 0.52, W - fw - margin));
      fy = 72;
      const off = document.createElement("canvas");
      off.width = fw; off.height = fh;
      const c = off.getContext("2d");
      c.font = "700 " + fontPx + "px 'Space Grotesk', sans-serif";
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

    const buildBand = () => {
      particles = [];
      textPulses = [];
      if (!field) return;

      // Scan offscreen canvas to extract potential pixel coordinates (denser scan for higher count)
      const candidates = [];
      for (let x = 0; x < fw; x += 1) {
        for (let y = 0; y < fh; y += 1) {
          const val = ink(x + fx, y + fy);
          if (val > 0.35) {
            candidates.push({ x, y });
          }
        }
      }

      // Sample a dense subset (800 particles) for rich, high-fidelity letter definitions
      const numParticles = Math.min(800, candidates.length);
      const step = candidates.length / numParticles;
      for (let i = 0; i < numParticles; i++) {
        const candidate = candidates[Math.floor(i * step)];
        if (!candidate) continue;

        const tx = candidate.x + fx;
        const ty = candidate.y + fy;

        // nearest grid intersection
        const gridX = 0.5 + Math.round((tx - 0.5) / CELL) * CELL;
        const gridY = 0.5 + Math.round((ty - 0.5) / CELL) * CELL;

        // Progressive left-to-right sweep stagger delay
        const staggerX = (tx - fx) / fw;
        const flowDelay = staggerX * 2.5 + Math.random() * 0.3; // sweeps from left to right (max 2.8s)
        const exitDelay = (1.0 - staggerX) * 0.9 + Math.random() * 0.2; // exits in reverse (max 1.1s)

        // Emergence travel speed: 220px/s (majestic controlled crawl)
        const dist = Math.hypot(tx - gridX, ty - gridY);
        const flowSpeed = 220;
        const flowDuration = Math.max(0.15, dist / flowSpeed);

        // Orbit physics: electrical vibration
        const orbitRad = 0.8 + Math.random() * 2.2;
        const orbitSpeed = (1.0 + Math.random() * 1.6) * (Math.random() < 0.5 ? 1 : -1);
        const orbitAngle = Math.random() * Math.PI * 2;

        particles.push({
          tx, ty,
          gridX, gridY,
          flowDelay,
          exitDelay,
          flowDuration,
          orbitRad,
          orbitSpeed,
          orbitAngle,
          color: Math.random() < 0.25 ? "rgba(255,140,120," : "rgba(255,80,68,"
        });
      }
    };

    // Calculate dynamic coords for a single particle based on elapsed time, orbit, and scroll Y
    const getOffsets = (pt, el, dt, currentScrollY) => {
      const ease = (val) => 1 - Math.pow(1 - val, 3);

      const ox = Math.cos(pt.orbitAngle) * pt.orbitRad;
      const oy = Math.sin(pt.orbitAngle) * pt.orbitRad;

      // Base target coordinates of particle
      let rx = pt.tx + ox;
      let ry = pt.ty + oy;
      let opacity = 1;
      let scale = 1;

      if (wordPhase === "in") {
        // Waterfall cascade: emergence speed matching grid pulses
        const localEl = el - pt.flowDelay * 1000;
        let lp = localEl / (pt.flowDuration * 1000);
        lp = Math.max(0, Math.min(1, lp));
        const easeLP = ease(lp);
        
        // Sagging waterfall curve: add vertical curve drag offset that decays as easeLP -> 1
        rx = pt.gridX + (pt.tx + ox - pt.gridX) * easeLP;
        ry = pt.gridY + (pt.ty + oy - pt.gridY) * easeLP + Math.sin((1.0 - easeLP) * Math.PI) * 45;
        scale = easeLP;
        opacity = Math.min(1.0, easeLP * 2.0);
      } else if (wordPhase === "out") {
        // Synchronized retreat: slide particles back to their spawning intersections
        const exitStart = pt.exitDelay * 1000;
        const exitDuration = Math.max(200, 2400 - exitStart - 200); // completed 200ms before phase end
        const localEl = (el - 11800) - exitStart;
        let lp = 1.0 - (localEl / exitDuration);
        lp = Math.max(0, Math.min(1, lp));
        const easeLP = ease(lp);
        
        rx = pt.gridX + (pt.tx + ox - pt.gridX) * easeLP;
        ry = pt.gridY + (pt.ty + oy - pt.gridY) * easeLP;
        scale = easeLP;
        opacity = Math.min(1.0, easeLP * 4.0); // opacity stays high, shrinks at the very end
      }

      // Subtract currentScrollY to anchor the text logo layout relative to scroll
      return { rx, ry: ry - currentScrollY, opacity, scale };
    };

    // Calculate dynamic coords for all particles based on phase & orbit physics
    const getParticleCoords = (el, dt, currentScrollY) => {
      const activeCoords = [];

      for (const pt of particles) {
        // Orbit speed scales based on hold state vs transitions
        const speedMult = wordPhase === "hold" ? 2.5 : 1.0;
        pt.orbitAngle += pt.orbitSpeed * dt * speedMult;

        const coords = getOffsets(pt, el, dt, currentScrollY);
        activeCoords.push({ rx: coords.rx, ry: coords.ry, opacity: coords.opacity, scale: coords.scale, color: pt.color, pt });
      }

      return activeCoords;
    };

    // Render the word "Ahtomic" as a vibrating constellation of electrons and chemical arcs
    const drawWord = (p, dt, el, currentScrollY) => {
      if (p <= 0.01 || !particles.length) return;

      const coords = getParticleCoords(el, dt, currentScrollY);

      // 1. Draw sharp, zigzag lightning discharges between nearby coordinates
      for (let i = 0; i < coords.length; i++) {
        const p1 = coords[i];
        const maxChecks = Math.min(coords.length, i + 12);
        for (let j = i + 1; j < maxChecks; j++) {
          const p2 = coords[j];
          const dx = p1.rx - p2.rx;
          const dy = p1.ry - p2.ry;
          const distSq = dx * dx + dy * dy;
          if (distSq < 576) { // distance < 24px
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 24) * 0.55 * p1.opacity * p2.opacity * p;
            
            // Render sharp flickering zigzag discharge path
            if (Math.random() < 0.75) {
              ctx.strokeStyle = "rgba(255,140,120," + alpha.toFixed(3) + ")";
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(p1.rx, p1.ry);
              
              // 3-segment zigzag pathing
              const segments = 3;
              for (let s = 1; s < segments; s++) {
                const frac = s / segments;
                const px = p1.rx + (p2.rx - p1.rx) * frac;
                const py = p1.ry + (p2.ry - p1.ry) * frac;
                
                // Perpendicular vector for offset
                const nx = -dy / (dist || 1);
                const ny = dx / (dist || 1);
                const jitter = (Math.random() - 0.5) * 4.2;
                
                ctx.lineTo(px + nx * jitter, py + ny * jitter);
              }
              ctx.lineTo(p2.rx, p2.ry);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw glowing charge nodes (matching the grid pulse sizes)
      for (const p1 of coords) {
        const alpha = p * p1.opacity;
        const scale = p1.scale ?? 1.0;
        if (alpha <= 0.01 || scale <= 0.01) continue;

        const fl = 0.72 + Math.random() * 0.28; // flicker
        const isHotNode = p1.pt.orbitRad > 1.8;

        ctx.save();
        if (isHotNode && alpha > 0.15) {
          ctx.shadowColor = "rgba(255,59,47,0.9)";
          ctx.shadowBlur = 8 * fl * scale;
        }

        ctx.fillStyle = p1.color + (0.95 * alpha * fl).toFixed(3) + ")";
        ctx.beginPath();
        const baseRadius = isHotNode ? 1.2 : 0.7; // extremely small particles
        ctx.arc(p1.rx, p1.ry, baseRadius * fl * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Spawn a path-following electrical current running through adjacent particles
    const spawnTextPulse = () => {
      if (!particles.length || textPulses.length >= 6) return;

      let curr = particles[Math.floor(Math.random() * particles.length)];
      const path = [curr];
      const pathLen = 8 + Math.floor(Math.random() * 5);
      const visited = new Set([curr]);

      for (let i = 0; i < pathLen; i++) {
        let best = null;
        let minDistSq = Infinity;
        // Fast local search: check adjacent indexes in the particle array
        const startIdx = Math.max(0, particles.indexOf(curr) - 20);
        const endIdx = Math.min(particles.length, startIdx + 40);

        for (let j = startIdx; j < endIdx; j++) {
          const pt = particles[j];
          if (visited.has(pt)) continue;
          const dx = curr.tx - pt.tx;
          const dy = curr.ty - pt.ty;
          const distSq = dx * dx + dy * dy;
          if (distSq < minDistSq && distSq < 900) { // snap window: 30px
            minDistSq = distSq;
            best = pt;
          }
        }

        if (best) {
          path.push(best);
          visited.add(best);
          curr = best;
        } else {
          break;
        }
      }

      if (path.length >= 4) {
        textPulses.push({
          path,
          progress: 0,
          speed: 12 + Math.random() * 8, // node hops per second
          glow: Math.random() < 0.4,
          tail: 3 + Math.floor(Math.random() * 3)
        });
      }
    };

    // Draw active electric currents traveling along constellation pathways
    const drawTextPulses = (dt, p, el, currentScrollY, isNearLogo) => {
      if (p <= 0.05 || !textPulses.length) return;

      for (const tp of textPulses) {
        // Speed up the pulse flow when the user is hovering over/near the logo
        const currentSpeed = tp.speed * (isNearLogo ? 2.5 : 1.0);
        tp.progress += currentSpeed * dt;
        if (tp.progress >= tp.path.length) continue;

        const pIndex = Math.floor(tp.progress);
        const pFrac = tp.progress - pIndex;

        const headNode = tp.path[pIndex];
        const nextNode = tp.path[Math.min(tp.path.length - 1, pIndex + 1)];

        const headOffsets = getOffsets(headNode, el, dt, currentScrollY);
        const nextOffsets = getOffsets(nextNode, el, dt, currentScrollY);

        const hx = headOffsets.rx + (nextOffsets.rx - headOffsets.rx) * pFrac;
        const hy = headOffsets.ry + (nextOffsets.ry - headOffsets.ry) * pFrac;

        // Draw tail backwards along the traversed constellation path
        const tailLength = tp.tail;
        ctx.lineWidth = tp.glow ? (isNearLogo ? 3.0 : 2.2) : (isNearLogo ? 2.0 : 1.4);

        for (let i = 0; i < tailLength; i++) {
          const idx = pIndex - i;
          if (idx < 0) break;

          const node0 = tp.path[idx];
          const node1 = tp.path[Math.max(0, idx - 1)];

          const o0 = getOffsets(node0, el, dt, currentScrollY);
          const o1 = getOffsets(node1, el, dt, currentScrollY);

          const alpha = (1 - i / tailLength) * p * o0.opacity;
          ctx.strokeStyle = tp.glow
            ? "rgba(255,200,160," + (alpha * 0.85).toFixed(3) + ")"
            : "rgba(255,100,84," + (alpha * 0.75).toFixed(3) + ")";

          ctx.beginPath();
          ctx.moveTo(o0.rx, o0.ry);
          ctx.lineTo(o1.rx, o1.ry);
          ctx.stroke();
        }

        // Draw flickering head charge
        const fl = 0.75 + Math.random() * 0.25;
        ctx.save();
        if (tp.glow) {
          ctx.shadowColor = "rgba(255,59,47,0.9)";
          ctx.shadowBlur = (isNearLogo ? 18 : 12) * fl;
        }
        ctx.fillStyle = tp.glow
          ? "rgba(255,230,190," + (0.95 * fl * p).toFixed(3) + ")"
          : "rgba(255,130,112," + (0.95 * fl * p).toFixed(3) + ")";
        ctx.beginPath();
        // Slightly larger head during logo hover intensity
        const baseRadius = tp.glow ? 3.0 : 1.8;
        const radius = isNearLogo ? baseRadius * 1.5 : baseRadius;
        ctx.arc(hx, hy, radius * fl, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Emit sharp electrical sparks from the head coordinate (with logo flag)
        const sparkChance = isNearLogo ? dt * 85 : dt * 30;
        if (Math.random() < sparkChance) {
          const angle = Math.random() * Math.PI * 2;
          sparks.push({
            x: hx,
            y: hy + currentScrollY, // store absolute coordinate space Y
            logo: true,
            nx: Math.cos(angle),
            ny: Math.sin(angle),
            len: 3 + Math.random() * 5, // very short length (3px to 8px)
            life: 0.05 + Math.random() * 0.06, // extremely short lifetime
            age: 0
          });
        }
      }

      textPulses = textPulses.filter(tp => tp.progress < tp.path.length);
    };

    const draw = (p, dt, el, currentScrollY, isNearLogo) => {
      // 1. Clear and draw grid lines. Half-pixel offset keeps 1px lines crisp
      // instead of anti-aliased/blurry (a canvas rendering fundamental).
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = BASE;
      ctx.beginPath();
      for (let x = 0.5; x < W; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0.5; y < H; y += CELL) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      // 2. Draw sparks (flickering electric crackles)
      drawSparks(currentScrollY);

      // 3. Draw background grid pulses
      drawGridPulses(dt);

      // 4. Draw text pulses (electrical currents traveling on the letters)
      if (p > 0.05) {
        drawTextPulses(dt, p, el, currentScrollY, isNearLogo);
      }

      // 5. Draw word (lightning connections + particle nodes on top)
      if (p > 0) {
        drawWord(p, dt, el, currentScrollY);
      }
    };

    // --- Electrical pulses: a bright head with a fading tail that runs along
    // grid lines, occasionally turning 90° at intersections. Random timing,
    // random routes; capped so red stays a signal, not a wash.
    const snap = (v) => 0.5 + Math.round((v - 0.5) / CELL) * CELL;
    const makePulse = () => {
      // Every pulse enters from off-screen and its final leg always runs
      // off-screen — nothing dies mid-line.
      const pts = [];
      let axis, dir, x, y;
      if (Math.random() < 0.55) {
        axis = "x"; dir = Math.random() < 0.5 ? 1 : -1;
        x = dir === 1 ? -CELL : W + CELL;
        y = snap(CELL + Math.random() * H * 0.6);
      } else {
        axis = "y"; dir = 1;
        y = -CELL;
        x = snap(CELL + Math.random() * (W - 2 * CELL));
      }
      pts.push({ x, y });
      const turns = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 3) : 0;
      for (let i = 0; i < turns; i++) {
        const len = snap(CELL * (2 + Math.random() * 5));
        if (axis === "x") x = snap(Math.max(CELL, Math.min(W - CELL, x + dir * len)));
        else y = snap(Math.max(CELL, Math.min(H * 0.8, y + dir * len)));
        pts.push({ x, y });
        axis = axis === "x" ? "y" : "x";
        // prefer turning toward open space so routes stay visible
        if (axis === "x") dir = x < W / 2 ? 1 : -1;
        else dir = y < H / 2 ? 1 : -1;
        if (Math.random() < 0.3) dir = -dir;
      }
      // final leg: exit the viewport with margin so the tail fully leaves too
      if (axis === "x") x = dir === 1 ? W + CELL * 3 : -CELL * 3;
      else y = dir === 1 ? H + CELL * 3 : -CELL * 3;
      pts.push({ x, y });
      let total = 0;
      for (let i = 1; i < pts.length; i++) total += Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y);
      return {
        pts, total,
        dist: 0,
        speed: 300 + Math.random() * 380,
        tail: 80 + Math.random() * 90,
        glow: Math.random() < 0.4, // some pulses run hotter
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

    const drawGridPulses = (dt) => {
      for (const pu of pulses) {
        const head = Math.min(pu.dist, pu.total);
        const maxA = pu.glow ? 0.65 : 0.45;
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
          // spark emission: brief jagged offshoots perpendicular to travel (sharp electric)
          if (Math.random() < dt * 25 && hp.x > 0 && hp.x < W && hp.y > 0 && hp.y < H) {
            const prev = pointAt(pu, Math.max(0, head - 3));
            const dx = hp.x - prev.x, dy = hp.y - prev.y;
            const mag = Math.hypot(dx, dy) || 1;
            const nx = -dy / mag, ny = dx / mag;
            const side = Math.random() < 0.5 ? 1 : -1;
            sparks.push({
              x: hp.x, y: hp.y,
              logo: false, // background grid spark
              nx: nx * side, ny: ny * side,
              len: 3 + Math.random() * 5, // very short
              life: 0.05 + Math.random() * 0.06, // extremely short
              age: 0,
            });
          }
          // flickering head — brightness and size jitter every frame
          const fl = 0.72 + Math.random() * 0.28;
          ctx.save();
          if (pu.glow) { ctx.shadowColor = "rgba(255,59,47,0.9)"; ctx.shadowBlur = 12 * fl; }
          ctx.fillStyle = "rgba(255,130,112," + (0.95 * fl).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(hp.x, hp.y, (pu.glow ? 2 : 1.4) * fl, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }
    };

    const drawSparks = (currentScrollY) => {
      // Draw sharp, jagged, high-frequency static electric discharges
      for (const sp of sparks) {
        const k = 1 - sp.age / sp.life;
        const jx = (Math.random() - 0.5) * 2;
        const jy = (Math.random() - 0.5) * 2;

        const drawY = sp.logo ? sp.y - currentScrollY : sp.y;

        // Mid point for jagged crackle
        const mx = sp.x + sp.nx * sp.len * 0.5 + jx;
        const my = drawY + sp.ny * sp.len * 0.5 + jy;

        ctx.strokeStyle = "rgba(255,150,130," + (0.85 * k).toFixed(3) + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sp.x, drawY);
        ctx.lineTo(mx, my);
        ctx.lineTo(sp.x + sp.nx * sp.len, drawY + sp.ny * sp.len);
        ctx.stroke();
      }
    };

    // --- One shared frame loop; runs only while something is animating.
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const wordP = (now) => {
      if (wordT0 < 0) {
        if (lastWordPhase !== "idle") {
          lastWordPhase = "idle";
          wordPhase = "idle";
        }
        return 0;
      }
      const el = now - wordT0;
      let p = 0;
      let phase = "idle";

      // Slower, more majestic left-to-right sweep reveal timing (4.8 seconds reveal)
      if (el < 4800) {
        phase = "in";
        p = ease(el / 4800);
      } else if (el < 11800) {
        phase = "hold";
        p = 1;
      } else if (el < 14200) {
        phase = "out";
        p = 1 - ease((el - 11800) / 2400);
      } else {
        wordT0 = -1;
        phase = "idle";
        p = 0;
        wordTimer = setTimeout(startWord, 14000 + Math.random() * 6000);
      }

      if (phase !== lastWordPhase) {
        wordPhase = phase;
        lastWordPhase = phase;
      }

      return p;
    };

    const loop = (t) => {
      const dt = Math.max(0, Math.min((t - lastT) / 1000, 0.05));
      lastT = t;
      const currentScrollY = window.scrollY;
      const el = wordT0 >= 0 ? t - wordT0 : 0;
      const p = wordP(t);

      // Check if mouse hover is near the logo area
      const isNearLogo = Math.abs(mouseX - (fx + fw / 2)) < (fw / 2 + 60) && 
                         Math.abs(mouseY - (fy - currentScrollY + fh / 2)) < (fh / 2 + 40);

      // Update background grid pulses distance
      for (const pu of pulses) pu.dist += pu.speed * dt;
      pulses = pulses.filter((pu) => pu.dist - pu.tail < pu.total);

      // Update sparks age
      for (const sp of sparks) {
        sp.age += dt;
      }
      sparks = sparks.filter((sp) => sp.age < sp.life);

      // Render all layers back-to-front in a single clear draw call
      draw(p, dt, el, currentScrollY, isNearLogo);

      // Electricity pulses travel along atomic pathways only during hold/reveal phases
      if (p > 0.05) {
        const spawnChance = isNearLogo ? dt * 25.0 : dt * 6.5;
        const maxPulses = isNearLogo ? 15 : 6;
        if (wordPhase === "hold" && Math.random() < spawnChance && textPulses.length < maxPulses) {
          spawnTextPulse();
        }
      } else {
        textPulses = [];
      }

      if (wordT0 >= 0 || pulses.length || sparks.length || textPulses.length) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        draw(0, dt, 0, currentScrollY, false);
      }
    };

    const ensureLoop = () => {
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); }
    };

    const startWord = () => {
      wordT0 = performance.now();
      textPulses = [];
      ensureLoop();
    };
    const spawnPulse = () => {
      if (pulses.length < 5) {
        pulses.push(makePulse());
        if (Math.random() < 0.35 && pulses.length < 5) pulses.push(makePulse()); // double-strike
        if (Math.random() < 0.12 && pulses.length < 5) pulses.push(makePulse()); // rare burst
      }
      ensureLoop();
      pulseTimer = setTimeout(spawnPulse, 900 + Math.random() * 2400);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildField();
      buildBand();
      draw(0, 0, 0, window.scrollY);
    };

    const onPointerMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ensureLoop();
    };

    const onPointerLeave = () => {
      mouseX = -10000;
      mouseY = -10000;
      ensureLoop();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

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
          draw(0, 0, 0, window.scrollY);
          kickoff();
        });
      } else {
        kickoff();
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
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
    <MotionProvider>
      <div data-screen-label={page || "404"} style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <a href="#main-content" className="skip-link" onClick={(e) => { e.preventDefault(); const mainEl = document.getElementById("main-content"); if (mainEl) mainEl.focus(); }}>Skip to content</a>

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

        {a.grain && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 99, pointerEvents: "none", opacity: 0.15,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.86 0 0 0 0 0.89 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
          }}></div>
        )}

        <Nav page={page} go={go} />

        <AnimatePresence mode="wait">
          <m.main
            id="main-content"
            tabIndex={-1}
            key={page || "404"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={pageTransition}
            style={{ flex: 1, position: "relative", zIndex: 1, outline: "none" }}
          >
            {page ? pages[page] : <NotFound go={go} />}
          </m.main>
        </AnimatePresence>

        <Footer go={go} settings={siteData.settings} />
        <BackToTop />
      </div>
    </MotionProvider>
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
