import { NavLink } from 'react-router-dom';
import { FiCalendar, FiGrid, FiFileText, FiPieChart, FiUsers, FiActivity } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { SIDEBAR_MENUS } from '../utils/constants';

const icons = {
  dashboard: FiGrid,
  users: FiUsers,
  stethoscope: MdOutlineLocalHospital,
  calendar: FiCalendar,
  billing: FiPieChart,
  file: FiFileText,
};

export default function Sidebar({ role, open, onClose }) {
  const menuItems = SIDEBAR_MENUS[role] || [];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:min-h-screen`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
            <FiActivity />
          </div>
          <div>
            <p className="text-sm font-semibold">Hospital UI</p>
            <p className="text-xs text-slate-400">Role aware navigation</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = icons[item.icon] || FiGrid;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 px-6 py-5 text-xs leading-6 text-slate-400">
          Secure hospital operations dashboard with JWT-protected navigation and role-aware access.
        </div>
      </aside>
    </>
  );
}
