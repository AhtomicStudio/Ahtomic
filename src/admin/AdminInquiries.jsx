import React from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { EditorLayout, SectionCard } from "./AdminShared";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function typeList(types) {
  if (!types || typeof types !== "object") return "";
  return Object.entries(types).filter(([, v]) => v).map(([k]) => k).join(", ");
}

// Read-only by design — firestore.rules blocks update/delete from the client
// for the inquiries collection, so there's nothing to wire up here beyond
// viewing and replying by email.
export function InquiriesViewer() {
  const [inquiries, setInquiries] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!db) {
        setInquiries([]);
        return;
      }
      try {
        const q = query(collection(db, "inquiries"), orderBy("timestamp", "desc"), limit(100));
        const snap = await getDocs(q);
        if (cancelled) return;
        setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load inquiries:", err);
        if (!cancelled) setError("Couldn't load inquiries. Try refreshing.");
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (!db) {
    return (
      <EditorLayout>
        <SectionCard title="Inquiries" hint="Requires Firebase to be configured — not available in local/simulated mode.">
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>Nothing to show without a live Firebase connection.</p>
        </SectionCard>
      </EditorLayout>
    );
  }

  return (
    <EditorLayout>
      <SectionCard title="Contact form submissions" hint="Most recent first. Reply directly from your email — nothing here can be edited or deleted from this dashboard.">
        {error && <p style={{ margin: 0, fontSize: 14, color: "var(--danger)" }}>{error}</p>}
        {inquiries === null && !error && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>Loading…</p>}
        {inquiries && inquiries.length === 0 && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>No inquiries yet.</p>}
        {inquiries && inquiries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {inquiries.map((inq) => (
              <div key={inq.id} className="ah-card ah-card--pad-md" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <a href={`mailto:${inq.email}`} style={{ fontSize: 16, fontWeight: 600, color: "var(--text-body)", textDecoration: "none" }}>
                    {inq.name || "Unknown"}
                  </a>
                  <span style={{ fontSize: 12, color: "var(--text-disabled)", fontFamily: "var(--font-mono)" }}>{formatDate(inq.timestamp)}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {inq.email}
                  {inq.budget ? ` · ${inq.budget}` : ""}
                  {typeList(inq.types) ? ` · ${typeList(inq.types)}` : ""}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                  {inq.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </EditorLayout>
  );
}
