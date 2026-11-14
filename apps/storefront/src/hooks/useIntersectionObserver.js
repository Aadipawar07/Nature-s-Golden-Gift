import { useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.15, root, rootMargin } = options;
  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      element?.classList.add('in-view');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      },
      { threshold, root, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);
  return ref;
}
