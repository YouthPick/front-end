import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui';

import { fetchBookmarkedPolicyIds, toggleBookmark } from '../api/bookmarkApi';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
};

export function useBookmark() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

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
      if (saved) {
        showToast('관심 정책으로 보관되었습니다! [신청관리]에서 일정을 추가해 보세요.', 'success');
      } else {
        showToast('관심 정책 목록에서 해제되었습니다.', 'info');
      }
    },
  });

  const isSaved = (policyId: string) => savedPolicyIds.includes(policyId);

  return {
    savedPolicyIds,
    isSaved,
    toggleSave: (policyId: string) => toggleMutation.mutate(policyId),
    isLoading,
    isError,
    refetch,
  };
}
