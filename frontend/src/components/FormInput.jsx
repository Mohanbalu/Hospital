export default function FormInput({
  label,
  error,
  helperText,
  className = '',
  as = 'input',
  options = [],
  id,
  ...props
}) {
  const inputId = id || props.name;

  const baseClasses =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  return (
    <label className={`block space-y-2 ${className}`} htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      {as === 'textarea' ? (
        <textarea id={inputId} className={`${baseClasses} min-h-[120px]`} {...props} />
      ) : as === 'select' ? (
        <select id={inputId} className={baseClasses} {...props}>
          <option value="">Select {label?.toLowerCase() || 'option'}</option>
          {options.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
      ) : (
        <input id={inputId} className={baseClasses} {...props} />
      )}
      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : null}
    </label>
  );
}
