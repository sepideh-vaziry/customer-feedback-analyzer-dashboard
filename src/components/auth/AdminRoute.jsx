import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // TODO: Replace with actual role check when backend provides roles
  // For now, allow all authenticated users to access admin portal
  // In production, check: user?.role === 'ROLE_SUPER_ADMIN'
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
