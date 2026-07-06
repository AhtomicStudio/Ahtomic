# Ahtomic Studio Design System

Ahtomic Studio is a modern web studio in California building websites and mobile apps. This design system covers the studio's own brand — the landing/project-acquisition site and portfolio — not the visual identities of its client-style projects (each project keeps its own look).

**Brand position:** sophisticated, professional, clean, to the point. Dark background, white type, red used as a precise signal. Competent and modern — explicitly *not* edgy/gamer.

## Products represented

- **Ahtomic Studio site** — landing + portfolio + project acquisition (the surface this system designs for). Sections: Home, Work, Services, About, Contact.
- **Portfolio projects** (shown as work, each with its own aesthetic):
  - **CannaPickForMe** (live: https://cannapickforme.com) — web app that matches cannabis strains to mood via a 4-question quiz; dispensaries pay monthly to be surfaced to users. Dark green cosmic UI, playful emoji-forward tone.
  - **A Chalkboard for Two** — a shared chalkboard web app for leaving notes between two people via a private link. Cozy cream/chalk aesthetic.
  - **Snapacat** — mobile app: Snapchat × Pokémon GO × Neko Atsume; log neighborhood cats, the app makes sprites of them to collect in customized environments. (No assets yet.)
  - **BudSnap** — a "living Pokédex" for cannabis; fun logging for a forgetful demographic. (No assets yet.)

## Sources provided

- `uploads/Branding/CannapickformeScreens/` — 6 product screenshots (copied to `assets/portfolio/cannapickforme/`).
- `uploads/Branding/chalkboardfortwo/` — 2 screenshots (copied to `assets/portfolio/chalkboard/`).
- `uploads/Branding/Mascot Thom Sprites/` — mascot "Thom", a round black creature with red horns and tail (copied to `assets/mascot/`).
- Live site: https://cannapickforme.com (copy/tone reference for that project only).

**No logo/wordmark was provided.** The brand name is set in plain type (see `Wordmark` component): "Ahtomic" in grotesk bold with a red terminal period — a typographic treatment, not a drawn mark. Replace when a real logo exists.

**No font binaries were provided.** Substitutes are loaded from Google Fonts (see `tokens/fonts.css`): Space Grotesk (sans), Instrument Serif (display accent), IBM Plex Mono (labels). Flagged for replacement if the studio licenses specific typefaces.

## CONTENT FUNDAMENTALS

- **Voice:** confident, plain, terse. Short declarative sentences. No hype adjectives, no exclamation marks, no em-dash-riddled AI cadence, no "elevate/unleash/seamless" vocabulary.
- **Person:** "we" for the studio, "you" for the client. Direct address: "Tell us what you're building."
- **Casing:** sentence case everywhere — headlines, buttons, nav. Mono labels are the one exception: UPPERCASE, tracked (e.g. `SELECTED WORK`, `01 / 04`).
- **Emoji:** never in studio-brand copy. (Portfolio screenshots may contain them; that's the project's voice, not ours.)
- **Numbers and structure:** the studio brand enjoys quiet technical notation — index numbers (`01`), slashes (`Work / Contact`), file-like labels. Use sparingly.
- **Example headline:** `Websites and apps, built properly.` **Example CTA:** `Start a project`. **Example service line:** `Design, build, ship. Usually all three.`

## VISUAL FOUNDATIONS

- **Color:** near-black warm neutrals (`#0a0a0b` page, `#141416` card, `#1a1a1d` raised). White `#fafaf8` for primary type; cool silver neutrals (`#bcc1c9` secondary, `#7c828d` muted) give the dark surfaces a metallic edge. One vibrant signal red (`#ff3b2f`) as the only accent: CTAs, active states, the wordmark period, thin rules. Red covers < 5% of any screen. Status colors exist but stay quiet.
- **Type:** Space Grotesk for everything; headlines tight (-0.03em) and heavy (600–700). Instrument Serif *italic* is the accent — one word or phrase inside a headline ("built *properly*"), never whole paragraphs. IBM Plex Mono for small uppercase labels (12px, +0.14em). Type scale in `tokens/typography.css`.
- **Backgrounds:** flat dark surfaces. No gradients as decoration; one permitted move is a very faint red radial glow behind hero content (see effects). No textures, no patterns, no photography backdrops.
- **Imagery:** product screenshots are the imagery. Shown in simple 1px-bordered rounded frames on card surfaces, true to each project's own palette. Mascot Thom appears as a small easter-egg accent (footer, 404), never as a layout element on the sophisticated surfaces.
- **Borders and elevation:** hierarchy from surface steps + 1px lines (`--line-1/2`), not shadows. Shadows only for overlays (`--shadow-overlay`). Cards: `--surface-card`, 1px `--line-1`, radius `--radius-lg` (14px), no drop shadow at rest.
- **Corner radii:** restrained — 10–14px for cards/controls, 6px inputs, pills only for tags/badges. Nothing balloon-like.
- **Hover:** borders brighten (`--line-1` → `--line-2`), text steps up one opacity level, accent buttons lighten to `--red-400`. No scale-ups on hover.
- **Press:** accent darkens to `--red-600`; controls translate down 1px. No shrink transforms.
- **Focus:** 2px offset red ring (`--ring`).
- **Motion:** quick and decisive — 140/240/420ms, ease-out `cubic-bezier(0.22,1,0.36,1)`. Fades and small translates (8–12px). No bounces, no infinite loops.
- **Transparency/blur:** overlay scrim `rgba(10,10,11,0.72)`; `backdrop-filter: blur(12px)` only on the fixed nav bar and dialogs.
- **Layout:** 1200px max container, 32px gutters, generous vertical rhythm (96–128px between marketing sections). Fixed top nav. Mono index numbers anchor section starts.
- **"Bubble text":** the playful itch is served by Thom the mascot and the portfolio pieces themselves — studio typography stays sharp. If a bubble moment is wanted, it's a one-off display treatment, not a system style.

## ICONOGRAPHY

- **Icon set:** [Lucide](https://lucide.dev) line icons via CDN (`lucide@latest` UMD build) — 1.5px stroke, matching the thin-line border language. Use at 16–20px, `currentColor`.
- No proprietary icon font or SVG set exists. Never hand-draw icons. Unicode arrows (`→`, `↗`) are permitted inside links/buttons as typographic devices — the external-link `↗` is a brand tic.
- **Emoji:** never as icons in studio UI.
- **Mascot:** Thom (`assets/mascot/thom.png`, sprite sheets alongside) is the only illustration. Black body, red horns — already on-palette.

## Intentional additions

- `Wordmark` — type-set brand name (no logo file exists).
- `SectionLabel`, `ProjectCard` — marketing-site primitives the portfolio needs.

## Index

- `styles.css` — global entry; imports everything in `tokens/`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/` — `mascot/` (Thom PNG + sprite sheets), `portfolio/cannapickforme/` (6 screens), `portfolio/chalkboard/` (2 screens).
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/forms/` — Button, IconButton, Input, Select, Checkbox, Radio, Switch.
- `components/display/` — Card, Badge, Tag, Tabs, Tooltip.
- `components/feedback/` — Dialog, Toast.
- `components/marketing/` — Wordmark, SectionLabel, ProjectCard.
- `ui_kits/website/` — the studio marketing site (interactive Home / Work / Services / About / Contact).
- `SKILL.md` — agent-skill entry point.
