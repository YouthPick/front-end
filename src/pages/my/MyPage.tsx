import { useNavigate } from "react-router";

import { usePoliciesQuery, usePolicyDetailStore, type Policy } from "@/entities/policy";
import { ProfileSummaryCard, useAuthStore, useProfileStore } from "@/entities/user";
import { AccountDangerZone, useDeleteAccount, useLogout } from "@/features/auth";
import { SavedPolicyList, useBookmark } from "@/features/policy-bookmark";
import { useTrackers } from "@/features/policy-tracker";
import { ROUTES } from "@/shared/constants";
import { useToast } from "@/shared/ui";

export function MyPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const { savedPolicyIds, toggleSave } = useBookmark();
  const { data: trackers = [] } = useTrackers();
  const { data: policies = [] } = usePoliciesQuery();
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

      {/* Activity metrics dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => navigate(ROUTES.search)}
          className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
        >
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">관심 정책 저장</span>
          <span className="text-xl font-black text-slate-800 block mt-1">{savedPolicyIds.length}</span>
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
        savedCount={savedPolicyIds.length}
        onLogout={logout}
        onDeleteAccount={deleteAccount}
      />
    </div>
  );
}
