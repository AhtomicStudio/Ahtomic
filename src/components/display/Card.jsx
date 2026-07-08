import { m } from "motion/react";
import { tap, tapTransition } from "../../motion";

export function Card({ interactive, padding = "md", href, onClick, children, style, className }) {
  const clickable = interactive || href || onClick;
  const cls = `ah-card${clickable ? " ah-card--interactive" : ""} ah-card--pad-${padding}${className ? " " + className : ""}`;
  const tapProps = clickable ? { whileTap: tap, transition: tapTransition } : {};
  if (href) return <m.a className={cls} href={href} style={{ display: "block", textDecoration: "none", color: "inherit", ...style }} {...tapProps}>{children}</m.a>;
  return <m.div className={cls} onClick={onClick} style={style} {...tapProps}>{children}</m.div>;
}
