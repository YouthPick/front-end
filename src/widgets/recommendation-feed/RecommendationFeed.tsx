import { useNavigate } from 'react-router';

import { type Policy, usePolicyDetailStore } from '@/entities/policy';
import { useBookmark } from '@/features/policy-bookmark';
import { useCompare } from '@/features/policy-compare';
import { RecommendationCard, useRecommendations } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { usePagination } from '@/shared/hooks';
import { Pagination, Skeleton } from '@/shared/ui';

// 추천 API는 매칭된 전체 목록(수십~수백 건)을 한 번에 내려준다. 앞 8건만 자르면 헤더의
// "통합 매칭 수"와 실제로 보이는 카드 수가 어긋나므로, 받은 목록 전체를 클라이언트 페이지네이션으로 노출한다.
const FEED_PAGE_SIZE = 8;

// 추천(recommendation) + 찜(bookmark) + 신청관리 이동을 조합하는 블록.
// feature 간 직접 의존 대신 widget에서 조립한다.
export function RecommendationFeed() {
  const { recommendations, isLoading, isError, reload } = useRecommendations();
  const { isSaved, toggleSave } = useBookmark();
  const { isComparing, toggleCompare } = useCompare();
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);
  const navigate = useNavigate();
  const { page, pageItems, pageCount, totalCount, setPage } = usePagination(
    recommendations,
    FEED_PAGE_SIZE,
  );

  const handleStartTracker = (policy: Policy) => {
    navigate(`${ROUTES.tracker}?start=${policy.id}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/30 py-16 px-4 text-center space-y-3">
        <h3 className="text-sm font-extrabold text-rose-700">추천 목록을 불러오지 못했습니다</h3>
        <p className="text-xs text-slate-500">
          추천 엔진 응답이 지연되고 있습니다. 최신 정책 목록은 [정책 찾기]에서 확인할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => reload()}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 px-4 text-center space-y-2">
        <h3 className="text-sm font-extrabold text-slate-700">아직 추천할 정책이 없습니다</h3>
        <p className="text-xs text-slate-400">
          프로필을 더 자세히 설정하면 맞춤 추천을 받을 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>총 {totalCount}건</span>
        <span>
          {page} / {pageCount} 페이지
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pageItems.map((recommendation) => (
          <RecommendationCard
            key={recommendation.policy.id}
            recommendation={recommendation}
            isSaved={isSaved(recommendation.policy.id)}
            onViewDetails={(policy) => openPolicyDetail(policy.id)}
            onToggleSave={toggleSave}
            onStartTracker={handleStartTracker}
            isComparing={isComparing(recommendation.policy.id)}
            onToggleCompare={toggleCompare}
          />
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
