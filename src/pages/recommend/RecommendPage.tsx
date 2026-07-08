import { Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useProfileStore } from '@/entities/user';
import { CompareDockContainer } from '@/features/policy-compare';
import { ProfileBriefing } from '@/features/policy-recommendation';
import { ROUTES } from '@/shared/constants';
import { RecommendationFeed } from '@/widgets/recommendation-feed';

export function RecommendPage() {
  const profile = useProfileStore((state) => state.profile);
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
            회원님의 맞춤 프로필 가중치를 기반으로 상위 일치하는 자격을 자동 순위화했습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.profileSetup)}
          className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>프로필 및 키워드 다시 작성</span>
        </button>
      </div>

      <ProfileBriefing profile={profile} />

      <RecommendationFeed />

      {/* 정책 비교 독 (우측 슬라이드-인, 담긴 정책이 있을 때만 노출) */}
      <CompareDockContainer />
    </div>
  );
}
