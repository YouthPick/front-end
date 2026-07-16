import { AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

import { type Policy, usePolicyDetailQuery, usePolicyDetailStore } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { useBookmark } from '@/features/policy-bookmark';
import { ROUTES } from '@/shared/constants';

import { PolicyDetailModalPresenter } from './PolicyDetailModalPresenter';
import { PolicyDetailModalError, PolicyDetailModalLoading } from './PolicyDetailModalStatus';

// ponytail: 추천 유사도 점수는 아직 데모용 고정값. 추천 엔진 연동 시 실제 점수로 교체.
const DEMO_RECOMMENDATION_SCORE = 78;

export function PolicyDetailModalContainer() {
  const selectedPolicyId = usePolicyDetailStore((state) => state.selectedPolicyId);
  const closePolicyDetail = usePolicyDetailStore((state) => state.closePolicyDetail);
  const { data: policy, isLoading, isError, refetch } = usePolicyDetailQuery(selectedPolicyId);
  const { isSaved, toggleSave } = useBookmark();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
            isRecommendation={isAuthenticated}
            recommendationScore={DEMO_RECOMMENDATION_SCORE}
            onToggleSave={toggleSave}
            onStartTracker={handleStartTracker}
            onClose={closePolicyDetail}
          />
        ))}
    </AnimatePresence>
  );
}
