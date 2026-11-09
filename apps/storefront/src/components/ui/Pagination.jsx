export default function Pagination({ page, pages, onChange }) {
  return (
    <nav aria-label="Pagination" className="flex gap-2">
      {Array.from({ length: pages }, (_, index) => index + 1).map((value) => (
        <button
          key={value}
          className="min-h-11 min-w-11 rounded-md border border-cream-400"
          aria-current={page === value ? 'page' : undefined}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </nav>
  );
}
