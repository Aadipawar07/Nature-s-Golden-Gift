import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function Reveal({ children, className = '' }) {
  const ref = useIntersectionObserver();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
