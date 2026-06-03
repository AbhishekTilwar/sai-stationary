import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectUser, selectAuthStatus } from '@/store/slices/authSlice';
import PageLoader from '@/components/common/PageLoader';

export default function RequireAuth({ children, role }) {
  const user = useSelector(selectUser);
  const status = useSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'loading' || status === 'idle') return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
