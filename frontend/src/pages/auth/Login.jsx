import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errors';
import { getDefaultRouteForRole } from '../../utils/storage';

const initialForm = {
  email: '',
  password: '',
};

export default function Login() {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || getDefaultRouteForRole(role);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.email.trim()) {
      return 'Email is required';
    }
    if (!form.password.trim()) {
      return 'Password is required';
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
      const response = await login(form);
      navigate(response.redirectTo, { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-10 text-white lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Hospital Management System</p>
            <h1 className="mt-5 max-w-lg text-4xl font-bold leading-tight">A cleaner way to manage care, staff, and billing.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-blue-50/90">
              Log in to access role-aware dashboards, patient records, appointments, and billing workflows in one place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Secure JWT auth', 'Fast role routing', 'Responsive dashboard'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-medium backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in to your portal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use your registered email and password to continue.</p>
          </div>

          {error ? <Alert type="error" title="Login failed" message={error} /> : null}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="doctor@hospital.com"
              value={form.email}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full" isLoading={loading}>
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
