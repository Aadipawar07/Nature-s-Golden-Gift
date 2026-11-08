export default function Badge({ children, tone = 'default' }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone === 'success' ? 'bg-leaf-100 text-leaf-700' : 'bg-gold-100 text-gold-800'}`}
    >
      {children}
    </span>
  );
}
