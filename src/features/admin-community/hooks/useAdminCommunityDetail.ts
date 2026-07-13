import {
  useAdminCommunityAttachmentsQuery,
  useAdminCommunityCommentsQuery,
  useSoftDeleteAdminCommunityCommentMutation,
  useSoftDeleteAdminCommunityPostMutation,
} from '@/entities/community-post';
import { useToast } from '@/shared/ui';

// 게시글 상세 모달의 댓글·첨부파일 조회 + 게시글/댓글 삭제(soft delete) mutation을 묶는다.
export function useAdminCommunityDetail(postId: string | null) {
  const { data: comments = [], isLoading: isCommentsLoading } =
    useAdminCommunityCommentsQuery(postId);
  const { data: attachments = [], isLoading: isAttachmentsLoading } =
    useAdminCommunityAttachmentsQuery(postId);
  const { showToast } = useToast();

  const deletePostMutation = useSoftDeleteAdminCommunityPostMutation();
  const deleteCommentMutation = useSoftDeleteAdminCommunityCommentMutation();

  const deletePost = () => {
    if (!postId) return;
    deletePostMutation.mutate(postId, {
      onSuccess: () => showToast('게시글을 삭제(soft delete) 처리했습니다.', 'warning'),
    });
  };

  const deleteComment = (commentId: string) => {
    if (!postId) return;
    deleteCommentMutation.mutate(
      { commentId, postId },
      { onSuccess: () => showToast('댓글을 삭제(soft delete) 처리했습니다.', 'warning') },
    );
  };

  return {
    comments,
    isCommentsLoading,
    attachments,
    isAttachmentsLoading,
    deletePost,
    isDeletingPost: deletePostMutation.isPending,
    deleteComment,
    isDeletingComment: deleteCommentMutation.isPending,
  };
}
