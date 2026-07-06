/** Text field with label/hint/error; set textarea for multi-line. */
export interface InputProps {
  label?: string;
  hint?: string;
  /** Error message; replaces hint and turns the border red */
  error?: string;
  /** Render a textarea instead of an input */
  textarea?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  type?: string;
  style?: React.CSSProperties;
}
