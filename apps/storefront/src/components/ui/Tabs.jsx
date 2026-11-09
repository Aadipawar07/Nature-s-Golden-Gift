import { useState } from 'react';
export default function Tabs({ items }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div role="tablist" className="flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.label}
            role="tab"
            aria-selected={active === index}
            aria-controls={`tab-panel-${index}`}
            className="min-h-11 rounded-full border border-cream-400 px-4"
            onClick={() => setActive(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id={`tab-panel-${active}`} role="tabpanel" className="mt-4">
        {items[active].content}
      </div>
    </div>
  );
}
