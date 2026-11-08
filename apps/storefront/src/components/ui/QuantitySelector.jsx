export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}) {
  const update = (next) => onChange(Math.max(min, Math.min(max, next)));
  return (
    <div className="inline-flex items-center gap-2" aria-label="Quantity">
      <button
        className="min-h-11 min-w-11 rounded-md border"
        onClick={() => update(value - 1)}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <output aria-live="polite" className="min-w-8 text-center">
        {value}
      </output>
      <button
        className="min-h-11 min-w-11 rounded-md border"
        onClick={() => update(value + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
