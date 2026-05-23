import { useEffect, useMemo, useState } from 'react';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import Table from '../../components/Table';
import { getAppointments } from '../../services/appointmentService';
import { getBills } from '../../services/billingService';
import { getDoctors } from '../../services/doctorService';
import { getPatients } from '../../services/patientService';
import { formatCurrency, formatDateTime, formatFullName, getStatusTone } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import { FiActivity, FiCalendar, FiDollarSign, FiUsers } from 'react-icons/fi';

const statCardClass = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ patients: [], doctors: [], appointments: [], bills: [] });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const [patients, doctors, appointments, bills] = await Promise.all([
          getPatients(),
          getDoctors(),
          getAppointments(),
          getBills(),
        ]);
        setStats({ patients, doctors, appointments, bills });
      } catch (dashboardError) {
        setError(getErrorMessage(dashboardError));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = stats.bills.reduce((sum, bill) => sum + Number(bill.totalAmount || 0), 0);
    const completedAppointments = stats.appointments.filter((item) => item.status === 'COMPLETED').length;
    return [
      { label: 'Total Patients', value: stats.patients.length, icon: FiUsers, accent: 'text-blue-700' },
      { label: 'Total Doctors', value: stats.doctors.length, icon: FiActivity, accent: 'text-cyan-700' },
      { label: 'Appointments', value: stats.appointments.length, icon: FiCalendar, accent: 'text-emerald-700' },
      { label: 'Revenue', value: formatCurrency(totalRevenue), icon: FiDollarSign, accent: 'text-violet-700' },
      { label: 'Completed Visits', value: completedAppointments, icon: FiActivity, accent: 'text-rose-700' },
    ];
  }, [stats]);

  const recentAppointments = [...stats.appointments]
    .sort((left, right) => new Date(right.appointmentDateTime) - new Date(left.appointmentDateTime))
    .slice(0, 5);

  const recentPatients = [...stats.patients].slice(0, 5);

  const columns = [
    {
      key: 'patientName',
      header: 'Patient',
      render: (row) => <div className="font-medium text-slate-900">{row.patientName || formatFullName(row.firstName, row.lastName)}</div>,
    },
    {
      key: 'doctorName',
      header: 'Doctor',
      render: (row) => row.doctorName || '-',
    },
    {
      key: 'appointmentDateTime',
      header: 'Scheduled',
      render: (row) => formatDateTime(row.appointmentDateTime),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusTone(row.status)}`}>{row.status}</span>,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Admin overview</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Hospital dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor patient volume, doctor capacity, appointments, and billing activity from a single control center.
          </p>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to load dashboard" message={error} /> : null}
      {loading ? (
        <Loader fullScreen />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {summary.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={statCardClass}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                    </div>
                    <div className={`rounded-2xl bg-slate-50 p-3 ${item.accent}`}>
                      <Icon className="text-xl" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="card-shell p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="section-heading">Recent appointments</h2>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {recentAppointments.length} latest
                  </span>
                </div>
                <Table
                  columns={columns}
                  data={recentAppointments}
                  emptyMessage="No appointments available yet"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card-shell p-6">
                  <h2 className="section-heading">Patient snapshot</h2>
                  <div className="mt-5 space-y-4">
                    {recentPatients.length > 0 ? (
                      recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <div>
                            <p className="font-semibold text-slate-900">{formatFullName(patient.firstName, patient.lastName)}</p>
                            <p className="text-xs text-slate-500">{patient.email}</p>
                          </div>
                          <span className="text-sm font-medium text-slate-600">{patient.gender || '-'}</span>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="No patient records"
                        description="Add patients to start tracking consultations and billing in the dashboard."
                      />
                    )}
                  </div>
                </div>

                <div className="card-shell p-6">
                  <h2 className="section-heading">Revenue progress</h2>
                  <div className="mt-5 space-y-4">
                    {['Paid', 'Pending', 'Overdue'].map((label, index) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{label}</span>
                          <span className="text-slate-500">{Math.max(15, 70 - index * 18)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
                            style={{ width: `${Math.max(15, 70 - index * 18)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-shell p-6">
                <h2 className="section-heading">Today&apos;s priorities</h2>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="rounded-2xl bg-blue-50 px-4 py-3 text-blue-800">Review incoming patient registrations.</div>
                  <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sky-800">Confirm doctor schedules and appointment load.</div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">Track payment collection and outstanding bills.</div>
                </div>
              </div>

              <div className="card-shell p-6">
                <h2 className="section-heading">Operational metrics</h2>
                <div className="mt-5 space-y-4">
                  {[
                    { label: 'Bed occupancy', value: '68%' },
                    { label: 'Consultation utilization', value: '84%' },
                    { label: 'Collection efficiency', value: '91%' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
