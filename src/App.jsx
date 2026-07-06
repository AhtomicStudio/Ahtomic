import React from "react";
import { WebsiteView } from "./website/Website";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Admin code (incl. its icon library) only loads on /admin — keeps the public bundle small
const AdminDashboard = React.lazy(() => import("./admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const LoginView = React.lazy(() => import("./admin/Login").then((m) => ({ default: m.LoginView })));

const CenteredNote = ({ children }) => (
  <div style={{
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "var(--surface-page)", color: "var(--text-secondary)",
    fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "var(--tracking-label)", textTransform: "uppercase"
  }}>
    {children}
  </div>
);

export default function App() {
  const [pathname, setPathname] = React.useState(window.location.pathname);
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  // Monitor Auth state changes
  React.useEffect(() => {
    if (!auth) {
      // Mock local authentication fallback if Firebase is not yet initialized
      const isMockAuthed = localStorage.getItem("ahtomic-mock-auth") === "true";
      if (isMockAuthed) {
        setUser({ email: "admin@ahtomic.studio", isMock: true });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Monitor browser back/forward buttons for SPA route routing
  React.useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    setPathname(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("ahtomic-mock-auth");
    setUser(null);
    navigateTo("/");
  };

  const handleLoginSuccess = () => {
    if (!auth) {
      localStorage.setItem("ahtomic-mock-auth", "true");
      setUser({ email: "admin@ahtomic.studio", isMock: true });
    }
    navigateTo("/admin");
  };

  if (authLoading) {
    return <CenteredNote>Authenticating...</CenteredNote>;
  }

  // Routing condition
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminRoute) {
    return (
      <React.Suspense fallback={<CenteredNote>Loading dashboard...</CenteredNote>}>
        {user
          ? <AdminDashboard onLogout={handleLogout} />
          : <LoginView onLoginSuccess={handleLoginSuccess} />}
      </React.Suspense>
    );
  }

  return <WebsiteView />;
}
