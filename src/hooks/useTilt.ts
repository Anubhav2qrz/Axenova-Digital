import { useCallback } from "react";

/**
 * Returns an onMouseMove handler and a ref-setter to apply 3D tilt.
 * Usage: add onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={tiltStyle} to the card.
 */
export const useTilt = (intensity = 8) => {
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -intensity;
      const rotateY = ((x - cx) / cx) * intensity;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      card.style.transition = "transform 0.1s ease";
    },
    [intensity]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    card.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  return { onMouseMove, onMouseLeave };
};
