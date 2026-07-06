import { useNavigate } from "react-router";

import { useAuthStore } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";

export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const deleteAccount = () => {
    logout();
    navigate(ROUTES.home);
    showToast("회원 탈퇴가 안전하게 처리되었습니다. 이용해주셔서 감사합니다.", "warning");
  };

  return { deleteAccount };
}
