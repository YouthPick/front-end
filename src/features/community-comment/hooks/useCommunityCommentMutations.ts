import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui';

import { createCommunityComment } from '../api/communityCommentApi';
import { communityCommentKeys } from './useCommunityComments';

export function useCommunityCommentMutations(postId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: createCommunityComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityCommentKeys.byPost(postId) });
      showToast(
        variables.parentId ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.',
        'success',
      );
    },
  });

  return {
    createComment: (authorName: string, content: string) =>
      createMutation.mutate({ postId, parentId: null, authorName, content }),
    createReply: (parentId: string, authorName: string, content: string) =>
      createMutation.mutate({ postId, parentId, authorName, content }),
    isSubmitting: createMutation.isPending,
  };
}
