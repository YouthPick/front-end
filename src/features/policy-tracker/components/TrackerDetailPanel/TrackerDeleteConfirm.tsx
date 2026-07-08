import { AlertTriangle } from 'lucide-react';

interface TrackerDeleteConfirmProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function TrackerDeleteConfirm({ onCancel, onConfirm }: TrackerDeleteConfirmProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-3">
      <div className="flex items-start space-x-2">
        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-rose-900">
            정말로 신청 일정을 삭제하시겠습니까?
          </h4>
          <p className="text-[11px] text-rose-700 leading-normal">
            기록을 지우면 그동안 기입해둔 맞춤 일정, 서류 체크리스트 및 개인 메모가 영구적으로
            파기됩니다.
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700"
        >
          삭제 확인
        </button>
      </div>
    </div>
  );
}
