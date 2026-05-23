import { Link } from 'react-router-dom';
import Button from '../../components/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-shell max-w-xl p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">The page you are looking for is not available.</p>
        <div className="mt-6 flex justify-center">
          <Link to="/login">
            <Button>Go to login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
