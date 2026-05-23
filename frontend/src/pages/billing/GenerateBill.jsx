import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import { generateBill } from '../../services/billingService';
import { getPatients } from '../../services/patientService';
import { BILL_STATUS_OPTIONS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';
import { formatFullName } from '../../utils/formatters';

const initialForm = {
  patientId: '',
  appointmentId: '',
  issueDate: '',
  dueDate: '',
  totalAmount: '',
  status: '',
};

export default function GenerateBill() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await generateBill({
        ...form,
        patientId: Number(form.patientId),
        appointmentId: form.appointmentId ? Number(form.appointmentId) : null,
        totalAmount: Number(form.totalAmount),
      });
      navigate('/billing');
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Billing</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Generate bill</h1>
          </div>
          <Link to="/billing" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to generate bill" message={error} /> : null}

      <form onSubmit={handleSubmit} className="card-shell grid gap-5 p-6 md:grid-cols-2">
        <FormInput
          label="Patient"
          as="select"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          options={patients.map((patient) => ({ label: formatFullName(patient.firstName, patient.lastName), value: patient.id }))}
        />
        <FormInput label="Appointment ID" type="number" name="appointmentId" value={form.appointmentId} onChange={handleChange} helperText="Optional if the bill is not tied to a specific appointment." />
        <FormInput label="Issue date" type="date" name="issueDate" value={form.issueDate} onChange={handleChange} />
        <FormInput label="Due date" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        <FormInput label="Total amount" type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} />
        <FormInput label="Status" as="select" name="status" value={form.status} onChange={handleChange} options={BILL_STATUS_OPTIONS} />
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <Link to="/billing">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={saving}>
            Create invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
