import { useCallback } from "react";

/**
 * Returns an onMouseMove handler that applies a cursor spotlight gradient
 * onto the hovered card element using CSS custom properties.
 */
export const useMouseSpotlight = () => {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spotlight-x", `${x}px`);
    card.style.setProperty("--spotlight-y", `${y}px`);
    card.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--spotlight-opacity", "0");
  }, []);

  return { onMouseMove, onMouseLeave };
};
