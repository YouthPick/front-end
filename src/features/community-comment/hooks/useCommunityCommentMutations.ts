import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/shared/ui';

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
    mutationFn: createCommunityComment,
    onSuccess: (_, variables) => {
      invalidateComments();
      showToast(
        variables.parentId ? '답글이 등록되었습니다.' : '댓글이 등록되었습니다.',
        'success',
      );
    },
    onError: () => {
      showToast('댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCommunityComment,
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 수정되었습니다.', 'success');
    },
    onError: () => {
      showToast('댓글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: () => {
      invalidateComments();
      showToast('댓글이 삭제되었습니다.', 'info');
    },
    onError: () => {
      showToast('댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
  });

  return {
    createComment: (
      authorName: string,
      authorEmail: string,
      content: string,
      options?: MutationOptions,
    ) =>
      createMutation.mutate({ postId, parentId: null, authorName, authorEmail, content }, options),
    createReply: (
      parentId: string,
      authorName: string,
      authorEmail: string,
      content: string,
      options?: MutationOptions,
    ) => createMutation.mutate({ postId, parentId, authorName, authorEmail, content }, options),
    updateComment: (commentId: string, content: string, options?: MutationOptions) =>
      updateMutation.mutate({ commentId, content }, options),
    deleteComment: (commentId: string, options?: MutationOptions) =>
      deleteMutation.mutate(commentId, options),
    isSubmitting: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
