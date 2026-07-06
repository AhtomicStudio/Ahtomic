import React from "react";
import { Input } from "../components/forms/Input";
import { Button } from "../components/forms/Button";
import { Wordmark } from "../components/marketing/Wordmark";
import { Toast } from "../components/feedback/Toast";
import { Card } from "../components/display/Card";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export function LoginView({ onLoginSuccess }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess();
      } else {
        // Fallback for mock local testing if Firebase is unconfigured
        if (email === "admin@ahtomic.studio" && password === "admin") {
          console.warn("Using simulated login fallback");
          onLoginSuccess();
        } else {
          throw new Error("Invalid credentials (try admin@ahtomic.studio / admin in local simulation)");
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface-page)", padding: 20
    }}>
      <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Wordmark size={24} />
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "var(--tracking-label)" }}>
            Admin Login
          </span>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {error && (
              <Toast tone="danger" onDismiss={() => setError("")}>
                {error}
              </Toast>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="admin@ahtomic.studio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              style={{ width: "100%", marginTop: 10 }}
            >
              {submitting ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
