import { useMemo } from 'react';

import { usePublicRegionsQuery } from '@/entities/region';
import type { UserProfile } from '@/entities/user';
import { CURRENT_YEAR } from '@/shared/constants';

const MIN_ELIGIBLE_AGE = 14;
const MAX_ELIGIBLE_AGE = 38;

const BIRTH_YEARS = Array.from(
  { length: MAX_ELIGIBLE_AGE - MIN_ELIGIBLE_AGE + 1 },
  (_, index) => CURRENT_YEAR - MIN_ELIGIBLE_AGE - index,
);

interface WizardStepBasicProps {
  draft: UserProfile;
  onUpdateDraft: (patch: Partial<UserProfile>) => void;
}

export function WizardStepBasic({ draft, onUpdateDraft }: WizardStepBasicProps) {
  const { data: regions = [], isLoading, isError } = usePublicRegionsQuery();

  // 시·도 대표 행(districtName === provinceName)만 남겨 광역시·도 선택지로 쓴다.
  const provinces = useMemo(
    () => regions.filter((region) => region.districtName === region.provinceName),
    [regions],
  );

  // 선택된 시·도에 속한 시·군·구만 노출한다. 이전에는 시·도와 무관하게 고정된 5개 목록을 보여줘
  // 시·도를 바꿔도 이전 시·군·구 선택이 그대로 남는 문제가 있었다.
  const districts = useMemo(
    () =>
      regions.filter(
        (region) =>
          region.provinceName === draft.region && region.districtName !== region.provinceName,
      ),
    [regions, draft.region],
  );

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
          value={draft.birthYear || ''}
          onChange={(e) => onUpdateDraft({ birthYear: Number(e.target.value) })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="" disabled>
            출생연도
          </option>
          {BIRTH_YEARS.map((year) => (
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
            disabled={isLoading}
            onChange={(e) => onUpdateDraft({ region: e.target.value, subRegion: '' })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none disabled:opacity-50"
          >
            <option value="" disabled>
              {isLoading ? '불러오는 중...' : '지역'}
            </option>
            {provinces.map((province) => (
              <option key={province.regionCode} value={province.provinceName}>
                {province.provinceName}
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
            disabled={draft.region === ''}
            onChange={(e) => onUpdateDraft({ subRegion: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none disabled:opacity-50"
          >
            <option value="">선택 안 함 (시·도 전체)</option>
            {districts.map((district) => (
              <option key={district.regionCode} value={district.districtName}>
                {district.districtName}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isError && (
        <p className="text-[10px] text-red-400">
          지역 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}
      <p className="text-[10px] text-slate-400">
        ※ 시군구 조건이 맞지 않더라도 전국 및 광역시 통합 우대 조건은 누락 없이 분석 매치해
        드립니다.
      </p>
    </div>
  );
}
