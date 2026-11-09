export default function Select({ label, options, id, error, ...props }) {
  return (
    <div className="grid gap-2 text-sm font-semibold">
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props} className="form-control">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span role="alert" className="text-error-fg">
          {error}
        </span>
      ) : null}
    </div>
  );
}
