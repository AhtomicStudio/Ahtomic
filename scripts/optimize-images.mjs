// One-off/maintenance script: converts public portfolio PNGs to sized WebP.
// Run with: node scripts/optimize-images.mjs
// Source-of-truth originals live in Branding/ — public/ only serves optimized files.
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const PORTFOLIO = "public/assets/portfolio";
const MAX_WIDTH = 1200; // cards display ≤ ~575px CSS; 1200 covers 2x retina

const files = [];
for (const dir of await readdir(PORTFOLIO)) {
  for (const f of await readdir(path.join(PORTFOLIO, dir))) {
    if (f.endsWith(".png")) files.push(path.join(PORTFOLIO, dir, f));
  }
}

for (const file of files) {
  const out = file.replace(/\.png$/, ".webp");
  const { size: before } = await stat(file);
  await sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  const { size: after } = await stat(out);
  console.log(`${file}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

// Mascot: crop the wide source canvas to the mascot itself, small UI size
const { size: thomBefore } = await stat("public/assets/mascot/thom.png");
await sharp("public/assets/mascot/thom.png")
  .extract({ left: 1735, top: 317, width: 1500, height: 1500 })
  .resize({ width: 360 })
  .webp({ quality: 85 })
  .toFile("public/assets/mascot/thom.webp");
const { size: thomAfter } = await stat("public/assets/mascot/thom.webp");
console.log(`thom.png ${(thomBefore / 1024).toFixed(0)}KB -> thom.webp ${(thomAfter / 1024).toFixed(0)}KB`);
