import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import Button from './Button';
import { getDefaultRouteForRole } from '../utils/storage';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ role, onMenuToggle, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Toggle navigation"
          >
            <FiMenu />
          </button>
          <Link to={getDefaultRouteForRole(role)} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <FiUser />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Hospital Management</p>
              <p className="text-xs text-slate-500">{role || 'Guest'} Portal</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700 md:inline-flex">
            {role || 'Unknown'}
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              onLogout();
              navigate('/login', { replace: true });
            }}
          >
            <FiLogOut className="text-base" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
