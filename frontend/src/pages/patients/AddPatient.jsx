import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { createPatient } from '../../services/patientService';
import { BLOOD_GROUP_OPTIONS, GENDER_OPTIONS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';

const initialForm = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  address: '',
  bloodGroup: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.gender || !form.dateOfBirth || !form.email.trim() || !form.phoneNumber.trim() || !form.address.trim()) {
      return 'Please complete all required fields';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createPatient(form);
      navigate('/patients');
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
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Patients</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Add patient</h1>
          </div>
          <Link to="/patients" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>

      {error ? <Alert type="error" title="Unable to save patient" message={error} /> : null}

      <form onSubmit={handleSubmit} className="card-shell grid gap-5 p-6 md:grid-cols-2">
        <FormInput label="First name" name="firstName" value={form.firstName} onChange={handleChange} />
        <FormInput label="Last name" name="lastName" value={form.lastName} onChange={handleChange} />
        <FormInput label="Gender" as="select" name="gender" value={form.gender} onChange={handleChange} options={GENDER_OPTIONS} />
        <FormInput label="Date of birth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <FormInput label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        <FormInput label="Blood group" as="select" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} options={BLOOD_GROUP_OPTIONS} />
        <FormInput label="Emergency contact name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
        <FormInput label="Emergency contact phone" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />
        <div className="md:col-span-2">
          <FormInput label="Address" as="textarea" name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <Link to="/patients">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={loading}>
            Save patient
          </Button>
        </div>
      </form>
    </div>
  );
}
