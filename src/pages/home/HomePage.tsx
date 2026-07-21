import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  type PolicyCategory,
  usePolicyCardPageQuery,
  usePolicyDetailStore,
} from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { RecommendationPreview, useRecommendations } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { ErrorState, Pagination, Skeleton } from '@/shared/ui';
import { HeroBanner } from '@/widgets/hero-banner';
import {
  POLICY_GRID_CLASS,
  POLICY_GRID_SKELETON_COUNT,
  PolicyCardGrid,
} from '@/widgets/policy-card-grid';

import { CategoryQuickLinks } from './components/CategoryQuickLinks';
import { GuestRecommendCta } from './components/GuestRecommendCta';

// 로딩 스켈레톤 개수를 실제 표시 개수와 같은 값으로 맞춰 드리프트를 방지한다.
const HOME_POLICY_COUNT = POLICY_GRID_SKELETON_COUNT;

export function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const {
    profile,
    recommendations,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError,
    reload: reloadRecommendations,
  } = useRecommendations();
  const [page, setPage] = useState(1);
  const {
    data: policyPage,
    isLoading,
    isError: isPoliciesError,
    refetch: refetchPolicies,
  } = usePolicyCardPageQuery(page, HOME_POLICY_COUNT);
  const pageItems = policyPage?.policies ?? [];
  const pageCount = policyPage?.totalPages ?? 1;
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);
  const navigate = useNavigate();

  const handleSelectCategory = (category: PolicyCategory) => {
    navigate(`${ROUTES.search}?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <HeroBanner />

      <CategoryQuickLinks onSelectCategory={handleSelectCategory} />

      {isAuthenticated && user ? (
        isRecommendationsError ? (
          <ErrorState
            title="맞춤 추천을 불러오지 못했습니다"
            onRetry={() => reloadRecommendations()}
          />
        ) : isRecommendationsLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <RecommendationPreview
            userName={user.name}
            profile={profile}
            recommendations={recommendations}
            onEditProfile={() =>
              navigate(ROUTES.profileSetup, { state: { from: ROUTES.home, intent: 'edit' } })
            }
            onViewAll={() => navigate(ROUTES.recommend)}
            onViewDetails={(policy) => openPolicyDetail(policy.id)}
          />
        )
      ) : (
        <GuestRecommendCta
          onGetRecommendations={() => navigate(ROUTES.login, { state: { from: ROUTES.recommend } })}
          onBrowseAll={() => navigate(ROUTES.search)}
        />
      )}

      {/* 신규 정책 그리드 */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-extrabold text-slate-800">최근 화제인 신규 정책 소식</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              전국 및 서울 등 청년들이 가장 집중해서 조회하는 핵심 소식입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.search)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700"
          >
            전체보기
          </button>
        </div>

        {isPoliciesError ? (
          <ErrorState
            title="신규 정책 목록을 불러오지 못했습니다"
            onRetry={() => refetchPolicies()}
          />
        ) : isLoading ? (
          <div className={POLICY_GRID_CLASS}>
            {Array.from({ length: HOME_POLICY_COUNT }, (_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: 순서가 바뀌지 않는 정적 로딩 플레이스홀더라 안정적인 id가 없다
              <Skeleton key={index} className="h-56" />
            ))}
          </div>
        ) : (
          <>
            <PolicyCardGrid policies={pageItems} className={POLICY_GRID_CLASS} />
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
