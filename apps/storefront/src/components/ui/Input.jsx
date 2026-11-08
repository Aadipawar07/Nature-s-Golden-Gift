export default function Input({ label, hint, error, id, ...props }) {
  return (
    <div className="grid gap-2 text-sm font-semibold">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        {...props}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`form-control ${error ? 'border-error-fg' : ''} ${props.className || ''}`}
      />
      {error ? (
        <span id={`${id}-error`} role="alert" className="text-error-fg">
          {error}
        </span>
      ) : hint ? (
        <span className="font-normal text-ink-500">{hint}</span>
      ) : null}
    </div>
  );
}
