import {
  getIsAuthenticatedSelector,
  getIsAuthCheckedSelector
} from '../../slices/userSlice';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Страницы только для неавторизованных (логин, регистрация и т.д.)
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Защищенные страницы (только для авторизованных)
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
