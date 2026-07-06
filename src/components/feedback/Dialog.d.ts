/** Modal over a blurred scrim; scrim click closes. */
export interface DialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  /** Footer buttons, right-aligned */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
