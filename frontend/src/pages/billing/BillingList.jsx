import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import Table from '../../components/Table';
import { getBills } from '../../services/billingService';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { formatCurrency, formatDate, getStatusTone } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import useDebounce from '../../hooks/useDebounce';

const patientPreviewBills = [
  { id: 'b1', billNumber: 'INV-2026-001', totalAmount: 80, status: 'PAID', issueDate: '2026-05-10', dueDate: '2026-05-20', patientName: 'You' },
  { id: 'b2', billNumber: 'INV-2026-008', totalAmount: 160, status: 'PENDING', issueDate: '2026-05-18', dueDate: '2026-06-01', patientName: 'You' },
];

export default function BillingList() {
  const { role } = useAuth();
  const canManageBilling = [ROLES.ADMIN, ROLES.RECEPTIONIST].includes(role);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const pageSize = 6;

  useEffect(() => {
    if (!canManageBilling) {
      setLoading(false);
      return;
    }

    const loadBills = async () => {
      try {
        setLoading(true);
        const data = await getBills();
        setBills(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, [canManageBilling]);

  const visibleBills = useMemo(() => {
    const source = canManageBilling ? bills : patientPreviewBills;
    return source.filter((bill) => {
      const text = [bill.billNumber, bill.patientName, bill.status].join(' ').toLowerCase();
      return text.includes(debouncedSearch.toLowerCase());
    });
  }, [bills, canManageBilling, debouncedSearch]);

  const pagedBills = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleBills.slice(start, start + pageSize);
  }, [page, visibleBills]);

  const totalPages = Math.max(1, Math.ceil(visibleBills.length / pageSize));

  const columns = [
    { key: 'billNumber', header: 'Invoice' },
    { key: 'patientName', header: 'Patient' },
    { key: 'issueDate', header: 'Issued', render: (row) => formatDate(row.issueDate) },
    { key: 'dueDate', header: 'Due', render: (row) => formatDate(row.dueDate) },
    { key: 'totalAmount', header: 'Amount', render: (row) => formatCurrency(row.totalAmount) },
    { key: 'status', header: 'Status', render: (row) => <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(row.status)}`}>{row.status}</span> },
  ];

  if (!canManageBilling) {
    return (
      <div className="space-y-6 animate-fadeInUp">
        <div className="card-shell p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Billing</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your billing summary</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">View invoice summaries, payment status, and upcoming dues.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {patientPreviewBills.map((bill) => (
            <div key={bill.id} className="card-shell p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{bill.billNumber}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(bill.issueDate)} - {formatDate(bill.dueDate)}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(bill.status)}`}>{bill.status}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">{formatCurrency(bill.totalAmount)}</span>
              </div>
            </div>
          ))}
        </div>

        <EmptyState title="Need billing assistance?" description="Reception can update invoice records or mark payments on your behalf." actionLabel="Go to dashboard" onAction={() => (window.location.href = '/dashboard/patient')} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Billing</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Billing management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Track invoices, payment statuses, and revenue flow from one workspace.</p>
          </div>
          <Link to="/billing/new">
            <Button>
              <FiCreditCard />
              Generate bill
            </Button>
          </Link>
        </div>
        <div className="mt-6 max-w-md">
          <FormInput label="Search bills" placeholder="Invoice, patient, or status" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
      </div>

      {error ? <Alert type="error" title="Billing operation failed" message={error} /> : null}
      {loading ? <Loader fullScreen /> : null}

      {!loading && visibleBills.length === 0 ? (
        <EmptyState title="No bills found" description="Create a new invoice or adjust the filter search." actionLabel="Generate bill" onAction={() => (window.location.href = '/billing/new')} />
      ) : null}

      {!loading && visibleBills.length > 0 ? (
        <>
          <Table columns={columns} data={pagedBills} emptyMessage="No bills on this page" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p>
              Showing {Math.min(pagedBills.length, visibleBills.length)} of {visibleBills.length} bills
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </Button>
              <span className="px-2 text-sm font-semibold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <Button variant="secondary" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
