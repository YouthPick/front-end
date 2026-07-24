import { AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

import { type Policy, usePolicyDetailQuery, usePolicyDetailStore } from '@/entities/policy';
import { useBookmark } from '@/features/policy-bookmark';
import { ROUTES } from '@/shared/constants';

import { PolicyDetailModalPresenter } from './PolicyDetailModalPresenter';
import { PolicyDetailModalError, PolicyDetailModalLoading } from './PolicyDetailModalStatus';

export function PolicyDetailModalContainer() {
  const selectedPolicyId = usePolicyDetailStore((state) => state.selectedPolicyId);
  const closePolicyDetail = usePolicyDetailStore((state) => state.closePolicyDetail);
  const { data: policy, isLoading, isError, refetch } = usePolicyDetailQuery(selectedPolicyId);
  const { isSaved, toggleSave } = useBookmark();
  const navigate = useNavigate();

  const handleStartTracker = (target: Policy) => {
    closePolicyDetail();
    navigate(`${ROUTES.tracker}?start=${target.id}`);
  };

  return (
    <AnimatePresence>
      {selectedPolicyId &&
        (isLoading ? (
          <PolicyDetailModalLoading onClose={closePolicyDetail} />
        ) : isError || !policy ? (
          <PolicyDetailModalError onRetry={() => refetch()} onClose={closePolicyDetail} />
        ) : (
          <PolicyDetailModalPresenter
            policy={policy}
            isSaved={isSaved(policy.id)}
            onToggleSave={toggleSave}
            onStartTracker={handleStartTracker}
            onClose={closePolicyDetail}
          />
        ))}
    </AnimatePresence>
  );
}
