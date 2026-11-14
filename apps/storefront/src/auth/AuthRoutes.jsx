import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

export default function AuthRoutes() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
