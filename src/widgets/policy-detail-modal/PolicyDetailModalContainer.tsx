import { AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

import { usePoliciesQuery, usePolicyDetailStore, type Policy } from "@/entities/policy";
import { useAuthStore } from "@/entities/user";
import { useBookmark } from "@/features/policy-bookmark";
import { ROUTES } from "@/shared/constants";

import { PolicyDetailModalPresenter } from "./PolicyDetailModalPresenter";

// 원본 화면의 데모용 고정 점수 매핑을 유지한다.
const DEMO_SCORE_BY_POLICY_ID: Record<string, number> = {
  p1: 94,
  p2: 88,
  p3: 82,
};
const DEFAULT_DEMO_SCORE = 78;

export function PolicyDetailModalContainer() {
  const selectedPolicyId = usePolicyDetailStore((state) => state.selectedPolicyId);
  const closePolicyDetail = usePolicyDetailStore((state) => state.closePolicyDetail);
  const { data: policies = [] } = usePoliciesQuery();
  const { isSaved, toggleSave } = useBookmark();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const selectedPolicy = selectedPolicyId
    ? policies.find((policy) => policy.id === selectedPolicyId) ?? null
    : null;

  const handleStartTracker = (policy: Policy) => {
    closePolicyDetail();
    navigate(`${ROUTES.tracker}?start=${policy.id}`);
  };

  return (
    <AnimatePresence>
      {selectedPolicy && (
        <PolicyDetailModalPresenter
          policy={selectedPolicy}
          isSaved={isSaved(selectedPolicy.id)}
          isRecommendation={isAuthenticated}
          recommendationScore={DEMO_SCORE_BY_POLICY_ID[selectedPolicy.id] ?? DEFAULT_DEMO_SCORE}
          onToggleSave={toggleSave}
          onStartTracker={handleStartTracker}
          onClose={closePolicyDetail}
        />
      )}
    </AnimatePresence>
  );
}
