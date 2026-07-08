import { useNavigate } from "react-router";

import { SocialLoginPanel, useSocialLogin } from "@/features/auth";
import { ROUTES } from "@/shared/constants";

export function LoginPage() {
  const { socialLogin } = useSocialLogin();
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-300 max-w-md mx-auto py-8">
      <SocialLoginPanel onSocialLogin={socialLogin} onBackToHome={() => navigate(ROUTES.home)} />
    </div>
  );
}
