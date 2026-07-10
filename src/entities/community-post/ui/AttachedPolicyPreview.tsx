import { ExternalLink } from 'lucide-react';

import { getPolicyCategoryBadgeClasses } from '@/shared/utils';

import type { AttachedPolicySummary } from '../model/communityPost.types';

interface AttachedPolicyPreviewProps {
  policy: AttachedPolicySummary;
  onView: (policyId: string) => void;
}

export function AttachedPolicyPreview({ policy, onView }: AttachedPolicyPreviewProps) {
  return (
    <button
      type="button"
      onClick={() => onView(policy.id)}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 text-left transition-colors hover:bg-primary/[0.06]"
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
          >
            {policy.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400">첨부된 정책</span>
        </div>
        <p className="truncate text-xs font-bold text-slate-800">{policy.title}</p>
        <p className="text-[10px] font-bold text-slate-400">
          마감 <span className="text-primary font-extrabold">{policy.deadline}</span>
        </p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    </button>
  );
}
