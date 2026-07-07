import { useNavigate } from "react-router";

import { usePoliciesQuery, usePolicyDetailStore, type PolicyCategory } from "@/entities/policy";
import { useAuthStore } from "@/entities/user";
import { RecommendationPreview, useRecommendations } from "@/features/policy-recommendation";
import { ChatbotContainer } from "@/features/chatbot";
import { ROUTES } from "@/shared/constants";
import { ErrorState, Skeleton } from "@/shared/ui";
import { HeroBanner } from "@/widgets/hero-banner";
import { PolicyCardGrid } from "@/widgets/policy-card-grid";
import { RecentlyViewed } from "@/widgets/recently-viewed";

import { CategoryQuickLinks } from "./components/CategoryQuickLinks";
import { GuestRecommendCta } from "./components/GuestRecommendCta";

const HOME_POLICY_COUNT = 4;

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
          <ErrorState title="맞춤 추천을 불러오지 못했습니다" onRetry={() => reloadRecommendations()} />
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
          onGetRecommendations={() =>
            navigate(ROUTES.login, { state: { from: ROUTES.recommend } })
          }
          onBrowseAll={() => navigate(ROUTES.search)}
        />
      )}

      {/* Recent & grid policies split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-6">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
            </div>
          ) : (
            <PolicyCardGrid policies={policies.slice(0, HOME_POLICY_COUNT)} />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <RecentlyViewed />
          <ChatbotContainer />
        </div>
      </div>
    </div>
  );
}
