export function Input({ label, hint, error, textarea, style, ...rest }) {
  const cls = `ah-input${error ? " ah-input--error" : ""}`;
  const control = textarea ? <textarea className={cls} {...rest} /> : <input className={cls} {...rest} />;
  return (
    <label className="ah-field" style={style}>
      {label && <span className="ah-field__label">{label}</span>}
      {control}
      {(error || hint) && <span className={`ah-field__hint${error ? " ah-field__hint--error" : ""}`}>{error || hint}</span>}
    </label>
  );
}
