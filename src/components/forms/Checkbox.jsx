export function Checkbox({ label, disabled, style, ...rest }) {
  return (
    <label className={`ah-check${disabled ? " ah-check--disabled" : ""}`} style={style}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className="ah-check__box">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
