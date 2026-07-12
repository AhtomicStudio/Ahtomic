import React from "react";
import { AdminSidebar, AdminTopbar, Icon } from "./AdminShared";
import { PagesEditor } from "./AdminPages";
import { ProjectsEditor } from "./AdminProjects";
import { AppearanceEditor, SettingsEditor } from "./AdminAppearance";
import { Dialog } from "../components/feedback/Dialog";
import { Button } from "../components/forms/Button";
import { Toast } from "../components/feedback/Toast";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const DEFAULT_CONTENT = {
  pages: {
    Home: { label: "Web studio · California", headline: "Web design, down to the", headlineAccent: "atom", intro: "Small studio, serious software. One person directs every project; AI agents handle the build. Fast, focused, no agency overhead.", cta: "Start a project" },
    Work: { label: "Selected work", headline: "Work", headlineAccent: "", intro: "Four products so far. Two live, two in the works.", cta: "Start a project" },
    Services: { label: "Services", headline: "Design, build, ship", headlineAccent: "Usually all three.", intro: "Not sure which of these you need? That's normal. Tell us what you're building and we'll figure it out together.", cta: "Start a project" },
    About: { label: "About", headline: "A small studio, on", headlineAccent: "purpose", intro: "Hi, I'm Adam. I started Ahtomic to help businesses running on aging websites, and to get real hands-on experience directing AI agents instead of reading about them from the sidelines.", cta: "Start a project" },
    Contact: { label: "Contact", headline: "Start a", headlineAccent: "project", intro: "Tell us what you're building. A few sentences is plenty — we'll reply within two days with honest thoughts on scope, budget, and whether we're the right fit.", cta: "Send it" },
  },
  projects: [
    { title: "CannaPickForMe", meta: "Web app · Live", tags: ["Web"], live: true, visible: true, url: "https://cannapickforme.com", blurb: "A strain matcher for adults 21+. Four questions, one personalized pick from 200+ strains.", challenge: "Dispensary menus list hundreds of strains with no way to tell what actually fits you — most people just guess, or ask a rushed budtender.", approach: "Four short questions narrow 200+ strains down to one confident pick, with age-gating and sponsored-listing labels built in from the start.", outcome: "Live today. What used to be a confused scroll through a menu is now a one-minute conversation." },
    { title: "Chalktalk", meta: "Web app · Live", tags: ["Web"], live: true, visible: true, url: "https://chalktalk.ahtomic.com", blurb: "One shared chalkboard, split down the middle. Built for leaving little notes between two people over a private link.", challenge: "Shared-note apps are built for teams and groups — there wasn't a small, private version for just two people.", approach: "One page, one link, no accounts. A single chalkboard split down the middle that both people can write and doodle on.", outcome: "Live today, one private board shared between two people — the whole point from the start." },
    { title: "Snapacat", meta: "Mobile app · In progress", tags: ["Mobile"], live: false, visible: true, blurb: "Log photos and notes of neighborhood cats; the app turns each cat into a sprite you can collect.", challenge: "People already photograph neighborhood cats on their phones, but there's no good way to track sightings over time or share them.", approach: "Every logged cat becomes a collectible sprite, turning a habit people already have into something worth keeping up.", outcome: "Core capture-and-collect loop is built. Store submission is next." },
    { title: "BudSnap", meta: "Mobile app · In progress", tags: ["Mobile"], live: false, visible: true, blurb: "A living Pokédex for cannabis. A fun way of logging for a forgetful demographic.", challenge: "People trying different cannabis products rarely remember what worked and what didn't — most tracking tools feel clinical, not habit-forming.", approach: "A playful, Pokédex-style log: snap it, rate it, build a personal collection instead of a spreadsheet.", outcome: "Logging and collection views are built. Cross-device sync is next." },
  ],
  appearance: { accent: "#ff3b2f", glow: true, grid: true, grain: true, sheen: true, motion: "Full" },
  settings: { email: "ahtomicstudio@gmail.com", location: "California · Remote-friendly", replyTime: "Replies within 2 days", footerTagline: "Websites and mobile apps, designed and built.", copyright: "© 2026 Ahtomic Studio", siteTitle: "Ahtomic Studio — Websites and apps, built properly", siteDescription: "A small web studio shipping websites and mobile apps. One person directs every project; AI agents handle the build." },
};

const DRAFT_KEY = "ahtomic-dashboard-draft-v1";

