import Button from './Button';

export default function Modal({
  isOpen,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        <div className="mt-5">{children}</div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} className="sm:min-w-28">
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} className="sm:min-w-28">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
