/** Section opener: 1px rule + mono uppercase label + red index number. */
export interface SectionLabelProps {
  /** e.g. "01" */
  index?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
