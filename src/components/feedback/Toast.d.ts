/** Inline notification with a tone bar; position fixed at bottom-right when floating. */
export interface ToastProps {
  tone?: "neutral" | "positive" | "danger" | "accent";
  onDismiss?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
