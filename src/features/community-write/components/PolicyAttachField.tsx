import { Paperclip, X } from 'lucide-react';
import { useState } from 'react';

import { type Policy, PolicyCategoryBadge } from '@/entities/policy';

import { PolicyAttachModal } from './PolicyAttachModal';

interface PolicyAttachFieldProps {
  attachedPolicy: Policy | null;
  onAttach: (policy: Policy) => void;
  onRemove: () => void;
}

export function PolicyAttachField({ attachedPolicy, onAttach, onRemove }: PolicyAttachFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold text-slate-600">정책 첨부</span>

      {attachedPolicy ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-3.5">
          <div className="min-w-0 space-y-1">
            <PolicyCategoryBadge category={attachedPolicy.category} />
            <p className="truncate text-xs font-bold text-slate-800">{attachedPolicy.title}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="첨부한 정책 제거"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-200 bg-white py-3 text-xs font-bold text-slate-500 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Paperclip className="h-3.5 w-3.5" />
          정책 첨부하기
        </button>
      )}

      {isModalOpen && (
        <PolicyAttachModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(policy) => {
            onAttach(policy);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
