import React from "react";

export function Tabs({ tabs = [], value, defaultValue, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultValue ?? tabs[0]);
  const active = value !== undefined ? value : internal;
  const pick = (t) => {
    if (value === undefined) setInternal(t);
    if (onChange) onChange(t);
  };
  return (
    <div className="ah-tabs" role="tablist" style={style}>
      {tabs.map((t) => (
        <button key={t} className="ah-tabs__tab" role="tab" aria-selected={t === active} onClick={() => pick(t)}>{t}</button>
      ))}
    </div>
  );
}
