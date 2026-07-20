import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  type CreateCommunityPostParams,
  communityPostKeys,
  createCommunityPost,
  updateCommunityPost,
} from '@/entities/community-post';
import { useToast } from '@/shared/ui';

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
      showToast('게시글이 등록되었습니다.', 'success');
    },
    onError: () => {
      showToast('게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ postId, params }: { postId: string; params: CreateCommunityPostParams }) =>
      updateCommunityPost(postId, params),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: communityPostKeys.all });
      queryClient.setQueryData(communityPostKeys.detail(post.id), post);
      showToast('게시글을 수정했습니다.', 'success');
    },
    onError: () => {
      showToast('게시글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  return {
    createPost: createMutation.mutateAsync,
    updatePost: updateMutation.mutateAsync,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
