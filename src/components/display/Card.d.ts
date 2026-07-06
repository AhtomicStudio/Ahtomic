/** Surface container: card background, 1px line, 14px radius, no shadow at rest. */
export interface CardProps {
  /** Brightens the border on hover */
  interactive?: boolean;
  padding?: "md" | "lg";
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
