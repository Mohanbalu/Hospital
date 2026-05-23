import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { ROLE_OPTIONS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) {
      return 'Name is required';
    }
    if (!form.email.trim()) {
      return 'Email is required';
    }
    if (!form.password.trim()) {
      return 'Password is required';
    }
    if (form.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!form.role) {
      return 'Please select a role';
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
      const response = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setSuccess(response || 'Registration completed successfully');
      setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (registerError) {
      setError(getErrorMessage(registerError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">Join the hospital platform</p>
            <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight">Register staff and users with secure role-based access.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Create accounts for admins, doctors, receptionists, and patients while keeping the interface focused on hospital operations.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
            JWT token storage, role-aware redirects, and protected routing are already wired into the frontend.
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Create account</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Register a new user</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use a role that matches the backend permissions.</p>
          </div>

          {error ? <Alert type="error" title="Registration failed" message={error} /> : null}
          {success ? <Alert type="success" title="Success" message={success} /> : null}

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <FormInput label="Full name" name="name" placeholder="John Smith" value={form.name} onChange={handleChange} />
            <FormInput label="Email" type="email" name="email" placeholder="user@hospital.com" value={form.email} onChange={handleChange} />
            <FormInput label="Password" type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
            <FormInput
              label="Confirm password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <FormInput label="Role" as="select" name="role" value={form.role} onChange={handleChange} options={ROLE_OPTIONS} />
            <Button type="submit" className="w-full" isLoading={loading}>
              Create account
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
