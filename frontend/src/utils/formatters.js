export const formatDate = (value) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value));
};

export const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value));
};

export const formatFullName = (firstName, lastName) => [firstName, lastName].filter(Boolean).join(' ');

export const getInitials = (firstName = '', lastName = '') => {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || 'HM';
};

export const getStatusTone = (status = '') => {
  const value = status.toUpperCase();
  if (['PAID', 'COMPLETED', 'CONFIRMED'].includes(value)) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  }
  if (['PENDING', 'SCHEDULED'].includes(value)) {
    return 'bg-amber-50 text-amber-700 ring-amber-200';
  }
  if (['CANCELLED', 'OVERDUE'].includes(value)) {
    return 'bg-rose-50 text-rose-700 ring-rose-200';
  }
  return 'bg-slate-100 text-slate-700 ring-slate-200';
};
