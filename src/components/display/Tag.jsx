export function Tag({ onRemove, children, style }) {
  return (
    <span className="ah-tag" style={style}>
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </span>
  );
}
