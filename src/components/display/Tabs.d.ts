/** Underline tab strip; red underline on the active tab. */
export interface TabsProps {
  tabs: string[];
  /** Controlled active tab */
  value?: string;
  defaultValue?: string;
  onChange?: (tab: string) => void;
  style?: React.CSSProperties;
}
