import type { UserProfile } from '@/entities/user';

import { WIZARD_TOTAL_STEPS } from '../hooks/useProfileSetupWizard';
import { WizardStepAdditional } from './WizardStepAdditional';
import { WizardStepBasic } from './WizardStepBasic';
import { WizardStepInterest } from './WizardStepInterest';
import { WizardStepStatus } from './WizardStepStatus';

interface ProfileSetupPresenterProps {
  step: number;
  draft: UserProfile;
  canProceed: boolean;
  isSubmitting: boolean;
  newKeywordInput: string;
  onKeywordInputChange: (value: string) => void;
  onUpdateDraft: (patch: Partial<UserProfile>) => void;
  onToggleInterest: (interest: string) => void;
  onToggleSpecialCondition: (condition: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

export function ProfileSetupPresenter({
  step,
  draft,
  canProceed,
  isSubmitting,
  newKeywordInput,
  onKeywordInputChange,
  onUpdateDraft,
  onToggleInterest,
  onToggleSpecialCondition,
  onAddKeyword,
  onRemoveKeyword,
  onNext,
  onPrev,
  onSkip,
}: ProfileSetupPresenterProps) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 text-left space-y-6 shadow-sm">
      {/* Wizard progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="text-primary font-black">맞춤 조건 분석 프로필 설정</span>
          <span>
            {step} / {WIZARD_TOTAL_STEPS} 단계
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / WIZARD_TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && <WizardStepBasic draft={draft} onUpdateDraft={onUpdateDraft} />}
      {step === 2 && <WizardStepStatus draft={draft} onUpdateDraft={onUpdateDraft} />}
      {step === 3 && (
        <WizardStepAdditional
          draft={draft}
          onUpdateDraft={onUpdateDraft}
          onToggleSpecialCondition={onToggleSpecialCondition}
        />
      )}
      {step === 4 && (
        <WizardStepInterest
          draft={draft}
          newKeywordInput={newKeywordInput}
          onKeywordInputChange={onKeywordInputChange}
          onToggleInterest={onToggleInterest}
          onAddKeyword={onAddKeyword}
          onRemoveKeyword={onRemoveKeyword}
        />
      )}

      {/* Wizard action footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            이전 단계로
          </button>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
          >
            나중에 하기
          </button>
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:hover:brightness-100 disabled:active:scale-100"
        >
          {step === WIZARD_TOTAL_STEPS
            ? isSubmitting
              ? '저장 중...'
              : '맞춤 추천목록 확인'
            : '다음 단계로'}
        </button>
      </div>
    </div>
  );
}
