# Ahtomic Studio — site + CMS

Business site for Ahtomic Studio (web studio, California). Vite + React 18 + Firebase (Auth/Firestore) on Vercel. **Not Next.js** — plain SPA with manual routing.

Commands: `npm run dev` (port **3000**), `npm run build`, `node scripts/optimize-images.mjs` (image pipeline). Launch/deploy steps: `docs/DEPLOY.md`.

## Architecture (read before changing behavior)

- **Routing is hand-rolled, no router lib.** `src/App.jsx` splits `/admin|/login` (lazy-loaded chunk) from the public site. `src/website/Website.jsx` maps paths → pages (`/`=Home, `/work`, `/services`, `/about`, `/contact`); unknown path renders the 404 component; legacy `/#work` hash URLs redirect. Nav uses `pathFor()` from `src/website/shared.jsx` + `pushState`. New pages must be added to `PAGES`, the `pages` map, `sitemap.xml`, and get real `<a href>` values.
- **Dual data mode.** `src/firebase.js` only initializes when `VITE_FIREBASE_*` env vars exist. Without them (local dev default): content falls back to localStorage and admin login accepts `admin@ahtomic.studio` / `admin` (mock, dead code in production). With them: Firestore + real Firebase Auth. Never remove the fallback — it's how the site is developed and previewed.
- **Content model.** One shape (`DEFAULT_CONTENT`, duplicated in `Website.jsx` and `AdminDashboard.jsx` — keep them in sync) holding `pages`, `projects`, `appearance`, `settings`. Admin edits Firestore doc `site-content/draft`; Publish copies draft → `site-content/public`; the public site reads only `public`. Contact form creates docs in `inquiries`. Access control lives in `firestore.rules` — any signed-in user is the admin.
- **Appearance settings** (admin → Appearance) are applied in `Website.jsx`: `--accent`/`--accent-hover` CSS vars, plus `data-motion` / `data-sheen` attributes on `<html>` that `src/styles.css` reacts to. Motion "Subtle" disables only the canvas grid animation; "Off" disables all motion.
- **Error boundary** (`src/ErrorBoundary.jsx`) wraps the app — a component crash shows a branded fallback instead of a blank page. Don't remove it.

## Styling rules (this repo's way)

- Design tokens in `src/tokens/*.css` are the **single source of truth** — never hardcode colors/fonts/spacing; use `var(--…)`. Component classes live in `src/components/components.css`.
- Pages use inline styles for one-offs BUT all **layout that must respond to viewport width uses the classes in `src/styles.css`** (`grid-2`, `grid-3`, `contact-grid`, `svc-grid`, `stats-grid`, `form-row`, `hero-title`, `page-title`, `page-top`, `btn-row`, nav/footer classes). Inline `display:`/`gridTemplateColumns:` beats media queries — that bug already happened once. Add responsive variants in styles.css, not inline.
- Breakpoints: 960 / 720 / 640 px. Respect `prefers-reduced-motion` and the `data-motion` attribute for any new animation.

## Brand rules (full guide: `readme.md`; design spec: `docs/design-handoff.md`)

- Fonts: **Space Grotesk** (everything), Instrument Serif *italic* (one accent word in headlines), IBM Plex Mono (small uppercase labels). Red `#ff3b2f` is the only accent and covers <5% of any screen; every headline ends in a red period.
- Voice: confident, plain, terse. Sentence case everywhere (mono labels are UPPERCASE). **No emoji, no hype words, no exclamation marks** in studio copy.
- Thom the mascot is a small easter egg (footer, 404, error page) — never a layout element. Icons: lucide-react only; `↗` and `→` as typographic devices are fine.

## Gotchas

- **Every `.jsx` file that references `React.` needs `import React from "react"`.** The components came from a browser-global prototype; a missing import in Tabs.jsx once blanked the whole site.
- Images: `public/` serves optimized WebP only; source PNGs live in `Branding/` (never import from there). To add/replace portfolio images, drop the PNG in `public/assets/portfolio/<project>/`, run `node scripts/optimize-images.mjs`, delete the PNG, reference the `.webp`.
- The domain `ahtomic.studio` is hardcoded in `index.html` (OG/canonical), `public/robots.txt`, `public/sitemap.xml`, and `Website.jsx` (canonical). If the real domain differs, update all four.
- Admin dashboard is desktop-only by design — don't spend effort making it responsive.
- `og.png` and favicons are generated artifacts; the OG card was rendered with brand fonts — regenerate deliberately, don't hand-edit.
- OG/Twitter meta is static (scrapers don't run JS) — one shared card for all pages is intentional.
- Keep the admin bundle lazy (`React.lazy` in App.jsx). Don't import admin modules or `lucide-react` from public-site code — it would pull ~750KB into the public chunk.
