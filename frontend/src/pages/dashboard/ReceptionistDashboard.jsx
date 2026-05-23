import { FiCalendar, FiClipboard, FiUsers, FiPhone } from 'react-icons/fi';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const summaryCards = [
  { label: 'New check-ins', value: '14', icon: FiUsers, accent: 'text-blue-700' },
  { label: 'Appointments queued', value: '08', icon: FiCalendar, accent: 'text-cyan-700' },
  { label: 'Pending registrations', value: '05', icon: FiClipboard, accent: 'text-emerald-700' },
  { label: 'Open calls', value: '03', icon: FiPhone, accent: 'text-amber-700' },
];

const tasks = [
  'Confirm patient arrivals and document updates',
  'Coordinate doctor schedules for walk-ins',
  'Prepare billing handoff for completed appointments',
];

const queue = [
  { name: 'Alice Brown', reason: 'Initial consultation', time: '09:30 AM' },
  { name: 'Brian Adams', reason: 'Follow-up visit', time: '10:15 AM' },
  { name: 'Nina Clark', reason: 'Billing support', time: '11:00 AM' },
];

export default function ReceptionistDashboard() {
  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">Reception desk</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Front desk operations dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Track registrations, walk-ins, appointments, and billing handoffs from a single control point.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
            Register patient
          </Button>
          <Button className="border border-white/15 bg-white/10 text-white hover:bg-white/15">Create appointment</Button>
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-shell p-6">
          <h2 className="section-heading">Today&apos;s front desk checklist</h2>
          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div key={task} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {task}
              </div>
            ))}
          </div>
        </div>

        <div className="card-shell p-6">
          <h2 className="section-heading">Current queue</h2>
          <div className="mt-5 space-y-4">
            {queue.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.reason}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EmptyState
        title="Keep the line moving"
        description="Use the sidebar to jump into patients or appointments as soon as information needs updating."
        actionLabel="Open patients"
        onAction={() => (window.location.href = '/patients')}
      />
    </div>
  );
}
