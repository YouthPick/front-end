import { useNavigate } from 'react-router';

import { type PolicyCategory, usePoliciesQuery, usePolicyDetailStore } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { CompareDockContainer } from '@/features/policy-compare';
import { RecommendationPreview, useRecommendations } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';
import { HeroBanner } from '@/widgets/hero-banner';
import { PolicyCardGrid } from '@/widgets/policy-card-grid';

import { CategoryQuickLinks } from './components/CategoryQuickLinks';
import { GuestRecommendCta } from './components/GuestRecommendCta';

const HOME_POLICY_COUNT = 6;
const POLICY_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';

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
  const { data: policies = [], isLoading } = usePoliciesQuery();
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
            onEditProfile={() => navigate(ROUTES.profileSetup)}
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

        {isLoading ? (
          <div className={POLICY_GRID_CLASS}>
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
        ) : (
          <PolicyCardGrid
            policies={policies.slice(0, HOME_POLICY_COUNT)}
            className={POLICY_GRID_CLASS}
          />
        )}
      </section>

      {/* 정책 비교 독 (우측 슬라이드-인, 담긴 정책이 있을 때만 노출) */}
      <CompareDockContainer />
    </div>
  );
}
