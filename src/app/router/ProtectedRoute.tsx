import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const { showToast } = useToast();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !notifiedRef.current) {
      notifiedRef.current = true;
      showToast("이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.", "info");
    }
  }, [isAuthenticated, showToast]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.login}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  return <Outlet />;
}
