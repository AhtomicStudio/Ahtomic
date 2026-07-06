export function Wordmark({ size = 20, sub, href = "#", style, ...rest }) {
  return (
    <a className="ah-wordmark" href={href} style={{ fontSize: size, display: "inline-flex", flexDirection: "column", gap: 6, ...style }} {...rest}>
      <span>Ahtomic<span className="ah-wordmark__dot">.</span></span>
      {sub && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: Math.max(9, Math.round(size * 0.3)), letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>{sub}</span>
      )}
    </a>
  );
}
