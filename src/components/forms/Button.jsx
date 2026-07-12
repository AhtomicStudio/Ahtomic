import { m } from "motion/react";
import { tap, tapTransition } from "../../motion";

export function Button({ variant = "primary", size = "md", disabled, children, onClick, href, target, rel, style }) {
  const cls = `ah-btn ah-btn--${size} ah-btn--${variant}`;
  if (href) {
    return <m.a className={cls} href={href} target={target} rel={rel} style={style} aria-disabled={disabled || undefined} whileTap={disabled ? undefined : tap} transition={tapTransition}>{children}</m.a>;
  }
  return <m.button className={cls} disabled={disabled} onClick={onClick} style={style} whileTap={disabled ? undefined : tap} transition={tapTransition}>{children}</m.button>;
}
