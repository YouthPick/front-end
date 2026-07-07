import { useNavigate } from "react-router";

import { usePoliciesQuery, usePolicyDetailStore, type Policy } from "@/entities/policy";
import { ProfileSummaryCard, useAuthStore, useProfileStore } from "@/entities/user";
import { AccountDangerZone, useDeleteAccount, useLogout } from "@/features/auth";
import { SavedPolicyList, useBookmark } from "@/features/policy-bookmark";
import { useTrackers } from "@/features/policy-tracker";
import { ROUTES } from "@/shared/constants";
import { ErrorState, Skeleton, useToast } from "@/shared/ui";

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const {
    savedPolicyIds,
    toggleSave,
    isLoading: isBookmarkLoading,
    isError: isBookmarkError,
    refetch: refetchBookmark,
  } = useBookmark();
  const {
    data: trackers = [],
    isLoading: isTrackersLoading,
    isError: isTrackersError,
    refetch: refetchTrackers,
  } = useTrackers();
  const {
    data: policies = [],
    isLoading: isPoliciesLoading,
    isError: isPoliciesError,
    refetch: refetchPolicies,
  } = usePoliciesQuery();
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);
  const { logout } = useLogout();
  const { deleteAccount } = useDeleteAccount();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userName = user?.name ?? "";
  const savedPolicies = savedPolicyIds
    .map((id) => policies.find((policy) => policy.id === id))
    .filter((policy): policy is Policy => policy !== undefined);

  const preparingCount = trackers.filter((tracker) => tracker.status === "준비중").length;
  const waitingCount = trackers.filter((tracker) => tracker.status === "결과대기").length;

  // 저장 카운트·목록은 bookmark+policies 조인, 준비/대기 지표는 trackers에 의존한다.
  // 쿼리 딜레이가 달라 일부만 도착하면 카운트와 목록이 어긋나므로 함께 게이트한다.
  const isDashboardLoading = isBookmarkLoading || isTrackersLoading || isPoliciesLoading;
  const isDashboardError = isBookmarkError || isTrackersError || isPoliciesError;

  const retryDashboard = () => {
    if (isBookmarkError) refetchBookmark();
    if (isTrackersError) refetchTrackers();
    if (isPoliciesError) refetchPolicies();
  };

  const handleStartTracker = (policy: Policy) => {
    navigate(`${ROUTES.tracker}?start=${policy.id}`);
  };

  const handleRestoreView = (policy: Policy) => {
    openPolicyDetail(policy.id);
    showToast("만료전 백업된 최종 저장 정보를 대조합니다.", "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">나의 맞춤 센터</span>
        <h2 className="text-lg font-black text-slate-800">마이페이지</h2>
      </div>

      {/* Account card */}
      <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left flex items-center space-x-4 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-lg font-black text-white">
          {userName[0]}
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-sm font-extrabold text-slate-800">{userName}님</h3>
          <p className="text-[11px] text-slate-400 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            <span>Google 계정 연동 간편 로그인 사용 중</span>
          </p>
        </div>
      </div>

      {isDashboardError ? (
        <ErrorState title="내 활동 정보를 불러오지 못했습니다" onRetry={retryDashboard} />
      ) : isDashboardLoading ? (
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
              onClick={() => navigate(ROUTES.search)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">관심 정책 저장</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{savedPolicies.length}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.tracker)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">신청 준비중</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{preparingCount}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.tracker)}
              className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
            >
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">결과 대기목록</span>
              <span className="text-xl font-black text-slate-800 block mt-1">{waitingCount}</span>
            </button>
          </div>

          <ProfileSummaryCard profile={profile} onEdit={() => navigate(ROUTES.profileSetup)} />

          <SavedPolicyList
            savedPolicies={savedPolicies}
            onToggleSave={toggleSave}
            onViewDetails={(policy) => openPolicyDetail(policy.id)}
            onRestoreView={handleRestoreView}
            onStartTracker={handleStartTracker}
          />

          <AccountDangerZone
            trackerCount={trackers.length}
            savedCount={savedPolicies.length}
            onLogout={logout}
            onDeleteAccount={deleteAccount}
          />
        </>
      )}
    </div>
  );
}
