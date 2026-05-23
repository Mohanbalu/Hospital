import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function DashboardLayout() {
  const { role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar role={role} onMenuToggle={() => setSidebarOpen((value) => !value)} onLogout={logout} />
        <main className="flex-1 pb-10 pt-6">
          <div className="page-shell">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-slate-200/70 bg-white/70 py-4 text-center text-sm text-slate-500 backdrop-blur">
          Hospital Management System UI
        </footer>
      </div>
    </div>
  );
}
