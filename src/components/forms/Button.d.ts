/**
 * Primary action control. Primary (red) once per view; secondary/ghost elsewhere.
 * @startingPoint section="Forms" subtitle="Primary, secondary, ghost and inverse buttons" viewport="700x220"
 */
export interface ButtonProps {
  /** Visual style */
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Renders an <a> instead of <button> */
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
