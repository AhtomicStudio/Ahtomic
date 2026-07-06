export function Tooltip({ text, children, style }) {
  return (
    <span className="ah-tooltip-wrap" tabIndex={0} style={style}>
      {children}
      <span className="ah-tooltip" role="tooltip">{text}</span>
    </span>
  );
}
