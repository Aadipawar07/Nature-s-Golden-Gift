export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  ...props
}) {
  const styles = {
    primary: 'btn-primary',
    secondary: 'border border-ink-400 bg-transparent',
    ghost: 'bg-transparent',
  };
  return (
    <button
      {...props}
      className={`${styles[variant]} min-h-11 rounded-full px-5 py-3 font-semibold ${size === 'sm' ? 'text-sm' : ''} ${props.className || ''}`}
      disabled={props.disabled || loading}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}
