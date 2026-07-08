import { POLICY_CATEGORIES } from '@/entities/policy';
import type { UserProfile } from '@/entities/user';

import { MAX_INTEREST_COUNT, MAX_KEYWORD_COUNT } from '../hooks/useProfileSetupWizard';

interface WizardStepInterestProps {
  draft: UserProfile;
  newKeywordInput: string;
  onKeywordInputChange: (value: string) => void;
  onToggleInterest: (interest: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
}

export function WizardStepInterest({
  draft,
  newKeywordInput,
  onKeywordInputChange,
  onToggleInterest,
  onAddKeyword,
  onRemoveKeyword,
}: WizardStepInterestProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-800">3. 관심 분야 및 검색 태그 키워드</h3>
        <p className="text-xs text-slate-400">
          수천 개의 정책 중 매칭 우선순위를 높이기 위한 사용자 가중치 조절 장치입니다.
        </p>
      </div>

      <div className="space-y-2">
        <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          관심 사업 카테고리 (최대 {MAX_INTEREST_COUNT}개)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POLICY_CATEGORIES.map((category) => {
            const isSelected = draft.interests.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleInterest(category)}
                aria-pressed={isSelected}
                className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          추가 타겟 키워드 (최대 {MAX_KEYWORD_COUNT}개)
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="예: 직무교육, 면접비, 보증금 등"
            value={newKeywordInput}
            onChange={(e) => onKeywordInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                onAddKeyword();
              }
            }}
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-primary"
            aria-label="관심 키워드 입력"
          />
          <button
            type="button"
            onClick={onAddKeyword}
            className="rounded-xl bg-slate-800 text-white px-4 py-2 text-xs font-bold hover:bg-slate-700"
          >
            추가
          </button>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {draft.keywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center space-x-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-extrabold text-primary"
            >
              <span>#{keyword}</span>
              <button
                type="button"
                onClick={() => onRemoveKeyword(keyword)}
                aria-label={`${keyword} 키워드 삭제`}
                className="text-primary hover:text-red-500 font-extrabold ml-1 shrink-0"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
