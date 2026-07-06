/** Portfolio tile: framed screenshot, title, ↗ arrow, mono meta line. */
export interface ProjectCardProps {
  title: string;
  /** Mono meta line, e.g. "Web app · Live" */
  meta?: string;
  /** Screenshot path */
  image: string;
  imageAlt?: string;
  href?: string;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
}
