import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { fetchBookmarkedPolicyIds, toggleBookmark } from '../api/bookmarkApi';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
};

export function useBookmark() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: savedPolicyIds = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: bookmarkKeys.all,
    queryFn: fetchBookmarkedPolicyIds,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleBookmark,
    onSuccess: ({ saved }) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: ['trackers'] });
      if (saved) {
        showToast('관심 정책으로 보관되었습니다! [신청관리]에서 일정을 추가해 보세요.', 'success');
      } else {
        showToast('관심 정책 목록에서 해제되었습니다.', 'info');
      }
    },
  });

  const isSaved = (policyId: string) => savedPolicyIds.includes(policyId);

  const toggleSave = (policyId: string) => {
    if (!isAuthenticated) {
      showToast('로그인이 필요한 기능입니다. 로그인 화면으로 안내합니다.', 'info');
      navigate(ROUTES.login, {
        state: { from: location.pathname + location.search },
        replace: true,
      });
      return;
    }
    toggleMutation.mutate(policyId);
  };

  return {
    savedPolicyIds,
    isSaved,
    toggleSave,
    isLoading,
    isError,
    refetch,
  };
}
