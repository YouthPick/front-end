import type { UserProfile } from '@/entities/user';
import { Skeleton } from '@/shared/ui';

interface ProfileBriefingProps {
  profile: UserProfile;
  // 집계 전(로딩)에는 null. 실패 시엔 isRecommendationsError로 구분한다.
  recommendationCount: number | null;
  isRecommendationsError: boolean;
}

export function ProfileBriefing({
  profile,
  recommendationCount,
  isRecommendationsError,
}: ProfileBriefingProps) {
  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-8 space-y-1.5">
        <span className="text-[10px] font-extrabold text-slate-400">현재 대조 프로필 조건</span>
        <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
          {profile.region} {profile.subRegion} · {profile.birthYear}년생 ·{' '}
          {profile.employmentStatus} · {profile.educationStatus}
        </p>
        <div className="flex flex-wrap gap-1">
          {profile.interests.length === 0 && profile.keywords.length === 0 ? (
            <span className="text-[9px] text-slate-400 font-bold">
              관심 분야 미설정 · 프로필을 설정하면 더 정확한 추천을 받을 수 있어요
            </span>
          ) : (
            <>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-[9px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md font-bold"
                >
                  #{interest}
                </span>
              ))}
              {profile.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold"
                >
                  #{keyword}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-1">
        <span className="text-[10px] font-extrabold text-slate-400 block">통합 매칭 수</span>
        {isRecommendationsError ? (
          <span className="text-xs font-bold text-rose-500">매칭 수 집계 실패</span>
        ) : recommendationCount === null ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <span className="text-lg font-black text-slate-800">총 {recommendationCount}건 추천</span>
        )}
      </div>
    </div>
  );
}
