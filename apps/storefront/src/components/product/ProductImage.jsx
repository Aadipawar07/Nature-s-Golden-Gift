import ImagePlaceholder from '../ui/ImagePlaceholder';

export default function ProductImage({
  src,
  alt,
  width,
  height,
  aspect = '1 / 1',
  priority = false,
}) {
  if (!src) return <ImagePlaceholder aspect={aspect} />;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
