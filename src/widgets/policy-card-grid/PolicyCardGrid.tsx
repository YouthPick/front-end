import { type Policy, PolicyCard, usePolicyDetailStore } from '@/entities/policy';
import { useBookmark } from '@/features/policy-bookmark';
import { useCompare } from '@/features/policy-compare';

export const POLICY_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

interface PolicyCardGridProps {
  policies: Policy[];
  className?: string;
}

// 정책 카드에 찜(bookmark)·비교(compare)·상세 모달을 배선하는 조합 블록
export function PolicyCardGrid({ policies, className = POLICY_GRID_CLASS }: PolicyCardGridProps) {
  const { isSaved, toggleSave } = useBookmark();
  const { isComparing, toggleCompare } = useCompare();
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);

  return (
    <div className={className}>
      {policies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          isSaved={isSaved(policy.id)}
          onToggleSave={toggleSave}
          onViewDetails={(target) => openPolicyDetail(target.id)}
          isComparing={isComparing(policy.id)}
          onToggleCompare={toggleCompare}
        />
      ))}
    </div>
  );
}
