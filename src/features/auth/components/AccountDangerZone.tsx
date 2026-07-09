import { LogOut, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/shared/ui';

interface AccountDangerZoneProps {
  trackerCount: number;
  savedCount: number;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function AccountDangerZone({
  trackerCount,
  savedCount,
  onLogout,
  onDeleteAccount,
}: AccountDangerZoneProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="rounded-3xl border border-rose-100 bg-rose-50/20 p-5 text-left space-y-3.5">
      <h4 className="text-xs font-extrabold text-rose-800 flex items-center">
        <ShieldAlert className="h-4.5 w-4.5 text-rose-600 mr-1.5" />
        <span>계정 보안 및 위험 설정 구역</span>
      </h4>
      <p className="text-[11px] text-slate-400">
        수정하신 맞춤 프로필 정보는 즉시 휘발되며, 회원 탈퇴 시 모든 신청관리 대시보드가 파기됩니다.
      </p>
      <div className="flex space-x-2 pt-1.5">
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400" />
          <span>로그아웃</span>
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50"
        >
          회원 탈퇴 진행
        </button>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="정말로 회원 탈퇴를 진행합니까?"
        description={
          <>
            탈퇴 완료 시 Google 간편인증 연동이 해제되며, 그동안 기획관리 중이던{' '}
            <strong>
              {trackerCount}건의 신청 기한 타임라인 및 {savedCount}건의 관심 저장 목록
            </strong>
            이 즉각적으로 복구 불가능하게 안전 소멸 처리됩니다.
          </>
        }
        confirmLabel="확인, 탈퇴 승인"
        cancelLabel="이전으로 복귀"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDeleteAccount();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
