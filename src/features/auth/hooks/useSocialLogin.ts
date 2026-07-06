import { useLocation, useNavigate } from "react-router";

import { useAuthStore, useProfileStore } from "@/entities/user";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";

function getRedirectPath(state: unknown): string | null {
  if (typeof state !== "object" || state === null) return null;
  const from = (state as Record<string, unknown>).from;
  return typeof from === "string" ? from : null;
}

export function useSocialLogin() {
  const login = useAuthStore((state) => state.login);
  const profile = useProfileStore((state) => state.profile);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const socialLogin = (provider: string) => {
    login({ name: "민지", role: "member" });
    showToast(`🎉 ${provider} 계정으로 환영합니다! 맞춤 청년 정책 매칭이 활성화되었습니다.`, "success");

    // 관심 분야가 비어 있으면 최초 로그인으로 보고 프로필 설정 마법사로 안내한다.
    if (profile.interests.length === 0) {
      navigate(ROUTES.profileSetup, { replace: true });
      return;
    }

    const from = getRedirectPath(location.state);
    navigate(from ?? ROUTES.home, { replace: true });
  };

  return { socialLogin };
}
