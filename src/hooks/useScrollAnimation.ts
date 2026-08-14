import { useEffect, useRef } from "react";

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = [
              entry.target,
              ...entry.target.querySelectorAll(".animate-on-scroll"),
            ];
            targets.forEach((el, i) => {
              const delay = el === entry.target ? 0 : i * 60;
              setTimeout(() => {
                el.classList.add("animate-fade-in");
                el.classList.remove("scroll-hidden");
              }, delay);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return ref;
};
