import { useState } from 'react';

const MEMO_MAX_LENGTH = 2000;

interface TrackerMemoEditorProps {
  initialMemo: string;
  onSave: (memo: string) => void;
}

// 부모가 key={policyId}로 마운트를 리셋하므로 선택 변경 시 draft가 초기화된다.
export function TrackerMemoEditor({ initialMemo, onSave }: TrackerMemoEditorProps) {
  const [draft, setDraft] = useState(initialMemo);

  return (
    <div className="space-y-2">
      <label
        className="block text-xs font-extrabold text-slate-800"
        htmlFor="tracker-memo-textarea"
      >
        개인 업무 및 보완 기록 메모
      </label>
      <textarea
        id="tracker-memo-textarea"
        rows={4}
        maxLength={MEMO_MAX_LENGTH}
        placeholder="이곳에 이 정책 준비시 고려할 일정을 메모해 두세요. 예: 서류 제출시 담당 사무소 유선확인 필요 등"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:outline-none focus:border-primary bg-slate-50/20"
      />
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          {draft.length} / {MEMO_MAX_LENGTH} 자
        </span>
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          메모 저장하기
        </button>
      </div>
    </div>
  );
}
