import React from "react";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import { pageTransition } from "../motion";

export * from "../motion";

// Tracks the CMS "Motion: Off" setting (data-motion attribute on <html>,
// set by the admin Appearance panel via an effect in Website.jsx).
function useCmsMotionOff() {
  // typeof document guard: this runs during SSR (src/entry-server.jsx),
  // where document doesn't exist. Defaulting to "not off" is harmless there
  // since prerendered static markup has no animation to suppress anyway.
  const [off, setOff] = React.useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.motion === "Off"
  );
  React.useEffect(() => {
    const update = () => setOff(document.documentElement.dataset.motion === "Off");
    update();
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => mo.disconnect();
  }, []);
  return off;
}

// Wraps the public site. `strict` throws if `motion.div` is ever used
// instead of the trimmed `m.div` — a guard rail against accidentally
// pulling in the full (larger) bundle. `MotionConfig`'s `reducedMotion`
// is how both "disable motion" signals get honored, in one place, by every
// m.* component in the tree with no extra code at each call site: "user"
// respects the OS-level prefers-reduced-motion automatically; "always"
// forces the same treatment when the CMS toggle is off.
export function MotionProvider({ children }) {
  const cmsOff = useCmsMotionOff();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={cmsOff ? "always" : "user"} transition={pageTransition}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
