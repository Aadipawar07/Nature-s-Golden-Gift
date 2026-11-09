export default function ImagePlaceholder({ aspect = '1 / 1', className = '' }) {
  return (
    <div
      className={`image-placeholder ${className}`}
      style={{ aspectRatio: aspect }}
      aria-hidden="true"
    />
  );
}
