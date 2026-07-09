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
  });

  return {
    createPost: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
}
