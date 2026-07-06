export function Dialog({ open, title, description, onClose, actions, children, style }) {
  if (!open) return null;
  return (
    <div className="ah-dialog-scrim" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className="ah-dialog" role="dialog" aria-modal="true" style={style}>
        {title && <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "var(--tracking-tight)", marginBottom: 8 }}>{title}</div>}
        {description && <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55 }}>{description}</p>}
        {children}
        {actions && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>{actions}</div>}
      </div>
    </div>
  );
}
