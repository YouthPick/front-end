import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { requestAccountDeletion } from '../api/authApi';

// 회원 탈퇴 실패의 code는 로그인(AuthErrorCode)이 아닌 사용자/도메인 쪽일 가능성이 높아
// authErrorMessages(로그인 전용 매핑)를 재사용하지 않는다. 백엔드가 탈퇴 관련 code를
// 확정하면 그때 code 기반 매핑으로 교체한다.
const DELETE_ACCOUNT_ERROR_MESSAGE =
  '회원 탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await requestAccountDeletion();
      logout();
      navigate(ROUTES.home);
      showToast('회원 탈퇴가 안전하게 처리되었습니다. 이용해주셔서 감사합니다.', 'warning');
    } catch {
      showToast(DELETE_ACCOUNT_ERROR_MESSAGE, 'warning');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting };
}
