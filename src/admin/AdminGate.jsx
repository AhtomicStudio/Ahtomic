import React from "react";
import { auth } from "../firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { AdminDashboard } from "./AdminDashboard";
import { LoginView } from "./Login";

const CenteredNote = ({ children }) => (
  <div style={{
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--surface-page)", color: "var(--text-secondary)",
    fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "var(--tracking-label)", textTransform: "uppercase"
  }}>
    {children}
  </div>
);

// All the auth-state logic that used to live in App.jsx, moved here so it
// only ever runs for someone actually on /admin or /login — previously it
// ran (and blocked first paint behind "Authenticating...") on every single
// page load, public visitors included.
export default function AdminGate({ navigateTo }) {
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth) {
      // Mock local authentication fallback if Firebase is not yet initialized
      const isMockAuthed = localStorage.getItem("ahtomic-mock-auth") === "true";
      setUser(isMockAuthed ? { email: "admin@ahtomic.com", isMock: true } : null);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ahtomic-mock-auth");
    setUser(null);
    navigateTo("/");
  };

  const handleLoginSuccess = () => {
    if (!auth) {
      localStorage.setItem("ahtomic-mock-auth", "true");
      setUser({ email: "admin@ahtomic.com", isMock: true });
    }
    navigateTo("/admin");
  };

  if (authLoading) {
    return <CenteredNote>Authenticating...</CenteredNote>;
  }

  return user
    ? <AdminDashboard onLogout={handleLogout} />
    : <LoginView onLoginSuccess={handleLoginSuccess} />;
}
