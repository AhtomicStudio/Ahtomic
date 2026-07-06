/** Square icon-only button; pass the icon element as children and always a label. */
export interface IconButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Accessible name (required) */
  label: string;
  onClick?: () => void;
  /** The icon element (Lucide, 16–20px, currentColor) */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
