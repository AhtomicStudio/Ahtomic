import React from "react";
import { WebsiteView } from "./website/Website";

// Admin code (incl. its icon library, and now Firebase Auth — see
// firebaseAuth.js) only loads on /admin or /login — keeps the public bundle
// small and means public visitors never wait on an auth check to render.
const AdminGate = React.lazy(() => import("./admin/AdminGate"));

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

  // Routing condition
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (isAdminRoute) {
    return (
      <React.Suspense fallback={<CenteredNote>Loading dashboard...</CenteredNote>}>
        <AdminGate navigateTo={navigateTo} />
      </React.Suspense>
    );
  }

  return <WebsiteView />;
}
