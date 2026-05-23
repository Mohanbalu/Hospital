import { FiFileText } from 'react-icons/fi';
import Button from '../../components/Button';
import Table from '../../components/Table';

const prescriptions = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    doctor: 'Dr. Amanda Ross',
    date: '2026-05-23',
    status: 'Issued',
  },
  {
    id: 2,
    patient: 'Mark Wilson',
    doctor: 'Dr. Kevin Patel',
    date: '2026-05-22',
    status: 'Pending Review',
  },
];

const columns = [
  { key: 'patient', header: 'Patient' },
  { key: 'doctor', header: 'Doctor' },
  { key: 'date', header: 'Date' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{row.status}</span>,
  },
];

export default function PrescriptionList() {
  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Prescriptions</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Clinical prescriptions</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Quickly review or prepare prescription records for current patients.
            </p>
          </div>
          <Button>
            <FiFileText />
            Create prescription
          </Button>
        </div>
      </div>

      <Table columns={columns} data={prescriptions} emptyMessage="No prescriptions available" />
    </div>
  );
}
