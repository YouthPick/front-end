import { useNavigate } from 'react-router';

import { ProfileSummaryCard, useAuthStore, useProfileStore } from '@/entities/user';
import { AccountDangerZone, useDeleteAccount, useLogout } from '@/features/auth';
import { useTrackers } from '@/features/policy-tracker';
import { ROUTES } from '@/shared/constants';
import { ErrorState, Skeleton } from '@/shared/ui';
import { LikedCommunityPosts } from '@/widgets/liked-community-posts';
import { RecentlyViewed } from '@/widgets/recently-viewed';

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const {
    data: trackers = [],
    isLoading: isTrackersLoading,
    isError: isTrackersError,
    refetch: refetchTrackers,
  } = useTrackers();
  const { logout } = useLogout();
  const { deleteAccount } = useDeleteAccount();
  const navigate = useNavigate();

  const userName = user?.name ?? '';

  // 즐겨찾기(관심)는 신청관리의 "관심" 탭으로 통합됐다. 활동 지표도 tracker status 기준으로 집계한다.
  const interestCount = trackers.filter((tracker) => tracker.status === '관심').length;
  const preparingCount = trackers.filter((tracker) => tracker.status === '준비중').length;
  const completedCount = trackers.filter((tracker) => tracker.status === '신청완료').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
          나의 맞춤 센터
        </span>
        <h2 className="text-lg font-black text-slate-800">마이페이지</h2>
      </div>

      {/* 닉네임·이메일은 소셜 로그인에서 받아온 값으로, 여기서 수정할 수 없다. */}
      <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-lg font-black text-white">
            {userName[0]}
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-800">{userName}님</h3>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            <p className="text-[11px] text-slate-400 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
              <span>{user?.provider} 계정 연동 간편 로그인 사용 중</span>
            </p>
          </div>
        </div>
      </div>

      {isTrackersError ? (
        <ErrorState title="내 활동 정보를 불러오지 못했습니다" onRetry={() => refetchTrackers()} />
      ) : isTrackersLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <>
          {/* Activity metrics dashboard */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => navigate(`${ROUTES.tracker}?tab=${encodeURIComponent('관심')}`)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                관심 정책
              </span>
              <span className="text-xl font-black text-slate-800 block mt-1">{interestCount}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`${ROUTES.tracker}?tab=${encodeURIComponent('준비중')}`)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                신청 준비중
              </span>
              <span className="text-xl font-black text-slate-800 block mt-1">{preparingCount}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`${ROUTES.tracker}?tab=${encodeURIComponent('신청완료')}`)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                신청완료
              </span>
              <span className="text-xl font-black text-slate-800 block mt-1">{completedCount}</span>
            </button>
          </div>

          <ProfileSummaryCard profile={profile} onEdit={() => navigate(ROUTES.profileSetup)} />

          <RecentlyViewed />

          <LikedCommunityPosts />

          <AccountDangerZone
            trackerCount={trackers.length}
            savedCount={interestCount}
            onLogout={logout}
            onDeleteAccount={deleteAccount}
          />
        </>
      )}
    </div>
  );
}
