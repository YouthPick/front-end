import { X } from 'lucide-react';
import { useState } from 'react';

import type { AdminUser, AdminUserProfile, UserRole } from '@/entities/user';
import { ConfirmDialog, EmptyState, Skeleton } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

interface AdminUserDetailModalProps {
  user: AdminUser | null;
  profile: AdminUserProfile | null | undefined;
  isProfileLoading: boolean;
  onClose: () => void;
  onChangeRole: (role: UserRole) => void;
  isRoleChanging: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="mt-0.5 text-xs text-slate-700 break-all">{value}</p>
    </div>
  );
}

export function AdminUserDetailModal({
  user,
  profile,
  isProfileLoading,
  onClose,
  onChangeRole,
  isRoleChanging,
  onDelete,
  isDeleting,
}: AdminUserDetailModalProps) {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const isDeleted = user.deletedAt !== null;
  const nextRole: UserRole = user.role === 'admin' ? 'member' : 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="사용자 상세"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">사용자 상세</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailRow label="사용자 ID" value={user.id} />
          <DetailRow label="가입경로" value={user.provider} />
          <DetailRow label="역할" value={user.role === 'admin' ? '관리자' : '일반 회원'} />
          <DetailRow label="계정 상태" value={isDeleted ? '탈퇴' : '활성'} />
          <DetailRow label="가입일" value={formatDateTime(user.createdAt)} />
          {isDeleted && user.deletedAt && (
            <DetailRow label="탈퇴일" value={formatDateTime(user.deletedAt)} />
          )}
        </div>

        <div className="border-t border-slate-100 pt-3">
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            온보딩 프로필
          </span>

          {isProfileLoading && (
            <div className="space-y-2">
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
          )}

          {!isProfileLoading && !profile && (
            <EmptyState title="아직 온보딩 프로필을 작성하지 않은 사용자입니다." />
          )}

          {!isProfileLoading && profile && (
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="출생연도" value={`${profile.birthYear}년`} />
              <DetailRow label="거주지" value={profile.regionLabel} />
              <DetailRow label="취업상태" value={profile.employmentStatus} />
              <DetailRow label="학력" value={profile.educationLevel} />
              <DetailRow label="혼인상태" value={profile.marriageStatus} />
              <DetailRow label="전공" value={profile.major} />
              <DetailRow label="특화조건" value={profile.specializedCondition} />
              <DetailRow
                label="연소득"
                value={profile.annualIncome === null ? '미입력' : `${profile.annualIncome}만원`}
              />
              <DetailRow label="관심 카테고리" value={profile.categories.join(', ')} />
              <DetailRow label="키워드" value={profile.keywords.join(', ')} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setPendingRole(nextRole)}
            disabled={isRoleChanging || isDeleted}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {user.role === 'admin' ? '일반 회원으로 변경' : '관리자로 변경'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting || isDeleted}
            className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleted ? '탈퇴 처리됨' : '탈퇴 처리'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingRole !== null}
        title="사용자 역할을 변경합니까?"
        description={
          <>
            <strong>{user.id}</strong> 사용자의 역할을{' '}
            <strong>{pendingRole === 'admin' ? '관리자' : '일반 회원'}</strong>(으)로 변경합니다.
          </>
        }
        confirmLabel="변경 확인"
        cancelLabel="취소"
        onConfirm={() => {
          if (pendingRole) onChangeRole(pendingRole);
          setPendingRole(null);
        }}
        onCancel={() => setPendingRole(null)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="정말로 탈퇴 처리하시겠습니까?"
        description={
          <>
            <strong>{user.id}</strong> 사용자를 탈퇴(soft delete) 처리합니다. 이 작업은 목록에서
            즉시 반영되며 되돌리려면 별도 복구 절차가 필요합니다.
          </>
        }
        confirmLabel="확인, 탈퇴 처리"
        cancelLabel="취소"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
