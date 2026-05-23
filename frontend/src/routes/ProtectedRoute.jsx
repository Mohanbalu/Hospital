import { Navigate, useLocation } from 'react-router-dom';
import { ROLES } from '../utils/constants';
import { getDefaultRouteForRole } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role || ROLES.PATIENT)} replace />;
  }

  return children;
}
