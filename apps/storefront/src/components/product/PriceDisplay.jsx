export default function PriceDisplay({ price, mrp }) {
  const format = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value / 100);
  return (
    <span className="inline-flex items-center gap-2">
      <strong className="font-display text-2xl tabular-nums text-gold-700">
        {format(price)}
      </strong>
      {mrp ? <del className="text-sm text-ink-500">{format(mrp)}</del> : null}
    </span>
  );
}
