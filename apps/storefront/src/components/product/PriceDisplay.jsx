import { formatPaise } from '@ngg/shared/money';

export default function PriceDisplay({ price, mrp }) {
  return (
    <span className="inline-flex items-center gap-2">
      <strong className="font-display text-2xl tabular-nums text-gold-700">
        {formatPaise(price)}
      </strong>
      {mrp ? (
        <del className="text-sm text-ink-500">{formatPaise(mrp)}</del>
      ) : null}
    </span>
  );
}
