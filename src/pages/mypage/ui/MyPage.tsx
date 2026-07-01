import { AlertTriangle, LogOut, ShieldAlert } from "lucide-react";
import type { Policy } from "@entities/policy";
import type { UserProfile } from "@entities/user";
import type { TrackerItem } from "@entities/tracker";

interface MyPageProps {
  userName: string;
  accountProviderLabel: string;
  userProfile: UserProfile;
  savedPolicyIds: string[];
  savedPolicies: Policy[];
  trackers: TrackerItem[];
  isFavoriteLoading: boolean;
  isFavoriteFallback: boolean;
  favoriteErrorMessage: string | null;
  isReadStateFallback: boolean;
  readStateErrorMessage: string | null;
  showDeleteAccountConfirm: boolean;
  onGoSearchWithResetFilters: () => void;
  onGoTracker: () => void;
  onEditProfile: () => void;
  onToggleSave: (policyId: string) => void;
  onViewPolicyDetails: (policy: Policy) => void;
  onViewMissingPolicyBackup: (policy: Policy) => void;
  onStartTracker: (policy: Policy) => void;
  onLogout: () => void;
  onRequestDeleteAccount: () => void;
  onCancelDeleteAccount: () => void;
  onConfirmDeleteAccount: () => void;
}

export function MyPage({
  userName,
  accountProviderLabel,
  userProfile,
  savedPolicyIds,
  savedPolicies,
  trackers,
  isFavoriteLoading,
  isFavoriteFallback,
  favoriteErrorMessage,
  isReadStateFallback,
  readStateErrorMessage,
  showDeleteAccountConfirm,
  onGoSearchWithResetFilters,
  onGoTracker,
  onEditProfile,
  onToggleSave,
  onViewPolicyDetails,
  onViewMissingPolicyBackup,
  onStartTracker,
  onLogout,
  onRequestDeleteAccount,
  onCancelDeleteAccount,
  onConfirmDeleteAccount,
}: MyPageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
          나의 맞춤 센터
        </span>
        <h2 className="text-lg font-black text-slate-800">마이페이지</h2>
      </div>

      {/* Account Card */}
      <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left flex items-center space-x-4 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-lg font-black text-white">
          {userName[0]}
        </div>
        <div className="space-y-1 flex-1">
          <h3 className="text-sm font-extrabold text-slate-800">{userName}님</h3>
          <p className="text-[11px] text-slate-400 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
            <span>{accountProviderLabel} 계정 연동 간편 로그인 사용 중</span>
          </p>
        </div>
      </div>

      {/* Activity Metrics Dashboard */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onGoSearchWithResetFilters}
          className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
        >
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            관심 정책 저장
          </span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {savedPolicyIds.length}
          </span>
        </button>

        <button
          onClick={() => onGoTracker()}
          className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
        >
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            신청 준비중
          </span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {trackers.filter((t) => t.status === "준비중").length}
          </span>
        </button>

        <button
          onClick={() => onGoTracker()}
          className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
        >
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            결과 대기목록
          </span>
          <span className="text-xl font-black text-slate-800 block mt-1">
            {trackers.filter((t) => t.status === "결과대기").length}
          </span>
        </button>
      </div>

      {/* Profile Brief (My Page Section 11 requirement) */}
      <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-xs font-extrabold text-slate-800">개인 맞춤 조건 가중치 프로필</h4>
          <button
            onClick={onEditProfile}
            className="text-xs text-primary font-bold hover:underline"
          >
            수정
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="grid grid-cols-4 gap-2">
            <span className="text-slate-400 font-bold">기본 거주지</span>
            <span className="col-span-3 font-extrabold text-slate-800">
              {userProfile.region} {userProfile.subRegion}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <span className="text-slate-400 font-bold">출생연도</span>
            <span className="col-span-3 font-extrabold text-slate-800">
              {userProfile.birthYear}년생
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <span className="text-slate-400 font-bold">현재 취업상태</span>
            <span className="col-span-3 font-extrabold text-slate-800">
              {userProfile.employmentStatus}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <span className="text-slate-400 font-bold">최종 학력수준</span>
            <span className="col-span-3 font-extrabold text-slate-800">
              {userProfile.educationStatus}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <span className="text-slate-400 font-bold">관심 분야 목록</span>
            <span className="col-span-3 flex flex-wrap gap-1 font-bold text-slate-700">
              {userProfile.interests.map((it) => (
                <span key={it} className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                  {it}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Saved Policies List inside Saved Tab (FAVORITE-01 - includes [원본 누락] model variant) */}
      <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
        <h4 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          보관중인 관심 정책 목록 ({savedPolicies.length}건)
        </h4>
        <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
          {isFavoriteLoading && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
              관심 API 동기화 중
            </span>
          )}
          {favoriteErrorMessage && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
              서버 관심 정책 로드 실패 · {favoriteErrorMessage}
            </span>
          )}
          {readStateErrorMessage && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">
              읽음 상태 서버 동기화 실패 · {readStateErrorMessage}
            </span>
          )}
        </div>
        <div className="space-y-3">
          {savedPolicies.map((policyRef) => {
            return (
              <div
                key={policyRef.id}
                className={`rounded-2xl border p-4.5 space-y-3 transition-all ${
                  policyRef.isSourceMissing
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-slate-100 bg-slate-50/30 hover:border-slate-200"
                }`}
              >
                {/* Title row */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      {policyRef.isSourceMissing ? (
                        <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                          원본 누락
                        </span>
                      ) : (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">
                          {policyRef.category}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-bold">
                        {policyRef.region}
                      </span>
                    </div>
                    <h5 className="text-xs font-extrabold text-slate-800">{policyRef.title}</h5>
                  </div>
                  <button
                    onClick={() => void onToggleSave(policyRef.id)}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    관심 해제
                  </button>
                </div>

                {/* Warning text for Source Missing policy (FAVORITE-01 Requirement) */}
                {policyRef.isSourceMissing ? (
                  <div className="space-y-1">
                    <p className="text-[11px] text-amber-700 leading-relaxed font-bold">
                      ⚠️ 현재 해당 사업의 공공데이터 공식 원본 공고를 조회할 수 없습니다.
                    </p>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      기존에 작성해두셨던 체크리스트, 진행 단계 일정 및 개인 소명 기록 메모 등은 이
                      계정에 그대로 안전하게 계속 보호 유지됩니다.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {policyRef.description}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100/60 text-xs font-bold">
                  {policyRef.isSourceMissing ? (
                    <button
                      onClick={() => onViewMissingPolicyBackup(policyRef)}
                      className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
                    >
                      과거 저장 정보 복원보기
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => void onViewPolicyDetails(policyRef)}
                        className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
                      >
                        공고 내용 복사조회
                      </button>
                      <button
                        onClick={() => onStartTracker(policyRef)}
                        className="rounded-lg bg-primary text-white px-3.5 py-1.5 text-[10px] hover:brightness-105"
                      >
                        일정 스케줄러 등록
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger actions */}
      <div className="rounded-3xl border border-rose-100 bg-rose-50/20 p-5 text-left space-y-3.5">
        <h4 className="text-xs font-extrabold text-rose-800 flex items-center">
          <ShieldAlert className="h-4.5 w-4.5 text-rose-600 mr-1.5" />
          <span>계정 보안 및 위험 설정 구역</span>
        </h4>
        <p className="text-[11px] text-slate-400">
          수정하신 프로필 데이터 가중치는 즉시 휘발되며, 회원 탈퇴 시 모든 신청관리 대시보드가
          파기됩니다.
        </p>
        <div className="flex space-x-2 pt-1.5">
          <button
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
            <span>로그아웃</span>
          </button>
          <button
            onClick={() => onRequestDeleteAccount()}
            className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50"
          >
            회원 탈퇴 진행
          </button>
        </div>
      </div>

      {/* Delete Account Modal confirmation overlay */}
      {showDeleteAccountConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl text-left space-y-4">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-black">정말로 회원 탈퇴를 진행합니까?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              탈퇴 완료 시 Google 간편인증 연동이 해제되며, 그동안 기획관리 중이던 **
              {trackers.length}건의 신청 기한 타임라인 및 {savedPolicyIds.length}건의 관심 저장
              목록**이 즉각적으로 복구 불가능하게 안전 소멸 처리됩니다.
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onCancelDeleteAccount()}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600"
              >
                이전으로 복귀
              </button>
              <button
                onClick={onConfirmDeleteAccount}
                className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700"
              >
                확인, 탈퇴 승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
