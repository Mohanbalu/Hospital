import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { createDoctor } from '../../services/doctorService';
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

export default function AddDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError('');
      await createDoctor({
        ...form,
        departmentId: Number(form.departmentId),
        yearsOfExperience: Number(form.yearsOfExperience),
        consultationFee: Number(form.consultationFee),
      });
      navigate('/doctors');
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="card-shell p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Doctors</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Add doctor</h1>
          </div>
          <Link to="/doctors" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to save doctor" message={error} /> : null}

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
          <Button type="submit" isLoading={loading}>
            Save doctor
          </Button>
        </div>
      </form>
    </div>
  );
}
