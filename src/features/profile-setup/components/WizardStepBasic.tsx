import type { UserProfile } from "@/entities/user";

const BIRTH_YEAR_BASE = 1988;
const BIRTH_YEAR_COUNT = 25;
const CURRENT_YEAR = 2026;

const REGION_OPTIONS = ["서울특별시", "경기도", "부산광역시", "인천광역시"];
const SUB_REGION_OPTIONS = ["마포구", "분당구", "해운대구", "남동구", "기타"];

interface WizardStepBasicProps {
  draft: UserProfile;
  onUpdateDraft: (patch: Partial<UserProfile>) => void;
}

export function WizardStepBasic({ draft, onUpdateDraft }: WizardStepBasicProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-800">1. 기본 조건을 알려주세요</h3>
        <p className="text-xs text-slate-400">
          전국 및 관내 거주 청년에게 제한 지급되는 수혜 나이 조건을 매칭 분석하는 기초 데이터입니다.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500" htmlFor="wizard-birth-year">
          출생연도
        </label>
        <select
          id="wizard-birth-year"
          value={draft.birthYear}
          onChange={(e) => onUpdateDraft({ birthYear: parseInt(e.target.value, 10) })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
        >
          {Array.from({ length: BIRTH_YEAR_COUNT }, (_, i) => BIRTH_YEAR_BASE + i).map((year) => (
            <option key={year} value={year}>
              {year}년생 (만 {CURRENT_YEAR - year}세)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500" htmlFor="wizard-region">
            거주 광역시·도
          </label>
          <select
            id="wizard-region"
            value={draft.region}
            onChange={(e) => onUpdateDraft({ region: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            {REGION_OPTIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500" htmlFor="wizard-sub-region">
            거주 시·군·구 (선택)
          </label>
          <select
            id="wizard-sub-region"
            value={draft.subRegion}
            onChange={(e) => onUpdateDraft({ subRegion: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
          >
            {SUB_REGION_OPTIONS.map((subRegion) => (
              <option key={subRegion} value={subRegion}>
                {subRegion === "기타" ? "기타 전체" : subRegion}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-[10px] text-slate-400">
        ※ 시군구 조건이 맞지 않더라도 전국 및 광역시 통합 우대 조건은 누락 없이 분석 매치해 드립니다.
      </p>
    </div>
  );
}
