import { Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useMyProfile } from '@/features/my-profile';
import { ProfileBriefing, useRecommendations } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { Skeleton } from '@/shared/ui';
import { RecommendationFeed } from '@/widgets/recommendation-feed';

export function RecommendPage() {
  const { recommendations, isLoading, isError } = useRecommendations();
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
          {/* Degraded 안내: 최신 100건 대상 + 상세 자격조건(결혼·전공 등) 미연동 상태의 한계 고지 */}
          <p className="text-[11px] text-slate-400 mt-0.5">
            최신 정책 위주로 추천되며, 세부 자격조건 연동 전이라 일부 부적격 정책이 포함될 수
            있어요.
          </p>
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

      {isProfileLoading || !profile ? (
        <Skeleton className="h-28" />
      ) : (
        <ProfileBriefing
          profile={profile}
          recommendationCount={isLoading ? null : recommendations.length}
          isRecommendationsError={isError}
        />
      )}

      <RecommendationFeed />
    </div>
  );
}
