import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { GetUserDetails } from '../Features/AppSlice';
import { roleCanAccessPath } from '../auth/roleAccess';

export default function RoleRoute(): React.JSX.Element {
  const location = useLocation();
  const userDetails = useSelector(GetUserDetails) as { Role?: string } | null;

  if (!roleCanAccessPath(userDetails?.Role, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
