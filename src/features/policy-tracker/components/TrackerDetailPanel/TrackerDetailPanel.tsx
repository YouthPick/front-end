import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { Policy } from '@/entities/policy';

import type { TrackerItem, TrackerStatus } from '../../types/tracker.types';
import { TrackerChecklist } from './TrackerChecklist';
import { TrackerDeleteConfirm } from './TrackerDeleteConfirm';
import { TrackerMemoEditor } from './TrackerMemoEditor';

const TRACKER_STATUS_OPTIONS: TrackerStatus[] = ['관심', '준비중', '신청완료', '종료'];

function isTrackerStatus(value: string): value is TrackerStatus {
  return (TRACKER_STATUS_OPTIONS as readonly string[]).includes(value);
}

interface TrackerDetailPanelProps {
  tracker: TrackerItem;
  policy: Policy;
  onUpdateStatus: (status: TrackerStatus) => void;
  onUpdateDate: (targetDate: string) => void;
  onToggleChecklistItem: (itemId: string) => void;
  onDeleteChecklistItem: (itemId: string) => void;
  onAddChecklistItem: (text: string) => void;
  onSaveMemo: (memo: string) => void;
  onDeleteTracker: () => void;
}

export function TrackerDetailPanel({
  tracker,
  policy,
  onUpdateStatus,
  onUpdateDate,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onAddChecklistItem,
  onSaveMemo,
  onDeleteTracker,
}: TrackerDetailPanelProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 text-left space-y-6 shadow-sm">
      {/* Header bar */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary">
            {policy.category}
          </span>
          <h3 className="text-sm font-black text-slate-800 leading-tight pr-6">{policy.title}</h3>
        </div>
        <a
          href={policy.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50"
        >
          공식 공고 ↗
        </a>
      </div>

      {/* Interactive inputs: status, target date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            className="block text-[10px] font-extrabold text-slate-400 uppercase"
            htmlFor="tracker-status-select"
          >
            신청 상태 변경
          </label>
          <select
            id="tracker-status-select"
            value={tracker.status}
            onChange={(e) => {
              if (isTrackerStatus(e.target.value)) onUpdateStatus(e.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-primary"
          >
            {TRACKER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            className="block text-[10px] font-extrabold text-slate-400 uppercase"
            htmlFor="tracker-date-input"
          >
            목표 마감일 설정
          </label>
          <input
            id="tracker-date-input"
            type="date"
            value={tracker.targetDate}
            onChange={(e) => onUpdateDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-primary"
          />
        </div>
      </div>

      {/* Required documents brief */}
      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          정책 제출 서류 기본 안내
        </h4>
        <p className="text-xs text-slate-600 font-extrabold leading-relaxed">
          • 신청서 및 자기소개서, 구직상태 자격 소명 확인서
        </p>
        <p className="text-[10px] text-slate-400">
          * 주관 부처 마감 이전에 제출 서류 목록이 변동되었는지 공식 안내 고시를 반드시 교차
          검토하세요.
        </p>
      </div>

      <TrackerChecklist
        checklist={tracker.checklist}
        onToggleItem={onToggleChecklistItem}
        onDeleteItem={onDeleteChecklistItem}
        onAddItem={onAddChecklistItem}
      />

      <TrackerMemoEditor key={tracker.policyId} initialMemo={tracker.memo} onSave={onSaveMemo} />

      {/* Dangerous tracker deletion option */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs text-rose-500 font-bold hover:underline flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>이 정책의 신청관리 기록에서 삭제</span>
        </button>
      </div>

      {showDeleteConfirm && (
        <TrackerDeleteConfirm
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDeleteTracker();
          }}
        />
      )}
    </div>
  );
}
