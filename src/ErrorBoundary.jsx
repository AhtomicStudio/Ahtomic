import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
          background: "var(--surface-page)", color: "var(--text-secondary)", padding: 24, textAlign: "center"
        }}>
          <img src="/assets/mascot/thom.webp" alt="" width={56} height={56} style={{ height: 56 }} />
          <div style={{ fontSize: 17, fontWeight: 600, color: "var(--text-body)" }}>Something broke on our side.</div>
          <div style={{ fontSize: 14 }}>Reload the page, or email <a href="mailto:ahtomicstudio@gmail.com" style={{ color: "var(--text-accent)" }}>ahtomicstudio@gmail.com</a>.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
