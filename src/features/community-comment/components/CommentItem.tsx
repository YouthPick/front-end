import type { CommunityComment } from '../types/communityComment.types';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: CommunityComment;
  replies: CommunityComment[];
  canReply: boolean;
  isReplyOpen: boolean;
  replyValue: string;
  isSubmitting: boolean;
  onToggleReply: () => void;
  onReplyValueChange: (value: string) => void;
  onSubmitReply: () => void;
}

export function CommentItem({
  comment,
  replies,
  canReply,
  isReplyOpen,
  replyValue,
  isSubmitting,
  onToggleReply,
  onReplyValueChange,
  onSubmitReply,
}: CommentItemProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <span className="text-slate-600">{comment.authorName}</span>
          <span className="text-slate-200">·</span>
          <span>{comment.createdAt}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-700">{comment.content}</p>
        {canReply && (
          <button
            type="button"
            onClick={onToggleReply}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            답글
          </button>
        )}
      </div>

      {isReplyOpen && (
        <div className="pl-4 border-l-2 border-slate-100">
          <CommentForm
            value={replyValue}
            onChange={onReplyValueChange}
            onSubmit={onSubmitReply}
            onCancel={onToggleReply}
            placeholder="답글을 입력해 주세요"
            submitLabel="답글 등록"
            disabled={isSubmitting}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="space-y-2.5 pl-4 border-l-2 border-slate-100">
          {replies.map((reply) => (
            <div key={reply.id} className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <span className="text-slate-600">{reply.authorName}</span>
                <span className="text-slate-200">·</span>
                <span>{reply.createdAt}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
