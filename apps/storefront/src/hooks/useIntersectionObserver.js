import { useEffect, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
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
      { threshold: 0.15, ...options },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.root, options.rootMargin]);
  return ref;
}
