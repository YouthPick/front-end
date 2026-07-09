import type { ReactNode } from 'react';

import type { CommunityComment } from '../types/communityComment.types';
import { CommentForm } from './CommentForm';

interface CommentRowProps {
  comment: CommunityComment;
  isOwner: boolean;
  isEditing: boolean;
  editValue: string;
  isSubmittingEdit: boolean;
  onEditValueChange: (value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  onDelete: () => void;
  actions?: ReactNode;
}

export function CommentRow({
  comment,
  isOwner,
  isEditing,
  editValue,
  isSubmittingEdit,
  onEditValueChange,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  actions,
}: CommentRowProps) {
  return (
    <div className="flex gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-[10px] font-black text-white"
      >
        {comment.authorName[0]}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-600">{comment.authorName}</span>
            <span className="text-slate-200">·</span>
            <span className="text-[10px] font-bold text-slate-400">{comment.createdAt}</span>
          </div>

          {!isEditing && (
            <div className="flex shrink-0 items-center gap-2.5 text-[11px] font-bold">
              {actions}
              {isOwner && (
                <>
                  <button
                    type="button"
                    onClick={onStartEdit}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <CommentForm
            value={editValue}
            onChange={onEditValueChange}
            onSubmit={onSubmitEdit}
            onCancel={onCancelEdit}
            placeholder="댓글을 수정해 주세요"
            submitLabel="수정 완료"
            disabled={isSubmittingEdit}
          />
        ) : (
          <p className="text-xs leading-relaxed text-slate-700">{comment.content}</p>
        )}
      </div>
    </div>
  );
}
