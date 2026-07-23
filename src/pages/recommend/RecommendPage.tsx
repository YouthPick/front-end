import { Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useMyProfile } from '@/features/my-profile';
import {
  ProfileBriefing,
  RecommendationNotice,
  useRecommendations,
} from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { EmptyState, Skeleton } from '@/shared/ui';
import { RecommendationFeed } from '@/widgets/recommendation-feed';

export function RecommendPage() {
  const { recommendations, isFallback, isLoading, isError } = useRecommendations();
  // 프로필은 서버가 원본이다 — store 값은 새로고침 후 빈 값이라 여기서 쓰면 안 된다.
  const { profile, isLoading: isProfileLoading } = useMyProfile();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
        <div>
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
            AI 종합 분석 스마트 팩트 매칭
          </span>
          <h2 className="text-lg font-black text-slate-800">나만을 위한 1:1 맞춤 청년정책 추천</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            회원님의 맞춤 프로필 정보를 기반으로 상위 일치하는 자격을 자동 순위화했습니다.
          </p>
          <RecommendationNotice isFallback={isFallback} className="text-[11px] mt-0.5" />
        </div>
        <button
          type="button"
          onClick={() =>
            navigate(ROUTES.profileSetup, { state: { from: ROUTES.recommend, intent: 'edit' } })
          }
          className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>프로필 및 키워드 다시 작성</span>
        </button>
      </div>

      {isProfileLoading ? (
        <Skeleton className="h-28" />
      ) : profile ? (
        <ProfileBriefing
          profile={profile}
          recommendationCount={isLoading ? null : recommendations.length}
          isRecommendationsError={isError}
        />
      ) : (
        // RequireOnboarded는 persist된 로컬 isOnboarded 플래그만 보므로, 서버 프로필이 비어 있는데도
        // 이 페이지에 도달할 수 있다. 스켈레톤에 고정되지 않도록 Empty + 설정 CTA를 띄운다.
        <EmptyState
          icon="📝"
          title="맞춤 프로필이 아직 없습니다"
          description="프로필을 설정하면 조건에 맞는 정책을 순위로 추천해 드려요."
        >
          <button
            type="button"
            onClick={() => navigate(ROUTES.profileSetup, { state: { from: ROUTES.recommend } })}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
          >
            프로필 설정하기
          </button>
        </EmptyState>
      )}

      <RecommendationFeed />
    </div>
  );
}
