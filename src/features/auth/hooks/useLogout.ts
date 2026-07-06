import { useNavigate } from "react-router";

import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
    showToast("안전하게 로그아웃 되었습니다.", "info");
  };

  return { logout: handleLogout };
}
