/** Type-set brand name (no logo file exists): "Ahtomic" + red period. */
export interface WordmarkProps {
  /** Font size in px (nav ≈ 18, hero ≈ 34) */
  size?: number;
  /** Optional mono subline, e.g. "Studio · California" */
  sub?: string;
  href?: string;
  style?: React.CSSProperties;
}
