import type { CommunityComment } from '../types/communityComment.types';
import { CommentForm } from './CommentForm';
import { CommentRow } from './CommentRow';

interface CommentItemProps {
  comment: CommunityComment;
  replies: CommunityComment[];
  currentUserEmail: string | null;
  canReply: boolean;
  isReplyOpen: boolean;
  replyValue: string;
  isSubmittingReply: boolean;
  onToggleReply: () => void;
  onReplyValueChange: (value: string) => void;
  onSubmitReply: () => void;
  editingCommentId: string | null;
  editValue: string;
  isUpdating: boolean;
  onStartEdit: (commentId: string, content: string) => void;
  onEditValueChange: (value: string) => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  onDeleteRequest: (commentId: string) => void;
}

export function CommentItem({
  comment,
  replies,
  currentUserEmail,
  canReply,
  isReplyOpen,
  replyValue,
  isSubmittingReply,
  onToggleReply,
  onReplyValueChange,
  onSubmitReply,
  editingCommentId,
  editValue,
  isUpdating,
  onStartEdit,
  onEditValueChange,
  onCancelEdit,
  onSubmitEdit,
  onDeleteRequest,
}: CommentItemProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <CommentRow
        comment={comment}
        isOwner={currentUserEmail !== null && comment.authorEmail === currentUserEmail}
        isEditing={editingCommentId === comment.id}
        editValue={editValue}
        isSubmittingEdit={isUpdating}
        onEditValueChange={onEditValueChange}
        onStartEdit={() => onStartEdit(comment.id, comment.content)}
        onCancelEdit={onCancelEdit}
        onSubmitEdit={onSubmitEdit}
        onDelete={() => onDeleteRequest(comment.id)}
        actions={
          canReply && (
            <button type="button" onClick={onToggleReply} className="text-primary hover:underline">
              답글
            </button>
          )
        }
      />

      {isReplyOpen && (
        <div className="pl-8.5 border-l-2 border-slate-100">
          <CommentForm
            value={replyValue}
            onChange={onReplyValueChange}
            onSubmit={onSubmitReply}
            onCancel={onToggleReply}
            placeholder="답글을 입력해 주세요"
            submitLabel="답글 등록"
            disabled={isSubmittingReply}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="space-y-3 pl-8.5 border-l-2 border-slate-100">
          {replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              isOwner={currentUserEmail !== null && reply.authorEmail === currentUserEmail}
              isEditing={editingCommentId === reply.id}
              editValue={editValue}
              isSubmittingEdit={isUpdating}
              onEditValueChange={onEditValueChange}
              onStartEdit={() => onStartEdit(reply.id, reply.content)}
              onCancelEdit={onCancelEdit}
              onSubmitEdit={onSubmitEdit}
              onDelete={() => onDeleteRequest(reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
