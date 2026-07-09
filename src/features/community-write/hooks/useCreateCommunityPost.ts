import { useMutation, useQueryClient } from '@tanstack/react-query';

import { communityPostKeys, createCommunityPost } from '@/entities/community-post';
import { useToast } from '@/shared/ui';

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
      showToast('게시글이 등록되었습니다.', 'success');
    },
    onError: () => {
      showToast('게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  return {
    createPost: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
}
