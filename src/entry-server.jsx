// SSR entry — used only by the build-time prerender step (scripts/prerender.mjs
// via `vite build --ssr`), never shipped to the browser. Fetches the same
// published content the client fetches, renders one public route to a static
// HTML string plus its title/description/canonical, which the prerender
// script bakes into dist/<route>/index.html.
import { renderToStaticMarkup } from "react-dom/server";
import { doc, getDoc } from "firebase/firestore";
import { WebsiteView, getPageMeta, DEFAULT_CONTENT } from "./website/Website";
import { db } from "./firebase";

export async function fetchSiteData() {
  try {
    if (db) {
      const snap = await getDoc(doc(db, "site-content", "public"));
      if (snap.exists()) return snap.data();
    }
  } catch (err) {
    console.warn("[prerender] Firestore fetch failed, using DEFAULT_CONTENT:", err.message);
  }
  return DEFAULT_CONTENT;
}

export function renderPage(pageName, siteData) {
  const html = renderToStaticMarkup(
    <WebsiteView initialPage={pageName} initialSiteData={siteData} />
  );
  const meta = getPageMeta(pageName, siteData);
  return { html, meta };
}
