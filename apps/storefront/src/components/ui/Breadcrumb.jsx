import { Link } from 'react-router-dom';
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-2 text-sm text-ink-500">
        {items.map((item, index) => (
          <li key={item.label}>
            {index ? ' / ' : ''}
            {item.to ? (
              <Link className="underline" to={item.to}>
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
