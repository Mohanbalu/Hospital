import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import { cancelAppointment, getAppointments } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { APPOINTMENT_STATUS_OPTIONS, ROLES } from '../../utils/constants';
import { formatDateTime, formatFullName, getStatusTone } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import useDebounce from '../../hooks/useDebounce';

const patientPreviewAppointments = [
  { id: 'p1', patientName: 'You', doctorName: 'Dr. Amanda Ross', appointmentDateTime: '2026-05-23T10:30:00', status: 'CONFIRMED', reason: 'General follow-up' },
  { id: 'p2', patientName: 'You', doctorName: 'Dr. Kevin Patel', appointmentDateTime: '2026-05-27T14:00:00', status: 'SCHEDULED', reason: 'Lab review' },
];

export default function AppointmentList() {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const pageSize = 6;
  const canManageAppointments = [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.DOCTOR].includes(role);

  useEffect(() => {
    if (!canManageAppointments) {
      setLoading(false);
      return;
    }

    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [canManageAppointments]);

  const visibleAppointments = useMemo(() => {
    const source = canManageAppointments ? appointments : patientPreviewAppointments;
    return source.filter((item) => {
      const matchesSearch = [item.patientName, item.doctorName, item.reason, item.status]
        .join(' ')
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, canManageAppointments, debouncedSearch, statusFilter]);

  const pagedAppointments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleAppointments.slice(start, start + pageSize);
  }, [page, visibleAppointments]);

  const totalPages = Math.max(1, Math.ceil(visibleAppointments.length / pageSize));

  const handleCancel = async () => {
    if (!selectedAppointment) {
      return;
    }

    try {
      await cancelAppointment(selectedAppointment.id);
      setConfirmOpen(false);
      setSelectedAppointment(null);
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (cancelError) {
      setError(getErrorMessage(cancelError));
    }
  };

  const columns = [
    { key: 'patientName', header: 'Patient', render: (row) => <span className="font-medium text-slate-900">{row.patientName || formatFullName(row.firstName, row.lastName)}</span> },
    { key: 'doctorName', header: 'Doctor' },
    { key: 'appointmentDateTime', header: 'Date & Time', render: (row) => formatDateTime(row.appointmentDateTime) },
    { key: 'reason', header: 'Reason', render: (row) => row.reason || '-' },
    { key: 'status', header: 'Status', render: (row) => <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(row.status)}`}>{row.status}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {canManageAppointments ? (
            <Link to={`/appointments/${row.id}/reschedule`} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
              Reschedule
            </Link>
          ) : null}
          {canManageAppointments ? (
            <button
              type="button"
              onClick={() => {
                setSelectedAppointment(row);
                setConfirmOpen(true);
              }}
              className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Cancel
            </button>
          ) : null}
        </div>
      ),
    },
  ];

  if (!canManageAppointments) {
    return (
      <div className="space-y-6 animate-fadeInUp">
        <div className="card-shell p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Appointments</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Your appointment timeline</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            View your upcoming visits and plan follow-ups with the care team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {patientPreviewAppointments.map((appointment) => (
            <div key={appointment.id} className="card-shell p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(appointment.appointmentDateTime)}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(appointment.status)}`}>{appointment.status}</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{appointment.reason}</p>
            </div>
          ))}
        </div>

        <EmptyState
          title="Need to change a visit?"
          description="Please contact reception to reschedule or cancel if your role does not allow direct editing."
          actionLabel="Go to dashboard"
          onAction={() => (window.location.href = '/dashboard/patient')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Appointments</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Appointment management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage bookings, calendar timing, and visit statuses.</p>
          </div>
          <Link to="/appointments/new">
            <Button>
              <FiCalendar />
              Book appointment
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <FormInput label="Search" placeholder="Patient, doctor, reason, status" value={search} onChange={(event) => setSearch(event.target.value)} />
          <FormInput
            label="Status filter"
            as="select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[{ label: 'All statuses', value: 'ALL' }, ...APPOINTMENT_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))]}
          />
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-medium text-slate-700">Calendar mode</p>
            <p className="mt-1 text-xs leading-5">Browse scheduled visits with timeline-like cards and filters.</p>
          </div>
        </div>
      </div>

      {error ? <Alert type="error" title="Appointment operation failed" message={error} /> : null}
      {loading ? <Loader fullScreen /> : null}

      {!loading && visibleAppointments.length === 0 ? (
        <EmptyState title="No appointments found" description="Try another filter or create a new appointment." actionLabel="Book appointment" onAction={() => (window.location.href = '/appointments/new')} />
      ) : null}

      {!loading && visibleAppointments.length > 0 ? (
        <>
          <Table columns={columns} data={pagedAppointments} emptyMessage="No appointments on this page" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p>
              Showing {Math.min(pagedAppointments.length, visibleAppointments.length)} of {visibleAppointments.length} appointments
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

      <Modal
        isOpen={confirmOpen}
        title="Cancel appointment"
        description={`Cancel appointment for ${selectedAppointment?.patientName || 'this patient'}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancel}
        confirmLabel="Cancel appointment"
        danger
      />
    </div>
  );
}
