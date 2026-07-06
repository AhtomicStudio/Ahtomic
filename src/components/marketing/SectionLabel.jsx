export function SectionLabel({ index, children, style }) {
  return (
    <div className="ah-sectionlabel" style={style}>
      {index && <span className="ah-sectionlabel__index">{index}</span>}
      <span className="ah-sectionlabel__text">{children}</span>
    </div>
  );
}
