import { useState } from 'react';
export default function Accordion({ items }) {
  const [active, setActive] = useState(null);
  return (
    <div>
      {items.map((item, index) => (
        <div key={item.title} className="border-b border-cream-300">
          <button
            className="flex min-h-11 w-full items-center justify-between text-left font-semibold"
            aria-expanded={active === index}
            onClick={() => setActive(active === index ? null : index)}
          >
            {item.title}
            <span aria-hidden="true">+</span>
          </button>
          {active === index ? (
            <div className="pb-4 text-ink-500">{item.content}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
