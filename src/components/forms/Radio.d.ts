/** Radio button; group via the native name prop. */
export interface RadioProps {
  label?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
}
