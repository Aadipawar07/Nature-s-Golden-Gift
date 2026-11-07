export default function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-10 bg-ink py-2 text-center font-mono text-[10px] font-semibold tracking-[.08em] text-beige">
      Free shipping above ₹499 <span className="px-3 text-goldPale">·</span>{' '}
      Dispatched within 24 hours <span className="px-3 text-goldPale">·</span>{' '}
      <span className="text-goldPale">Batch #014 — sun-dried Aug 2026</span>
    </div>
  );
}
