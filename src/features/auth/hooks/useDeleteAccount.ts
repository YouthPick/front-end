import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { parseApiError } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { requestAccountDeletion } from '../api/authApi';
import { getAuthErrorMessage } from '../api/authErrorMessages';

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
    } catch (error) {
      showToast(getAuthErrorMessage(parseApiError(error)), 'warning');
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAccount, isDeleting };
}
