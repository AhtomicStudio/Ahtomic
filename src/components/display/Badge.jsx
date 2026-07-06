export function Badge({ tone = "neutral", dot, children, style }) {
  const toneCls = tone === "neutral" ? "" : ` ah-badge--${tone}`;
  return (
    <span className={`ah-badge${toneCls}`} style={style}>
      {dot && <span className="ah-badge__dot"></span>}
      {children}
    </span>
  );
}
