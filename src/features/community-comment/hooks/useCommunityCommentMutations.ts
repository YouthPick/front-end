import { useMutation, useQueryClient } from '@tanstack/react-query';

import { parseApiError } from '@/shared/api';
import { useToast } from '@/shared/ui';

import { getCommentErrorMessage } from '../api/commentErrorMessages';
import {
  createCommunityComment,
  deleteCommunityComment,
  updateCommunityComment,
} from '../api/communityCommentApi';
import { communityCommentKeys } from './useCommunityComments';

interface MutationOptions {
  onSuccess?: () => void;
}

export function useCommunityCommentMutations(postId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: communityCommentKeys.byPost(postId) });
  };

  const createMutation = useMutation({
    mutationFn: (params: { parentId: string | null; content: string }) =>
      createCommunityComment({ postId, parentId: params.parentId, content: params.content }),
    onSuccess: (_, variables) => {
      invalidateComments();
      showToast(
        variables.parentId ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.',
        'success',
      );
    },
    onError: (error) => {
      showToast(getCommentErrorMessage(parseApiError(error)), 'warning');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { commentId: string; content: string }) =>
      updateCommunityComment({ postId, commentId: params.commentId, content: params.content }),
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 수정되었습니다.', 'success');
    },
    onError: (error) => {
      showToast(getCommentErrorMessage(parseApiError(error)), 'warning');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommunityComment({ postId, commentId }),
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 삭제되었습니다.', 'info');
    },
    onError: (error) => {
      showToast(getCommentErrorMessage(parseApiError(error)), 'warning');
    },
  });

  return {
    createComment: (content: string, options?: MutationOptions) =>
      createMutation.mutate({ parentId: null, content }, options),
    createReply: (parentId: string, content: string, options?: MutationOptions) =>
      createMutation.mutate({ parentId, content }, options),
    updateComment: (commentId: string, content: string, options?: MutationOptions) =>
      updateMutation.mutate({ commentId, content }, options),
    deleteComment: (commentId: string, options?: MutationOptions) =>
      deleteMutation.mutate(commentId, options),
    isSubmitting: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
