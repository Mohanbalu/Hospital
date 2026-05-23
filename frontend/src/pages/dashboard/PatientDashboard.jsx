import { FiCalendar, FiFileText, FiCreditCard, FiBell } from 'react-icons/fi';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const summaryCards = [
  { label: 'Upcoming appointments', value: '02', icon: FiCalendar, accent: 'text-blue-700' },
  { label: 'Prescription history', value: '08', icon: FiFileText, accent: 'text-cyan-700' },
  { label: 'Outstanding bills', value: '$240.00', icon: FiCreditCard, accent: 'text-rose-700' },
  { label: 'Alerts', value: '03', icon: FiBell, accent: 'text-amber-700' },
];

const upcomingAppointments = [
  { title: 'General checkup', subtitle: 'Wed, 10:30 AM', status: 'Confirmed' },
  { title: 'Cardiology follow-up', subtitle: 'Fri, 02:00 PM', status: 'Scheduled' },
];

const billingItems = [
  { label: 'Consultation fee', amount: '$80.00', status: 'Paid' },
  { label: 'Laboratory charges', amount: '$160.00', status: 'Pending' },
];

export default function PatientDashboard() {
  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">Patient portal</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Your care summary at a glance</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/90">
              Review upcoming appointments, billing updates, and your treatment history from one clean dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              Book appointment
            </Button>
            <Button className="border border-white/20 bg-white/10 text-white hover:bg-white/15">View bills</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-shell p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className={`rounded-2xl bg-slate-50 p-3 ${card.accent}`}>
                  <Icon className="text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card-shell p-6">
          <h2 className="section-heading">Upcoming appointments</h2>
          <div className="mt-5 space-y-4">
            {upcomingAppointments.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-shell p-6">
            <h2 className="section-heading">Billing details</h2>
            <div className="mt-5 space-y-4">
              {billingItems.map((bill) => (
                <div key={bill.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{bill.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{bill.status}</p>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{bill.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-shell p-6">
            <h2 className="section-heading">Prescription history</h2>
            <div className="mt-5 space-y-4">
              {['Blood pressure medication', 'Routine antibiotics', 'Vitamin supplements'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <EmptyState
            title="Need to talk to reception?"
            description="Use the appointments section to coordinate reschedules and follow-up visits."
            actionLabel="Go to appointments"
            onAction={() => window.location.assign('/appointments')}
          />
        </div>
      </div>
    </div>
  );
}
