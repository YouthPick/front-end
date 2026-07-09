import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui';

import {
  createCommunityComment,
  deleteCommunityComment,
  updateCommunityComment,
} from '../api/communityCommentApi';
import { communityCommentKeys } from './useCommunityComments';

export function useCommunityCommentMutations(postId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: communityCommentKeys.byPost(postId) });
  };

  const createMutation = useMutation({
    mutationFn: createCommunityComment,
    onSuccess: (_, variables) => {
      invalidateComments();
      showToast(
        variables.parentId ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.',
        'success',
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCommunityComment,
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 수정되었습니다.', 'success');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 삭제되었습니다.', 'info');
    },
  });

  return {
    createComment: (authorName: string, authorEmail: string, content: string) =>
      createMutation.mutate({ postId, parentId: null, authorName, authorEmail, content }),
    createReply: (parentId: string, authorName: string, authorEmail: string, content: string) =>
      createMutation.mutate({ postId, parentId, authorName, authorEmail, content }),
    updateComment: (commentId: string, content: string) =>
      updateMutation.mutate({ commentId, content }),
    deleteComment: (commentId: string) => deleteMutation.mutate(commentId),
    isSubmitting: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
