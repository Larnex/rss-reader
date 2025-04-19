import { useState, useEffect, RefObject, useCallback } from "react";
import { throttle } from "@/lib/utils";

export function useScrollProgress(containerRef?: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  // Memoize the updateScrollProgress function
  const updateScrollProgress = useCallback(() => {
    if (containerRef?.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const scrollableHeight = scrollHeight - clientHeight;

      if (scrollableHeight > 0) {
        const currentProgress = scrollTop / scrollableHeight;
        setProgress(Math.min(currentProgress, 1));
      }
    } else {
      const currentScrollPos =
        window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (scrollHeight) {
        const scrollPercent = currentScrollPos / scrollHeight;
        setProgress(Math.min(scrollPercent, 1));
      }
    }
  }, [containerRef]);

  useEffect(() => {
    // Apply throttle to the scroll handler
    const throttledScrollHandler = throttle(updateScrollProgress, 10);

    const scrollElement = containerRef?.current || window;
    scrollElement.addEventListener("scroll", throttledScrollHandler);

    // Initial calculation
    updateScrollProgress();

    return () =>
      scrollElement.removeEventListener("scroll", throttledScrollHandler);
  }, [containerRef, updateScrollProgress]);

  return progress;
}
