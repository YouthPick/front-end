import type { Policy } from '@/entities/policy';

import { SavedPolicyItem } from './SavedPolicyItem';

interface SavedPolicyListProps {
  savedPolicies: Policy[];
  onToggleSave: (policyId: string) => void;
  onViewDetails: (policy: Policy) => void;
  onRestoreView: (policy: Policy) => void;
  onStartTracker: (policy: Policy) => void;
}

export function SavedPolicyList({
  savedPolicies,
  onToggleSave,
  onViewDetails,
  onRestoreView,
  onStartTracker,
}: SavedPolicyListProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
      <h4 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-3">
        보관중인 관심 정책 목록 ({savedPolicies.length}건)
      </h4>
      {savedPolicies.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">아직 보관한 관심 정책이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {savedPolicies.map((policy) => (
            <SavedPolicyItem
              key={policy.id}
              policy={policy}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
              onRestoreView={onRestoreView}
              onStartTracker={onStartTracker}
            />
          ))}
        </div>
      )}
    </div>
  );
}
