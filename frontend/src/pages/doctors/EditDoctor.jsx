import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';
import { getDoctorById, updateDoctor } from '../../services/doctorService';
import { getErrorMessage } from '../../utils/errors';

const initialForm = {
  departmentId: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  licenseNumber: '',
  specialization: '',
  yearsOfExperience: '',
  consultationFee: '',
};

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        const response = await getDoctorById(id);
        setForm({
          departmentId: response.departmentId || '',
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || '',
          phoneNumber: response.phoneNumber || '',
          licenseNumber: response.licenseNumber || '',
          specialization: response.specialization || '',
          yearsOfExperience: response.yearsOfExperience || '',
          consultationFee: response.consultationFee || '',
        });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError('');
      await updateDoctor(id, {
        ...form,
        departmentId: Number(form.departmentId),
        yearsOfExperience: Number(form.yearsOfExperience),
        consultationFee: Number(form.consultationFee),
      });
      navigate('/doctors');
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Doctors</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Edit doctor</h1>
          </div>
          <Link to="/doctors" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to update doctor" message={error} /> : null}

      <form onSubmit={handleSubmit} className="card-shell grid gap-5 p-6 md:grid-cols-2">
        <FormInput label="Department ID" name="departmentId" type="number" value={form.departmentId} onChange={handleChange} helperText="Use the numeric department ID configured in the backend." />
        <FormInput label="First name" name="firstName" value={form.firstName} onChange={handleChange} />
        <FormInput label="Last name" name="lastName" value={form.lastName} onChange={handleChange} />
        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <FormInput label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        <FormInput label="License number" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} />
        <FormInput label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} />
        <FormInput label="Years of experience" type="number" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} />
        <FormInput label="Consultation fee" type="number" name="consultationFee" value={form.consultationFee} onChange={handleChange} />
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <Link to="/doctors">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={saving}>
            Update doctor
          </Button>
        </div>
      </form>
    </div>
  );
}
