import type { UserProfile } from "@/entities/user";

const EMPLOYMENT_STATUS_OPTIONS = [
  "미취업·구직",
  "재직",
  "자영업",
  "프리랜서",
  "창업·창업준비",
  "기타",
];

const EDUCATION_STATUS_OPTIONS = [
  "고교 재학",
  "고교 졸업",
  "대학 재학",
  "대졸 예정",
  "대학 졸업",
  "석·박사",
  "기타",
];

interface WizardStepStatusProps {
  draft: UserProfile;
  onUpdateDraft: (patch: Partial<UserProfile>) => void;
}

interface OptionButtonGridProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function OptionButtonGrid({ label, options, selected, onSelect }: OptionButtonGridProps) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              aria-pressed={isSelected}
              className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WizardStepStatus({ draft, onUpdateDraft }: WizardStepStatusProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-800">2. 현재 라이프스타일 및 자격상태</h3>
        <p className="text-xs text-slate-400">
          고용상태 및 졸업 학력 요건은 청년지원 제도의 가장 강력한 승인 잣대 조건입니다.
        </p>
      </div>

      <OptionButtonGrid
        label="현재 취업 고용 상태"
        options={EMPLOYMENT_STATUS_OPTIONS}
        selected={draft.employmentStatus}
        onSelect={(value) => onUpdateDraft({ employmentStatus: value })}
      />

      <OptionButtonGrid
        label="최종 학력 상태"
        options={EDUCATION_STATUS_OPTIONS}
        selected={draft.educationStatus}
        onSelect={(value) => onUpdateDraft({ educationStatus: value })}
      />
    </div>
  );
}
