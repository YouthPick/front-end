import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  type PolicyCategory,
  usePolicyCardPageQuery,
  usePolicyDetailStore,
} from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { useMyProfile } from '@/features/my-profile';
import { useRecommendations } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { useSeo } from '@/shared/hooks';
import { ErrorState, Pagination, Skeleton } from '@/shared/ui';
import { HeroBanner } from '@/widgets/hero-banner';
import {
  POLICY_GRID_CLASS,
  POLICY_GRID_SKELETON_COUNT,
  PolicyCardGrid,
} from '@/widgets/policy-card-grid';

import { CategoryQuickLinks } from './components/CategoryQuickLinks';
import { HomeRecommendSection } from './components/HomeRecommendSection';

// 로딩 스켈레톤 개수를 실제 표시 개수와 같은 값으로 맞춰 드리프트를 방지한다.
const HOME_POLICY_COUNT = POLICY_GRID_SKELETON_COUNT;

export function HomePage() {
  useSeo({
    title: '나에게 맞는 청년정책 추천',
    description:
      '나에게 맞는 청년정책을 쉽고 빠르게 찾아주는 청년정책 맞춤형 서비스. 정책 검색, 맞춤 추천, 신청 관리, 청년 커뮤니티를 한곳에서 만나보세요.',
  });
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const {
    recommendations,
    isFallback: isRecommendationsFallback,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError,
    reload: reloadRecommendations,
  } = useRecommendations({ enabled: isAuthenticated });
  // 프로필은 서버가 원본이다 — store 값은 새로고침 후 빈 값이라 여기서 쓰면 안 된다.
  const { profile, isLoading: isProfileLoading } = useMyProfile({ enabled: isAuthenticated });
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

  // 비로그인은 로그인부터, 로그인했지만 온보딩 미완료면 프로필 설정 마법사로 보낸다.
  const handleStartRecommend = () => {
    if (isAuthenticated) {
      navigate(ROUTES.profileSetup, { state: { from: ROUTES.home } });
      return;
    }

    navigate(ROUTES.login, { state: { from: ROUTES.recommend } });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <HeroBanner />
      <CategoryQuickLinks onSelectCategory={handleSelectCategory} />
      <HomeRecommendSection
        isAuthenticated={isAuthenticated}
        userName={user?.name ?? null}
        profile={profile}
        recommendations={recommendations}
        isFallback={isRecommendationsFallback}
        isLoading={isRecommendationsLoading || isProfileLoading}
        isError={isRecommendationsError}
        onRetry={() => reloadRecommendations()}
        onStartRecommend={handleStartRecommend}
        onEditProfile={() =>
          navigate(ROUTES.profileSetup, { state: { from: ROUTES.home, intent: 'edit' } })
        }
        onBrowseAll={() => navigate(ROUTES.search)}
        onViewAll={() => navigate(ROUTES.recommend)}
        onViewDetails={(policy) => openPolicyDetail(policy.id)}
      />

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
