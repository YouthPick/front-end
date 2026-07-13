import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type {
  AdminPolicy,
  AdminPolicyUpdateInput,
  AdminPolicyVisibilityStatus,
} from '@/entities/policy';
import { POLICY_CATEGORIES } from '@/entities/policy';
import type { Region } from '@/entities/region';
import { ConfirmDialog } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

import { AdminPolicyRegionPicker } from './AdminPolicyRegionPicker';

interface AdminPolicyDetailModalProps {
  policy: AdminPolicy | null;
  regions: Region[];
  isRegionsLoading: boolean;
  onClose: () => void;
  onSave: (input: AdminPolicyUpdateInput) => void;
  isSaving: boolean;
  onToggleVisibility: (status: AdminPolicyVisibilityStatus) => void;
  isTogglingVisibility: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}

function buildDraftFromPolicy(policy: AdminPolicy): AdminPolicyUpdateInput {
  return {
    policyName: policy.policyName,
    organizationName: policy.organizationName,
    description: policy.description,
    largeCategory: policy.largeCategory,
    middleCategory: policy.middleCategory,
    applicationStartDate: policy.applicationStartDate,
    applicationEndDate: policy.applicationEndDate,
    applicationUrl: policy.applicationUrl,
    regionCodes: [...policy.regionCodes],
  };
}

export function AdminPolicyDetailModal({
  policy,
  regions,
  isRegionsLoading,
  onClose,
  onSave,
  isSaving,
  onToggleVisibility,
  isTogglingVisibility,
  onDelete,
  isDeleting,
}: AdminPolicyDetailModalProps) {
  const [draft, setDraft] = useState<AdminPolicyUpdateInput | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 다른 정책을 선택하거나 모달을 다시 열면 편집 중이던 draft를 최신 정책 값으로 되돌린다.
  useEffect(() => {
    setDraft(policy ? buildDraftFromPolicy(policy) : null);
  }, [policy]);

  if (!policy || !draft) return null;

  const isDeleted = policy.deletedAt !== null;

  function updateDraft<K extends keyof AdminPolicyUpdateInput>(
    key: K,
    value: AdminPolicyUpdateInput[K],
  ) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function toggleRegion(regionCode: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const isSelected = prev.regionCodes.includes(regionCode);
      return {
        ...prev,
        regionCodes: isSelected
          ? prev.regionCodes.filter((code) => code !== regionCode)
          : [...prev.regionCodes, regionCode],
      };
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="정책 상세"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">정책 상세</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              정책 번호
            </span>
            <p className="mt-0.5 text-slate-700">{policy.policyNo}</p>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              조회수
            </span>
            <p className="mt-0.5 text-slate-700">{policy.viewCount.toLocaleString('ko-KR')}회</p>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              등록일
            </span>
            <p className="mt-0.5 text-slate-700">{formatDateTime(policy.createdAt)}</p>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              최근 수정일
            </span>
            <p className="mt-0.5 text-slate-700">{formatDateTime(policy.updatedAt)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-600">
            공개상태:{' '}
            <span
              className={policy.visibilityStatus === 'VISIBLE' ? 'text-primary' : 'text-slate-400'}
            >
              {policy.visibilityStatus === 'VISIBLE' ? '노출' : '비노출'}
            </span>
            {isDeleted && <span className="ml-2 text-rose-500">(삭제됨)</span>}
          </span>
          <button
            type="button"
            onClick={() =>
              onToggleVisibility(policy.visibilityStatus === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE')
            }
            disabled={isTogglingVisibility || isDeleted}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {policy.visibilityStatus === 'VISIBLE' ? '비노출로 전환' : '노출로 전환'}
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-bold text-slate-600">
              정책명
              <input
                type="text"
                value={draft.policyName}
                onChange={(e) => updateDraft('policyName', e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              주관기관
              <input
                type="text"
                value={draft.organizationName}
                onChange={(e) => updateDraft('organizationName', e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <label className="block text-xs font-bold text-slate-600">
            설명
            <textarea
              value={draft.description}
              onChange={(e) => updateDraft('description', e.target.value)}
              rows={2}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-bold text-slate-600">
              대분류
              <select
                value={draft.largeCategory}
                onChange={(e) => updateDraft('largeCategory', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              >
                {POLICY_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-600">
              중분류
              <input
                type="text"
                value={draft.middleCategory}
                onChange={(e) => updateDraft('middleCategory', e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-bold text-slate-600">
              신청 시작일
              <input
                type="date"
                value={draft.applicationStartDate}
                onChange={(e) => updateDraft('applicationStartDate', e.target.value)}
                max={draft.applicationEndDate || undefined}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              신청 종료일
              <input
                type="date"
                value={draft.applicationEndDate}
                onChange={(e) => updateDraft('applicationEndDate', e.target.value)}
                min={draft.applicationStartDate || undefined}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <label className="block text-xs font-bold text-slate-600">
            신청 URL
            <input
              type="text"
              value={draft.applicationUrl}
              onChange={(e) => updateDraft('applicationUrl', e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none"
            />
          </label>

          <div>
            <span className="block text-xs font-bold text-slate-600 mb-1">지역 매핑</span>
            <AdminPolicyRegionPicker
              regions={regions}
              isLoading={isRegionsLoading}
              selectedRegionCodes={draft.regionCodes}
              onToggleRegion={toggleRegion}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isDeleted}
              className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleted ? '삭제됨' : '삭제(soft delete)'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isDeleted}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="정말로 이 정책을 삭제하시겠습니까?"
        description={
          <>
            <strong>{policy.policyName}</strong> 정책을 삭제(soft delete) 처리합니다. 삭제된 정책은
            사용자 화면에 더 이상 노출되지 않습니다.
          </>
        }
        confirmLabel="확인, 삭제"
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
