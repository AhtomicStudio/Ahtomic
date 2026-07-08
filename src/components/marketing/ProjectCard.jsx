import { m } from "motion/react";
import { tap, tapTransition } from "../../motion";

export function ProjectCard({ title, meta, image, imageAlt, href = "#", onClick, style }) {
  return (
    <m.a className="ah-projectcard" href={href} onClick={onClick} style={style} whileTap={tap} transition={tapTransition}>
      <img className="ah-projectcard__img" src={image} alt={imageAlt || title} />
      <div className="ah-projectcard__body">
        <span className="ah-projectcard__title">{title}</span>
        <span className="ah-projectcard__arrow">↗</span>
      </div>
      {meta && <div className="ah-projectcard__meta">{meta}</div>}
    </m.a>
  );
}
