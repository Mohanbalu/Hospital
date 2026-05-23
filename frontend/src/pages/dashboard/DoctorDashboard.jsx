import { useEffect, useMemo, useState } from 'react';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import Table from '../../components/Table';
import { getAppointments } from '../../services/appointmentService';
import { formatDateTime, formatFullName, getStatusTone } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import { FiCalendar, FiFileText, FiUserCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAppointments();
        setAppointments(data);
      } catch (dashboardError) {
        setError(getErrorMessage(dashboardError));
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments.filter((item) => new Date(item.appointmentDateTime).toDateString() === today);
  }, [appointments]);

  const summaryCards = [
    { label: 'Today appointments', value: todayAppointments.length, icon: FiCalendar, color: 'text-blue-700' },
    { label: 'Upcoming visits', value: appointments.filter((item) => item.status === 'SCHEDULED').length, icon: FiUserCheck, color: 'text-emerald-700' },
    { label: 'Prescription shortcuts', value: 12, icon: FiFileText, color: 'text-cyan-700' },
  ];

  const columns = [
    {
      key: 'patientName',
      header: 'Patient',
      render: (row) => <span className="font-medium text-slate-900">{row.patientName || formatFullName(row.firstName, row.lastName)}</span>,
    },
    {
      key: 'appointmentDateTime',
      header: 'Time',
      render: (row) => formatDateTime(row.appointmentDateTime),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => row.reason || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(row.status)}`}>{row.status}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Doctor overview</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your clinical dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Track patient flow, manage today&apos;s appointments, and jump into prescription workflows quickly.
        </p>
      </div>

      {error ? <Alert type="error" title="Unable to load appointments" message={error} /> : null}
      {loading ? (
        <Loader fullScreen />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="card-shell p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`rounded-2xl bg-slate-50 p-3 ${card.color}`}>
                      <Icon className="text-xl" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="card-shell p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="section-heading">Appointments queue</h2>
                <Link to="/appointments" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                  View all
                </Link>
              </div>
              <Table columns={columns} data={todayAppointments.slice(0, 8)} emptyMessage="No appointments scheduled for today" />
            </div>

            <div className="space-y-6">
              <div className="card-shell p-6">
                <h2 className="section-heading">Quick actions</h2>
                <div className="mt-5 space-y-3">
                  <Button className="w-full justify-start" onClick={() => window.location.assign('/appointments')}>
                    Review appointments
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" onClick={() => window.location.assign('/prescriptions')}>
                    Open prescriptions
                  </Button>
                </div>
              </div>

              <div className="card-shell p-6">
                <h2 className="section-heading">Today&apos;s focus</h2>
                {todayAppointments.length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {todayAppointments.slice(0, 4).map((appointment) => (
                      <div key={appointment.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="font-semibold text-slate-900">{appointment.patientName || 'Patient'}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(appointment.appointmentDateTime)}</p>
                        <p className="mt-3 text-sm text-slate-600">{appointment.reason || 'General consultation'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No appointments today" description="Your queue is clear for the day." />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
