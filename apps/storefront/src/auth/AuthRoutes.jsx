import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

export default function AuthRoutes() {
  const location = useLocation();
  const requiresAuth =
    location.pathname === '/checkout' ||
    location.pathname === '/account' ||
    location.pathname.startsWith('/account/');

  return (
    <AuthProvider>
      {requiresAuth ? <ProtectedRoute /> : <Outlet />}
    </AuthProvider>
  );
}
