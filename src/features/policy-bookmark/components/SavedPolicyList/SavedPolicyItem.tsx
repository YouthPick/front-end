import { getPolicyCategoryBadgeClasses, type Policy } from '@/entities/policy';

interface SavedPolicyItemProps {
  policy: Policy;
  onToggleSave: (policyId: string) => void;
  onViewDetails: (policy: Policy) => void;
  onRestoreView: (policy: Policy) => void;
  onStartTracker: (policy: Policy) => void;
}

export function SavedPolicyItem({
  policy,
  onToggleSave,
  onViewDetails,
  onRestoreView,
  onStartTracker,
}: SavedPolicyItemProps) {
  return (
    <div
      className={`rounded-2xl border p-4.5 space-y-3 transition-all ${
        policy.isSourceMissing
          ? 'border-amber-200 bg-amber-50/30'
          : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
      }`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            {policy.isSourceMissing ? (
              <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                원본 누락
              </span>
            ) : (
              <span
                className={`rounded border px-1.5 py-0.5 text-[8px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
              >
                {policy.category}
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-bold">{policy.region}</span>
          </div>
          <h5 className="text-xs font-extrabold text-slate-800">{policy.title}</h5>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave(policy.id)}
          className="text-xs text-rose-500 font-bold hover:underline"
        >
          관심 해제
        </button>
      </div>

      {/* Warning text for source-missing policy */}
      {policy.isSourceMissing ? (
        <div className="space-y-1">
          <p className="text-[11px] text-amber-700 leading-relaxed font-bold">
            ⚠️ 현재 해당 사업의 공공데이터 공식 원본 공고를 조회할 수 없습니다.
          </p>
          <p className="text-[10px] text-slate-400 leading-normal">
            기존에 작성해두셨던 체크리스트, 진행 단계 일정 및 개인 소명 기록 메모 등은 이 계정에
            그대로 안전하게 계속 보호 유지됩니다.
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 leading-relaxed">{policy.description}</p>
      )}

      {/* Action buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100/60 text-xs font-bold">
        {policy.isSourceMissing ? (
          <button
            type="button"
            onClick={() => onRestoreView(policy)}
            className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
          >
            과거 저장 정보 복원보기
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onViewDetails(policy)}
              className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
            >
              공고 내용 복사조회
            </button>
            <button
              type="button"
              onClick={() => onStartTracker(policy)}
              className="rounded-lg bg-primary text-white px-3.5 py-1.5 text-[10px] hover:brightness-105"
            >
              일정 스케줄러 등록
            </button>
          </>
        )}
      </div>
    </div>
  );
}
