import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import DoctorDashboard from '../pages/dashboard/DoctorDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import ReceptionistDashboard from '../pages/dashboard/ReceptionistDashboard';
import PatientList from '../pages/patients/PatientList';
import AddPatient from '../pages/patients/AddPatient';
import EditPatient from '../pages/patients/EditPatient';
import ViewPatient from '../pages/patients/ViewPatient';
import DoctorList from '../pages/doctors/DoctorList';
import AddDoctor from '../pages/doctors/AddDoctor';
import EditDoctor from '../pages/doctors/EditDoctor';
import AppointmentList from '../pages/appointments/AppointmentList';
import BookAppointment from '../pages/appointments/BookAppointment';
import RescheduleAppointment from '../pages/appointments/RescheduleAppointment';
import BillingList from '../pages/billing/BillingList';
import GenerateBill from '../pages/billing/GenerateBill';
import PrescriptionList from '../pages/prescriptions/PrescriptionList';
import NotFound from '../pages/common/NotFound';
import { ROLE_HOME_ROUTES, ROLES } from '../utils/constants';
import { getDefaultRouteForRole } from '../utils/storage';

function PublicRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return children;
}

function HomeRedirect() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={ROLE_HOME_ROUTES[role] || ROLE_HOME_ROUTES[ROLES.PATIENT]} replace />;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/" element={<HomeRedirect />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute roles={[ROLES.DOCTOR]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute roles={[ROLES.PATIENT]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/receptionist"
            element={
              <ProtectedRoute roles={[ROLES.RECEPTIONIST]}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/new"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <AddPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <ViewPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id/edit"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <EditPatient />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/new"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <AddDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/:id/edit"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN]}>
                <EditDoctor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST, ROLES.PATIENT]}>
                <AppointmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments/:id/reschedule"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
                <RescheduleAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT]}>
                <BillingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing/new"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <GenerateBill />
              </ProtectedRoute>
            }
          />

          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute roles={[ROLES.DOCTOR]}>
                <PrescriptionList />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
