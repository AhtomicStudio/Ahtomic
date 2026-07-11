// Runs after both `vite build` and `vite build --ssr src/entry-server.jsx
// --outDir dist-server`. Renders the 5 public routes to real static HTML
// using the SSR bundle, bakes correct per-page <title>/description/canonical/
// OG tags into each, writes them into dist/, then deletes the intermediate
// SSR bundle (dist-server isn't meant to be deployed — only the HTML it
// produced is).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-server", "entry-server.js");

const ROUTE_PATH = { Home: "", Work: "work", Services: "services", About: "about", Contact: "contact" };

const escapeHtml = (s) =>
  String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function injectMeta(html, meta) {
  let out = html;
  out = out.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`);
  out = out.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${escapeHtml(meta.description)}">`);
  out = out.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${escapeHtml(meta.title)}">`);
  out = out.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${escapeHtml(meta.description)}">`);
  out = out.replace(/<meta name="twitter:title" content=".*?">/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`);
  out = out.replace(/<meta name="twitter:description" content=".*?">/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`);
  if (meta.canonical) {
    out = out.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${meta.canonical}">`);
    out = out.replace(/<meta property="og:url" content=".*?">/, `<meta property="og:url" content="${meta.canonical}">`);
  }
  return out;
}

function injectBody(html, appHtml) {
  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

async function main() {
  if (!existsSync(ssrEntry)) {
    console.error(`[prerender] SSR bundle not found at ${ssrEntry} — did the --ssr build run first?`);
    process.exit(1);
  }

  const template = readFileSync(resolve(distDir, "index.html"), "utf-8");
  const { fetchSiteData, renderPage } = await import(`file://${ssrEntry}`);
  const siteData = await fetchSiteData();

  for (const [page, routePath] of Object.entries(ROUTE_PATH)) {
    try {
      const { html, meta } = renderPage(page, siteData);
      const output = injectMeta(injectBody(template, html), meta);

      if (page === "Home") {
        writeFileSync(resolve(distDir, "index.html"), output);
      } else {
        const dir = resolve(distDir, routePath);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, "index.html"), output);
      }
      console.log(`[prerender] wrote /${routePath}`);
    } catch (err) {
      // Never fail the whole build over one page — that route just serves
      // the ordinary (unprerendered) SPA shell instead, same as today.
      console.error(`[prerender] FAILED to prerender ${page}, leaving it as the plain SPA shell:`, err);
    }
  }

  rmSync(resolve(root, "dist-server"), { recursive: true, force: true });
  console.log("[prerender] done");
}

main();
