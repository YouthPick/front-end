import { useState } from 'react';
import { Link } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import { ConfirmDialog, ErrorState, Skeleton } from '@/shared/ui';
import { useCommunityCommentMutations } from '../hooks/useCommunityCommentMutations';
import { useCommunityComments } from '../hooks/useCommunityComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentListContainerProps {
  postId: string;
}

export function CommentListContainer({ postId }: CommentListContainerProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: comments = [], isLoading, isError, refetch } = useCommunityComments(postId);
  const {
    createComment,
    createReply,
    updateComment,
    deleteComment,
    isSubmitting,
    isUpdating,
    isDeleting,
  } = useCommunityCommentMutations(postId);

  const [newCommentValue, setNewCommentValue] = useState('');
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyValue, setReplyValue] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const topLevelComments = comments.filter((comment) => comment.parentId === null);
  const repliesByParentId = comments.reduce<Record<string, typeof comments>>((acc, comment) => {
    if (!comment.parentId) return acc;
    acc[comment.parentId] = [...(acc[comment.parentId] ?? []), comment];
    return acc;
  }, {});

  const handleSubmitComment = () => {
    if (!user) return;
    createComment(user.name, user.email, newCommentValue, {
      onSuccess: () => setNewCommentValue(''),
    });
  };

  const handleToggleReply = (commentId: string) => {
    setOpenReplyId((prev) => (prev === commentId ? null : commentId));
    setReplyValue('');
  };

  const handleSubmitReply = (commentId: string) => {
    if (!user) return;
    createReply(commentId, user.name, user.email, replyValue, {
      onSuccess: () => {
        setReplyValue('');
        setOpenReplyId(null);
      },
    });
  };

  const handleStartEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditValue(content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditValue('');
  };

  const handleSubmitEdit = () => {
    if (!editingCommentId) return;
    updateComment(editingCommentId, editValue, {
      onSuccess: () => {
        setEditingCommentId(null);
        setEditValue('');
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteComment(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="댓글을 불러오지 못했습니다" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold text-slate-800">댓글 {comments.length}</h3>

      {isAuthenticated && user ? (
        <CommentForm
          value={newCommentValue}
          onChange={setNewCommentValue}
          onSubmit={handleSubmitComment}
          placeholder="댓글을 입력해 주세요"
          submitLabel="댓글 등록"
          disabled={isSubmitting}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-4 px-4 text-center text-xs text-slate-500">
          댓글을 작성하려면{' '}
          <Link to={ROUTES.login} className="font-bold text-primary hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </div>
      )}

      {topLevelComments.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-400">첫 댓글을 남겨보세요.</p>
      ) : (
        <div className="space-y-3">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParentId[comment.id] ?? []}
              currentUserEmail={user?.email ?? null}
              canReply={isAuthenticated}
              isReplyOpen={openReplyId === comment.id}
              replyValue={replyValue}
              isSubmittingReply={isSubmitting}
              onToggleReply={() => handleToggleReply(comment.id)}
              onReplyValueChange={setReplyValue}
              onSubmitReply={() => handleSubmitReply(comment.id)}
              editingCommentId={editingCommentId}
              editValue={editValue}
              isUpdating={isUpdating}
              onStartEdit={handleStartEdit}
              onEditValueChange={setEditValue}
              onCancelEdit={handleCancelEdit}
              onSubmitEdit={handleSubmitEdit}
              onDeleteRequest={setDeleteTargetId}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 댓글은 복구할 수 없습니다. 답글이 있는 댓글은 답글도 함께 삭제됩니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        confirmDisabled={isDeleting}
      />
    </div>
  );
}
