/** Mono uppercase chip for categories (WEB, IOS, BRAND); optional remove. */
export interface TagProps {
  /** Shows an × button */
  onRemove?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
