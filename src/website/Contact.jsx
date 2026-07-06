import React from "react";
import { SectionLabel } from "../components/marketing/SectionLabel";
import { Input } from "../components/forms/Input";
import { Select } from "../components/forms/Select";
import { Checkbox } from "../components/forms/Checkbox";
import { Button } from "../components/forms/Button";
import { Toast } from "../components/feedback/Toast";
import { Card } from "../components/display/Card";
import { Page } from "./shared";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function ContactPage({ data = {} }) {
  const p = data.Contact || {
    label: "Contact",
    headline: "Start a",
    headlineAccent: "project",
    intro: "Tell us what you're building. A few sentences is plenty — we'll reply within two days with honest thoughts on scope, budget, and whether we're the right fit.",
    cta: "Send it"
  };

  const settings = data.settings || {
    email: "ahtomicstudio@gmail.com",
    location: "California · Remote-friendly",
    replyTime: "Replies within 2 days"
  };

  const [sent, setSent] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [budget, setBudget] = React.useState("Under $10k");
  const [message, setMessage] = React.useState("");
  const [types, setTypes] = React.useState({ website: true, mobileApp: false, designBrand: false });
  const [err, setErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!email.includes("@")) {
      setErr("Enter a real email so we can reply.");
      return;
    }
    setErr("");
    setSubmitting(true);

    try {
      if (db) {
        // Save to Firestore 'contacts' collection
        await addDoc(collection(db, "inquiries"), {
          name,
          email,
          budget,
          message,
          types,
          timestamp: serverTimestamp()
        });
      } else {
        // Simulated local fallback
        console.log("Firebase not initialized. Simulating submission:", { name, email, budget, message, types });
      }
      setSent(true);
    } catch (e) {
      console.error("Submission error:", e);
      setErr("Failed to send message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <div className="page-top contact-grid">
        <div>
          <SectionLabel index="01">{p.label}</SectionLabel>
          <h1 className="page-title" style={{ margin: "24px 0 0", fontWeight: 700, letterSpacing: "var(--tracking-display)", lineHeight: 1.05 }}>
            {p.headline}{" "}
            {p.headlineAccent && (
              <em className="hl-em" style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: 0 }}>
                {p.headlineAccent}
              </em>
            )}
            <span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          <p style={{ margin: "20px 0 0", fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>
            {p.intro}
          </p>
          <div style={{ marginTop: 40, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 10 }}>
            <span>{settings.location}</span>
            <span>{settings.replyTime}</span>
            <a href={`mailto:${settings.email}`} style={{ color: "var(--text-secondary)", textDecoration: "none", textTransform: "none", letterSpacing: "0.02em" }}>
              {settings.email}
            </a>
          </div>
        </div>
        <Card padding="lg" className="contact-card">
          {sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <Toast tone="positive">Message sent. We'll be in touch.</Toast>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)" }}>Thanks. Check your inbox in a day or two.</p>
              <Button variant="secondary" size="sm" onClick={() => { setSent(false); setEmail(""); setName(""); setMessage(""); }}>Send another</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="form-row">
                <Input label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={err} />
              </div>
              <Select
                label="Budget"
                options={["Under $10k", "$10–50k", "$50k+", "Not sure yet"]}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <Input label="About the project" textarea placeholder="What are you building?" value={message} onChange={(e) => setMessage(e.target.value)} />
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <Checkbox label="Website" checked={types.website} onChange={(e) => setTypes({ ...types, website: e.target.checked })} />
                <Checkbox label="Mobile app" checked={types.mobileApp} onChange={(e) => setTypes({ ...types, mobileApp: e.target.checked })} />
                <Checkbox label="Design / brand" checked={types.designBrand} onChange={(e) => setTypes({ ...types, designBrand: e.target.checked })} />
              </div>
              <Button variant="primary" size="lg" onClick={submit} disabled={submitting} style={{ alignSelf: "flex-start" }}>
                {submitting ? "Sending..." : p.cta || "Send it"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}
