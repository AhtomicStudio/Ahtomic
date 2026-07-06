export function Select({ label, hint, options = [], style, ...rest }) {
  return (
    <label className="ah-field" style={style}>
      {label && <span className="ah-field__label">{label}</span>}
      <select className="ah-input" {...rest}>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
      {hint && <span className="ah-field__hint">{hint}</span>}
    </label>
  );
}
