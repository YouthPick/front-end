import { useNavigate } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { requestLogout } from '../api/authApi';

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await requestLogout();
    } catch {
      // 서버 로그아웃 실패해도 클라이언트 세션은 그대로 정리한다. refresh 쿠키는 만료/재사용 시 서버에서 무효 처리된다.
    }
    logout();
    navigate(ROUTES.home);
    showToast('안전하게 로그아웃 되었습니다.', 'info');
  };

  return { logout: handleLogout };
}
