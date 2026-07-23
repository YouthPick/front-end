import { useNavigate } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { markLoggedOut } from '@/shared/api';
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
    // 로그아웃 직후 화면에 남아있던 요청이 뒤늦게 401로 실패해도 "세션이 만료되었습니다" 토스트가
    // 중복으로 뜨지 않게 먼저 표시한다.
    markLoggedOut();
    logout();
    navigate(ROUTES.home);
    showToast('안전하게 로그아웃 되었습니다.', 'info');
  };

  return { logout: handleLogout };
}
