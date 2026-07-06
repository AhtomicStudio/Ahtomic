# Handoff: Ahtomic Studio — Marketing Site + Admin Dashboard

## Overview
Complete design package for **ahtomic.studio**: a 5-page marketing/portfolio site (Home, Work, Services, About, Contact) and an admin dashboard for editing site content. Dark, sophisticated, minimal. Brand voice: confident and terse — "Everything, down to the atom."

**Planned stack (per the owner): Next.js on Vercel + Firebase** (Auth to gate the dashboard, Firestore for content, Storage for images). The dashboard's draft/publish model maps to two Firestore documents (`draft`, `published`); the public site should read `published` at build time / ISR revalidate-on-publish — do not hit Firestore per visit.

## About the Design Files
Files in this bundle are **design references created in HTML** — working prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase** (recommended: Next.js + React) using its established patterns. The JSX in these files is browser-Babel prototype code; treat it as a spec, not a source to import.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly. Exact values are in `tokens/*.css` — copy those custom properties verbatim as the app's global CSS.

## Files
- `site/index.html` — app shell: hash routing, ambient backgrounds, grid canvas, cursor glow, skip link, back-to-top (routing should become real routes in Next.js: `/`, `/work`, `/services`, `/about`, `/contact`)
- `site/home.jsx`, `work.jsx`, `services.jsx`, `about.jsx`, `contact.jsx` — one file per page
- `site/shared.jsx` — Nav, Footer, Page container, BackToTop
- `admin/index.html` + `admin/admin-shared.jsx`, `admin-pages.jsx`, `admin-projects.jsx`, `admin-appearance.jsx` — dashboard
- `components/` — reusable primitives (button, input, select, checkbox, radio, switch, card, badge, tag, tabs, dialog, toast, tooltip, section-label, project-card, wordmark) with `.d.ts.txt` props contracts and `.prompt.md` usage notes (files are kebab-case here; use PascalCase component names in the real codebase)
- `tokens/` + `styles.css` — the design tokens; single source of truth
- `assets/` — Thom mascot sprites, portfolio screenshots (CannaPickForMe, Chalkboard)
- `readme.md` — full brand guide (content voice, visual foundations, iconography)
- `SKILL.md` — agent-consumable design-system entry point

Open `site/index.html` in a browser to see everything working.

## Design Tokens (canonical values)
**Colors**
- Surfaces: page `#0a0a0b`, card `#141416`, raised `#1a1a1d`
- Text: primary `#fafaf8`, secondary `#bcc1c9` (silver-300), muted `#7c828d` (silver-500)
- Accent red: `#ff3b2f` (hover `#ff6a55`, press `#e02318`); tint `rgba(255,59,47,0.13)`
- Silver ramp: `#eef0f3 / #d9dce2 / #bcc1c9 / #9aa0ab / #7c828d`; sheen gradient `linear-gradient(180deg,#eef0f3 0%,#b8bdc6 55%,#dfe2e7 100%)` (used as background-clip:text on hero italic words)
- Lines: `rgba(217,220,226,0.1)` and `0.2`; accent line `rgba(255,59,47,0.5)`
- Focus ring: `rgba(255,59,47,0.55)`

**Typography**
- Sans (everything): **Space Grotesk** (Google Fonts, 400–700)
- Display accent (italic words in headlines on non-Home pages): **Instrument Serif** italic
- Mono (labels, kickers, footer meta): **IBM Plex Mono** 400–600
- Hero H1: 68px/700, letter-spacing -0.03em, line-height ~1.05. Page H1s ~54–60px. Mono kickers: 12px, uppercase, letter-spacing 0.14em.
- Red period at the end of every headline.

Full spacing/radius/shadow scales are in `tokens/spacing.css` and `tokens/effects.css` — copy them verbatim.

## Screens
See the prototypes for exact layout; key structural notes:
- **Shell**: sticky translucent nav (blur backdrop) with wordmark → home, 4 links + Contact button; footer with nav links, tagline, mascot, `© 2026 Ahtomic Studio`, `ahtomicstudio@gmail.com`
- **Home**: mono kicker "Web studio · California" → H1 "Everything, down to the atom." (*atom* in red) → intro → primary CTA "Start a project" + ghost "See the work" → Selected work grid (2 ProjectCards) → What we do (3 cards)
- **Work**: "One live, three in the works." Four projects: CannaPickForMe (live), A Chalkboard for Two, Snapacat, BudSnap
- **Services**: numbered rows (01 Websites / 02 Mobile apps / 03 Design & brand) with tag lists
- **About**: stats (4 shipped / 1 live / 1 point of contact), studio story — one person directs, AI agents build
- **Contact**: form (name, email, project type select, message) + mailto link, "Replies within 2 days"
- **Admin**: sidebar (Pages / Projects / Appearance / Settings) + topbar (Save draft / Discard / Publish with confirm dialog, dirty badge). Pages editor has live hero preview; Projects has reorder/show-hide/live toggles; Appearance has accent swatches + effect toggles; Settings has contact/footer/meta fields.

## Interactions & Behavior
- **Backgrounds** (all behind content, `z-index:0`, pointer-events none):
  1. Grid canvas: 72px hairline grid `rgba(217,220,226,0.033)`, masked to fade below. **Signature effect**: every ~14s the horizontal lines in the hero's upper-right deform for 7s (2s ease-in-out cubic in / 3s hold / 2s out) to trace the word "Ahtomic" (Space Grotesk 700 sampled from an offscreen canvas as a displacement field); quarter-cell sub-lines fade in within the word band; red trace `rgba(255,80,68,0.42)` inside letterforms. rAF only runs during the reveal.
  2. Per-page ambient radial glows (red + silver), cross-fading 900ms on navigation, slight scroll parallax (translateY × -0.04).
  3. Static SVG-noise film grain, opacity 0.35.
  4. Cursor glow: 600px radial (red core, silver mid), eased follow (lerp 0.12), transform-only, rAF stops when settled; hidden on touch + reduced-motion.
- **Scroll reveals**: IntersectionObserver, threshold 0.12, translateY(18px)→0 + fade, 600ms ease-out, staggered ~90ms via `--d` custom property.
- **Page transitions**: 420ms fade+rise on main content; scroll to top; document.title updates per page.
- **Hovers**: nav underline scaleX from left 240ms; project-card screenshots pan to bottom + scale 1.015; service rows shift right 6px, index reddens; cards lift 3px; buttons brighten (`#ff6a55`) / press darken (`#e02318`).
- **A11y (keep all)**: skip link, focus-visible rings, aria-current nav, labeled landmarks, 44px hit targets, `prefers-reduced-motion` disables grain/cursor glow/reveals/grid animation.
- **Forms**: labels above inputs, inline validation, focus ring + red glow on contact card focus-within.

## State Management
- Site: current route; nav state. Content should come from Firestore `published` doc (shape = `DEFAULT_CONTENT` in `admin/index.html`: `pages`, `projects`, `appearance`, `settings`).
- Admin: draft doc + dirty flag (draft ≠ saved snapshot), beforeunload warning, Save draft → write draft doc; Publish → copy draft to published + trigger revalidate. Toasts for save/discard/publish.

## Assets
- `assets/mascot/` — Thom mascot (owner-provided art). Footer + fun accents only.
- `assets/portfolio/` — CannaPickForMe + Chalkboard screenshots (owner-provided).
- No logo file exists yet — the wordmark is plain type (Space Grotesk 700, tight tracking). Do not invent a logo.
- Icons: Lucide (line icons, 1.5px stroke) — use the `lucide-react` package in production.
