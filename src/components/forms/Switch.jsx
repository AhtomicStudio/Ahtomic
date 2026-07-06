export function Switch({ label, disabled, style, ...rest }) {
  return (
    <label className={`ah-switch${disabled ? " ah-switch--disabled" : ""}`} style={style}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="ah-switch__track"><span className="ah-switch__thumb"></span></span>
      {label && <span>{label}</span>}
    </label>
  );
}
