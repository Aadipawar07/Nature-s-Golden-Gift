import { useEffect, useRef } from 'react';
export default function Drawer({ open, onClose, title = 'Menu', children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && ref.current) {
        const focusable = ref.current.querySelectorAll(
          'button,a,input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[var(--z-drawer)] bg-ink-900/40"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside
        ref={ref}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="ml-auto h-full w-[min(22rem,90vw)] bg-cream-50 p-6 shadow-lg"
      >
        {children}
      </aside>
    </div>
  );
}
