export function IconButton({ variant = "secondary", size = "md", disabled, label, children, onClick, style }) {
  return (
    <button className={`ah-btn ah-iconbtn ah-btn--${size} ah-btn--${variant}`} disabled={disabled} onClick={onClick} aria-label={label} title={label} style={style}>
      {children}
    </button>
  );
}
