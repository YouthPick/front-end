import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { type UserRole, useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { showToast } = useToast();
  const notifiedRef = useRef(false);

  const isRoleDenied = isAuthenticated && requiredRole !== undefined && user?.role !== requiredRole;

  useEffect(() => {
    if (notifiedRef.current) return;
    if (!isAuthenticated) {
      notifiedRef.current = true;
      showToast('이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.', 'info');
      return;
    }
    if (isRoleDenied) {
      notifiedRef.current = true;
      showToast('관리자 전용 페이지입니다. 홈으로 안내합니다.', 'warning');
    }
  }, [isAuthenticated, isRoleDenied, showToast]);

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.login} state={{ from: location.pathname + location.search }} replace />
    );
  }

  if (isRoleDenied) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
}
