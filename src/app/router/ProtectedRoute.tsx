import { useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { type UserRole, useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { Skeleton, useToast } from '@/shared/ui';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { showToast } = useToast();
  const notifiedRef = useRef(false);

  const isRoleDenied = isAuthenticated && requiredRole !== undefined && user?.role !== requiredRole;

  useEffect(() => {
    if (isInitializing || notifiedRef.current) return;
    if (!isAuthenticated) {
      notifiedRef.current = true;
      showToast('이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.', 'info');
      return;
    }
    if (isRoleDenied) {
      notifiedRef.current = true;
      showToast('관리자 전용 페이지입니다. 홈으로 안내합니다.', 'warning');
    }
  }, [isInitializing, isAuthenticated, isRoleDenied, showToast]);

  // refresh 쿠키로 세션을 복원하는 동안에는 로그인 화면으로 성급하게 리다이렉트하지 않는다.
  if (isInitializing) {
    return (
      <div className="max-w-md mx-auto py-16">
        <Skeleton className="h-40" />
      </div>
    );
  }

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
