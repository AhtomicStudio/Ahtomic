export function Toast({ tone = "neutral", children, onDismiss, style }) {
  const toneCls = tone === "neutral" ? "" : ` ah-toast--${tone}`;
  return (
    <div className={`ah-toast${toneCls}`} role="status" style={style}>
      <span className="ah-toast__bar"></span>
      <span style={{ flex: 1 }}>{children}</span>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" style={{ all: "unset", cursor: "pointer", lineHeight: 0, color: "var(--text-muted)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}
