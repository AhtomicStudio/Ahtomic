/** Native select styled like Input, with a chevron affordance. */
export interface SelectProps {
  label?: string;
  hint?: string;
  /** Strings or {value,label} pairs */
  options: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
