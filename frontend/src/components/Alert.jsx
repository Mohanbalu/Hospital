export default function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
  };

  if (!message && !title) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 ${styles[type]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title ? <p className="font-semibold">{title}</p> : null}
          {message ? <p className="mt-1 text-sm leading-6 opacity-90">{message}</p> : null}
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="text-sm font-semibold opacity-70 transition hover:opacity-100">
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
