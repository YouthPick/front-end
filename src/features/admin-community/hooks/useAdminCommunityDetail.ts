import {
  useAdminCommunityAttachmentsQuery,
  useAdminCommunityCommentsQuery,
  useSoftDeleteAdminCommunityCommentMutation,
  useSoftDeleteAdminCommunityPostMutation,
} from '@/entities/community-post';
import { useToast } from '@/shared/ui';

// 게시글 상세 모달의 댓글·첨부파일 조회 + 게시글/댓글 삭제(soft delete) mutation을 묶는다.
export function useAdminCommunityDetail(postId: string | null) {
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: reloadComments,
  } = useAdminCommunityCommentsQuery(postId);
  const {
    data: attachments = [],
    isLoading: isAttachmentsLoading,
    isError: isAttachmentsError,
    refetch: reloadAttachments,
  } = useAdminCommunityAttachmentsQuery(postId);
  const { showToast } = useToast();

  const deletePostMutation = useSoftDeleteAdminCommunityPostMutation();
  const deleteCommentMutation = useSoftDeleteAdminCommunityCommentMutation();

  const deletePost = () => {
    if (!postId) return;
    deletePostMutation.mutate(postId, {
      onSuccess: () => showToast('게시글을 삭제(soft delete) 처리했습니다.', 'warning'),
      onError: () =>
        showToast('게시글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
    });
  };

  const deleteComment = (commentId: string) => {
    if (!postId) return;
    deleteCommentMutation.mutate(
      { commentId, postId },
      {
        onSuccess: () => showToast('댓글을 삭제(soft delete) 처리했습니다.', 'warning'),
        onError: () =>
          showToast('댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning'),
      },
    );
  };

  return {
    comments,
    isCommentsLoading,
    isCommentsError,
    reloadComments,
    attachments,
    isAttachmentsLoading,
    isAttachmentsError,
    reloadAttachments,
    deletePost,
    isDeletingPost: deletePostMutation.isPending,
    deleteComment,
    isDeletingComment: deleteCommentMutation.isPending,
  };
}
