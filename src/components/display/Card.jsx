export function Card({ interactive, padding = "md", href, onClick, children, style, className }) {
  const cls = `ah-card${interactive || href || onClick ? " ah-card--interactive" : ""} ah-card--pad-${padding}${className ? " " + className : ""}`;
  if (href) return <a className={cls} href={href} style={{ display: "block", textDecoration: "none", color: "inherit", ...style }}>{children}</a>;
  return <div className={cls} onClick={onClick} style={style}>{children}</div>;
}
