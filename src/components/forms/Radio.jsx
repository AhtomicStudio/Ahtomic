export function Radio({ label, disabled, style, ...rest }) {
  return (
    <label className={`ah-check ah-check--radio${disabled ? " ah-check--disabled" : ""}`} style={style}>
      <input type="radio" disabled={disabled} {...rest} />
      <span className="ah-check__box"><span className="ah-check__dot"></span></span>
      {label && <span>{label}</span>}
    </label>
  );
}
