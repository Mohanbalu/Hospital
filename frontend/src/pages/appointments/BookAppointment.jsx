import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import { bookAppointment } from '../../services/appointmentService';
import { getDoctors } from '../../services/doctorService';
import { getPatients } from '../../services/patientService';
import { getErrorMessage } from '../../utils/errors';
import { formatFullName } from '../../utils/formatters';

const initialForm = {
  patientId: '',
  doctorId: '',
  appointmentDateTime: '',
  reason: '',
  notes: '',
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLookups = async () => {
      try {
        setLoading(true);
        const [patientData, doctorData] = await Promise.all([getPatients(), getDoctors()]);
        setPatients(Array.isArray(patientData) ? patientData : []);
        setDoctors(Array.isArray(doctorData) ? doctorData : []);
      } catch (lookupError) {
        setError(getErrorMessage(lookupError));
      } finally {
        setLoading(false);
      }
    };

    loadLookups();
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
      await bookAppointment({
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
      });
      navigate('/appointments');
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Appointments</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Book appointment</h1>
          </div>
          <Link to="/appointments" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to book appointment" message={error} /> : null}

      <form onSubmit={handleSubmit} className="card-shell grid gap-5 p-6 md:grid-cols-2">
        <FormInput
          label="Patient"
          as="select"
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          options={patients.map((patient) => ({ label: formatFullName(patient.firstName, patient.lastName), value: patient.id }))}
        />
        <FormInput
          label="Doctor"
          as="select"
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          options={doctors.map((doctor) => ({ label: formatFullName(doctor.firstName, doctor.lastName), value: doctor.id }))}
        />
        <FormInput label="Appointment date & time" type="datetime-local" name="appointmentDateTime" value={form.appointmentDateTime} onChange={handleChange} />
        <FormInput label="Reason" name="reason" value={form.reason} onChange={handleChange} />
        <div className="md:col-span-2">
          <FormInput label="Notes" as="textarea" name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <Link to="/appointments">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={saving}>
            Confirm appointment
          </Button>
        </div>
      </form>
    </div>
  );
}