export function AdminDashboard({ onLogout }) {
  const [section, setSection] = React.useState("pages");
  const [draft, setDraft] = React.useState(null);
  const [savedSnapshot, setSavedSnapshot] = React.useState(null);
  const [toasts, setToasts] = React.useState([]);
  const [publishOpen, setPublishOpen] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [publishing, setPublishing] = React.useState(false);

  // Load content on mount
  React.useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        if (db) {
          const draftDocRef = doc(db, "site-content", "draft");
          const draftSnap = await getDoc(draftDocRef);
          if (draftSnap.exists()) {
            const data = draftSnap.data();
            setDraft(data);
            setSavedSnapshot(JSON.stringify(data));
          } else {
            // Write defaults to Firestore if document does not exist yet
            await setDoc(draftDocRef, DEFAULT_CONTENT);
            setDraft(DEFAULT_CONTENT);
            setSavedSnapshot(JSON.stringify(DEFAULT_CONTENT));
          }
        } else {
          // LocalStorage fallback
          const raw = localStorage.getItem(DRAFT_KEY);
          let localData;
          if (raw) {
            localData = JSON.parse(raw);
          } else {
            localData = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
            localStorage.setItem(DRAFT_KEY, JSON.stringify(localData));
          }
          setDraft(localData);
          setSavedSnapshot(JSON.stringify(localData));
        }
      } catch (err) {
        console.error("Error loading dashboard content:", err);
        toast("Error loading content. Falling back to local storage.", "danger");
        // Fallback to local storage on firebase read failure
        const raw = localStorage.getItem(DRAFT_KEY);
        const fallback = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_CONTENT));
        setDraft(fallback);
        setSavedSnapshot(JSON.stringify(fallback));
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const toast = (msg, tone = "positive") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const update = (fn) => setDraft((prev) => {
    const next = JSON.parse(JSON.stringify(prev));
    fn(next);
    return next;
  });

  const save = async () => {
    try {
      if (db) {
        const draftDocRef = doc(db, "site-content", "draft");
        await setDoc(draftDocRef, draft);
      } else {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }
      setSavedSnapshot(JSON.stringify(draft));
      setSavedAt(Date.now());
      toast("Draft saved. Nothing is public until you publish.");
    } catch (e) {
      console.error(e);
      toast("Failed to save draft content.", "danger");
    }
  };

  const discard = () => {
    if (savedSnapshot) {
      setDraft(JSON.parse(savedSnapshot));
      toast("Changes discarded — back to your last saved draft.", "neutral");
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      if (db) {
        // Save current draft first
        const draftDocRef = doc(db, "site-content", "draft");
        await setDoc(draftDocRef, draft);
        
        // Copy draft to public document
        const publicDocRef = doc(db, "site-content", "public");
        await setDoc(publicDocRef, draft);
      } else {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        localStorage.setItem("ahtomic-dashboard-public-v1", JSON.stringify(draft));
      }
      setSavedSnapshot(JSON.stringify(draft));
      setSavedAt(Date.now());
      setPublishOpen(false);
      toast("Published. The live site now shows these changes.");
    } catch (e) {
      console.error(e);
      toast("Failed to publish content to production.", "danger");
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      onLogout();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const dirty = draft && savedSnapshot && JSON.stringify(draft) !== savedSnapshot;

  // Warn before leaving with unsaved changes
  React.useEffect(() => {
    const onUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-page)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
        Loading Site Data...
      </div>
    );
  }

  const titles = { pages: "Pages", projects: "Projects", appearance: "Appearance", settings: "Settings" };
  const editors = {
    pages: <PagesEditor draft={draft} update={update} />,
    projects: <ProjectsEditor draft={draft} update={update} />,
    appearance: <AppearanceEditor draft={draft} update={update} />,
    settings: <SettingsEditor draft={draft} update={update} />,
  };

  return (
    <div data-screen-label={"Dashboard — " + titles[section]} style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar section={section} setSection={setSection} onLogout={handleLogout} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AdminTopbar title={titles[section]} dirty={dirty} savedAt={savedAt} onSave={save} onDiscard={discard} onPublish={() => setPublishOpen(true)} publishing={publishing} />
        <main style={{ flex: 1, padding: 24, maxWidth: 1100, width: "100%" }}>
          {editors[section]}
        </main>
      </div>
      <Dialog open={publishOpen} title="Publish to the live site?" onClose={() => setPublishOpen(false)}
        description={dirty ? "This saves your current edits and makes them visible to everyone." : "Your saved draft will be made visible to everyone."}
        actions={[
          <Button key="c" variant="ghost" onClick={() => setPublishOpen(false)}>Cancel</Button>,
          <Button key="p" variant="primary" onClick={publish} disabled={publishing}>Publish now</Button>,
        ]} />
      <div className="toast-stack">
        {toasts.map((t) => <Toast key={t.id} tone={t.tone} onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.msg}</Toast>)}
      </div>
    </div>
  );
}
