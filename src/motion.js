// Shared Framer Motion tokens + helpers. Lives at src root (not
// src/website/) so both src/components (reusable primitives) and
// src/website (page composition) can import it without an inverted
// dependency between the two.

// Mirrors src/tokens/effects.css — Framer Motion timing is JS, not CSS
// custom properties, so the brand's motion values are duplicated here.
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const DUR_FAST = 0.14;
export const DUR_SLOW = 0.42;

// Default transition for page-level transitions (MotionConfig default).
export const pageTransition = { duration: DUR_SLOW, ease: EASE_OUT };

// Press feedback for buttons/cards — translate only, no scale, per brand
// rule ("No scale-ups on hover... No shrink transforms").
export const tap = { y: 1 };
export const tapTransition = { duration: 0.1, ease: EASE_OUT };

// Same fade+rise the old [data-reveal] CSS used, now as Framer variants.
export const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const revealTransitionFor = (delayMs = 0) => ({
  duration: 0.6,
  ease: EASE_OUT,
  delay: delayMs / 1000,
});

// Spread onto any m.* element to reproduce the old [data-reveal] behavior:
// fades/rises into place the first time it scrolls into view, staggered by
// delayMs (was the "--d" CSS custom property).
//   <m.div {...revealProps(90)}>...</m.div>
export const revealProps = (delayMs = 0) => ({
  variants: revealVariants,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.12 },
  transition: revealTransitionFor(delayMs),
});
