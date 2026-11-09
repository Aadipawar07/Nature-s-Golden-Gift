export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[var(--z-toast)] rounded-md bg-ink-900 px-4 py-3 text-cream-50 shadow-lg"
    >
      {message}
      <button
        className="ml-3 min-h-11"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
