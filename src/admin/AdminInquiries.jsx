import React from "react";
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { EditorLayout, SectionCard, Icon } from "./AdminShared";
import { Button } from "../components/forms/Button";
import { Input } from "../components/forms/Input";
import { Dialog } from "../components/feedback/Dialog";
import { Toast } from "../components/feedback/Toast";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function typeList(types) {
  if (!types || typeof types !== "object") return "";
  return Object.entries(types).filter(([, v]) => v).map(([k]) => k).join(", ");
}

// View/delete/reply are the only actions this needs — update is intentionally
// not a thing (firestore.rules blocks it): a reply is a new email, never a
// mutation of the original submission.
export function InquiriesViewer() {
  const [inquiries, setInquiries] = React.useState(null);
  const [error, setError] = React.useState("");
  const [toast, setToast] = React.useState(null);

  const [replyTarget, setReplyTarget] = React.useState(null); // inquiry object or null
  const [replyText, setReplyText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [replyError, setReplyError] = React.useState("");

  const [deleteTarget, setDeleteTarget] = React.useState(null); // inquiry object or null
  const [deleting, setDeleting] = React.useState(false);

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

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const openReply = (inq) => {
    setReplyTarget(inq);
    setReplyText(`Hi ${inq.name || "there"},\n\n`);
    setReplyError("");
  };

  const sendReply = async () => {
    if (!replyTarget || !replyText.trim()) return;
    setSending(true);
    setReplyError("");
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/send-reply-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          to: replyTarget.email,
          subject: "Re: your inquiry to Ahtomic Studio",
          message: replyText,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Send failed");
      setReplyTarget(null);
      flash(`Reply sent to ${replyTarget.email}.`);
    } catch (err) {
      console.error("Failed to send reply:", err);
      setReplyError("Couldn't send the reply. Try again, or email them directly.");
    } finally {
      setSending(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "inquiries", deleteTarget.id));
      setInquiries((list) => list.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      flash("Inquiry deleted.");
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
      flash("Couldn't delete — try again.");
    } finally {
      setDeleting(false);
    }
  };

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
      <SectionCard title="Contact form submissions" hint="Most recent first. Reply sends from ahtomicstudio@gmail.com; delete is permanent.">
        {error && <p style={{ margin: 0, fontSize: 14, color: "var(--danger)" }}>{error}</p>}
        {inquiries === null && !error && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>Loading…</p>}
        {inquiries && inquiries.length === 0 && <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>No inquiries yet.</p>}
        {inquiries && inquiries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {inquiries.map((inq) => (
              <div key={inq.id} className="ah-card ah-card--pad-md" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{inq.name || "Unknown"}</span>
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
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Button variant="secondary" size="sm" onClick={() => openReply(inq)}>
                    <Icon name="Reply" size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" style={{ color: "var(--danger)" }} onClick={() => setDeleteTarget(inq)}>
                    <Icon name="Trash2" size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Dialog
        open={!!replyTarget}
        title={replyTarget ? `Reply to ${replyTarget.name || replyTarget.email}` : ""}
        description={replyTarget ? `Sent from ahtomicstudio@gmail.com to ${replyTarget.email}.` : ""}
        onClose={() => { if (!sending) setReplyTarget(null); }}
        actions={[
          <Button key="c" variant="ghost" onClick={() => setReplyTarget(null)} disabled={sending}>Cancel</Button>,
          <Button key="s" variant="primary" onClick={sendReply} disabled={sending || !replyText.trim()}>
            {sending ? "Sending…" : "Send reply"}
          </Button>,
        ]}
      >
        <Input textarea rows={8} value={replyText} onChange={(e) => setReplyText(e.target.value)} error={replyError} />
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        title="Delete this inquiry?"
        description={deleteTarget ? `This permanently removes ${deleteTarget.name || deleteTarget.email}'s submission. This can't be undone.` : ""}
        onClose={() => { if (!deleting) setDeleteTarget(null); }}
        actions={[
          <Button key="c" variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>,
          <Button key="d" variant="primary" onClick={confirmDelete} disabled={deleting} style={{ background: "var(--danger)" }}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>,
        ]}
      />

      {toast && (
        <div className="toast-stack">
          <Toast tone="positive" onDismiss={() => setToast(null)}>{toast}</Toast>
        </div>
      )}
    </EditorLayout>
  );
}
