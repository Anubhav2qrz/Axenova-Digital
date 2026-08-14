import { useEffect, useRef } from "react";

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Immediately reveal all elements if on mobile or if reduced motion is preferred
    const isMobileOrReducedMotion =
      window.innerWidth < 768 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileOrReducedMotion && ref.current) {
      const targets = [
        ref.current,
        ...ref.current.querySelectorAll(".animate-on-scroll"),
      ];
      targets.forEach((el) => {
        el.classList.remove("opacity-0", "scroll-hidden");
        el.classList.add("opacity-100");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = [
              entry.target,
              ...entry.target.querySelectorAll(".animate-on-scroll"),
            ];
            targets.forEach((el, i) => {
              const delay = el === entry.target ? 0 : i * 50;
              setTimeout(() => {
                el.classList.add("animate-fade-in");
                el.classList.remove("opacity-0", "scroll-hidden");
              }, delay);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px 0px 50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    // Safety fallback: reveal everything after 1 second if observer didn't trigger
    const safetyTimeout = setTimeout(() => {
      if (ref.current) {
        const targets = [
          ref.current,
          ...ref.current.querySelectorAll(".animate-on-scroll"),
        ];
        targets.forEach((el) => {
          el.classList.remove("opacity-0", "scroll-hidden");
        });
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return ref;
};
