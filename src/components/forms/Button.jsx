export function Button({ variant = "primary", size = "md", disabled, children, onClick, href, style }) {
  const cls = `ah-btn ah-btn--${size} ah-btn--${variant}`;
  if (href) {
    return <a className={cls} href={href} style={style} aria-disabled={disabled || undefined}>{children}</a>;
  }
  return <button className={cls} disabled={disabled} onClick={onClick} style={style}>{children}</button>;
}
