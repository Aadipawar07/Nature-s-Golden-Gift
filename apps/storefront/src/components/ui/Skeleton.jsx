export default function Skeleton({ className = '' }) {
  return (
    <div
      aria-busy="true"
      className={`animate-pulse rounded-md bg-cream-300 ${className}`}
    />
  );
}
