import { useLocation, useNavigate } from "react-router";

import { useAuthStore, useProfileStore, type UserRole } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";
import { getRedirectPath } from "@/shared/utils";

export function useSocialLogin() {
  const login = useAuthStore((state) => state.login);
  const profile = useProfileStore((state) => state.profile);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const socialLogin = (provider: string, role: UserRole = "member") => {
    // 데모 전용 관리자 진입: 실제 서비스에서는 서버가 계정 role을 내려준다.
    if (role === "admin") {
      login({ name: "관리자", role });
      showToast("관리자 데모 계정으로 로그인되었습니다.", "success");
      navigate(ROUTES.admin, { replace: true });
      return;
    }

    login({ name: "민지", role });
    showToast(`🎉 ${provider} 계정으로 환영합니다! 맞춤 청년 정책 매칭이 활성화되었습니다.`, "success");

    const from = getRedirectPath(location.state);

    // 관심 분야가 비어 있으면 최초 로그인으로 보고 프로필 설정 마법사로 안내한다.
    // 원래 가려던 경로(from)는 마법사 완료 후 복귀할 수 있게 state로 넘긴다.
    if (profile.interests.length === 0) {
      navigate(ROUTES.profileSetup, { replace: true, state: { from } });
      return;
    }

    navigate(from ?? ROUTES.home, { replace: true });
  };

  return { socialLogin };
}
