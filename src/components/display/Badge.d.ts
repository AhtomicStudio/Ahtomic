/** Small status pill; tones stay quiet, solid red is rare. */
export interface BadgeProps {
  tone?: "neutral" | "accent" | "positive" | "warning" | "solid";
  /** Leading status dot */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
