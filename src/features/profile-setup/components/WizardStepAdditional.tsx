import type { UserProfile } from '@/entities/user';

import {
  MAJOR_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  SPECIAL_CONDITION_OPTIONS,
} from '../model/profileOptions';
import { OptionButtonGrid } from './common/OptionButtonGrid';

interface WizardStepAdditionalProps {
  draft: UserProfile;
  onUpdateDraft: (patch: Partial<UserProfile>) => void;
  onToggleSpecialCondition: (condition: string) => void;
}

export function WizardStepAdditional({
  draft,
  onUpdateDraft,
  onToggleSpecialCondition,
}: WizardStepAdditionalProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-800">3. 추가 조건</h3>
        <p className="text-xs text-slate-400">
          해당하는 항목만 선택해 주세요. 건너뛴 조건은 제한없음으로 간주해 매칭합니다.
        </p>
      </div>

      <OptionButtonGrid
        label="결혼 상태"
        options={MARITAL_STATUS_OPTIONS.map((option) => option.label)}
        isSelected={(option) => draft.maritalStatus === option}
        onSelect={(value) => onUpdateDraft({ maritalStatus: value })}
      />

      <OptionButtonGrid
        label="전공 계열"
        options={MAJOR_OPTIONS.map((option) => option.label)}
        isSelected={(option) => draft.major === option}
        onSelect={(value) => onUpdateDraft({ major: value })}
      />

      <OptionButtonGrid
        label="특화 조건 (해당 시 복수 선택)"
        options={SPECIAL_CONDITION_OPTIONS.map((option) => option.label)}
        isSelected={(option) => draft.specialConditions.includes(option)}
        onSelect={onToggleSpecialCondition}
      />

      <div className="space-y-2">
        <label
          className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider"
          htmlFor="wizard-annual-income"
        >
          연소득 (만원)
        </label>
        <input
          id="wizard-annual-income"
          type="number"
          min={0}
          placeholder="예: 2800"
          value={draft.annualIncome ?? ''}
          disabled={draft.incomeUnknown}
          onChange={(e) =>
            onUpdateDraft({
              annualIncome: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none disabled:opacity-50"
        />
        <label className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <input
            type="checkbox"
            checked={draft.incomeUnknown}
            // 체크 시 annualIncome을 지우지 않는다. matchesIncome이 incomeUnknown만으로 이미
            // 중립 처리하므로 값을 유지해야 체크 해제 시 이전에 입력한 소득이 그대로 복원된다.
            onChange={(e) => onUpdateDraft({ incomeUnknown: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-slate-300 accent-primary"
          />
          <span>소득 정보 없음 / 소득 무관 정책만 매칭</span>
        </label>
      </div>
    </div>
  );
}
