import type { UserProfile } from '../model/user.types';

interface ProfileSummaryCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

const UNSET_LABEL = '미설정';

function formatIncome(profile: UserProfile): string {
  if (profile.incomeUnknown) return '소득 무관';
  if (profile.annualIncome === null) return UNSET_LABEL;
  return `연 ${profile.annualIncome.toLocaleString()}만원`;
}

function formatRegion(profile: UserProfile): string {
  if (!profile.region) return UNSET_LABEL;
  return profile.subRegion ? `${profile.region} ${profile.subRegion}` : profile.region;
}

interface ChipTileProps {
  label: string;
  values: string[];
  emptyText: string;
  chipClassName: string;
  className?: string;
}

function ChipTile({ label, values, emptyText, chipClassName, className = '' }: ChipTileProps) {
  return (
    <div className={`rounded-xl bg-slate-50 px-3.5 py-2.5 ${className}`}>
      <span className="block text-[10px] font-bold text-slate-400">{label}</span>
      <div className="mt-1 flex flex-wrap gap-1">
        {values.length > 0 ? (
          values.map((value) => (
            <span
              key={value}
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${chipClassName}`}
            >
              {value}
            </span>
          ))
        ) : (
          <span className="text-xs font-extrabold text-slate-800">{emptyText}</span>
        )}
      </div>
    </div>
  );
}

export function ProfileSummaryCard({ profile, onEdit }: ProfileSummaryCardProps) {
  const tiles = [
    { label: '거주지', value: formatRegion(profile) },
    { label: '출생연도', value: profile.birthYear ? `${profile.birthYear}년생` : UNSET_LABEL },
    { label: '취업상태', value: profile.employmentStatus || UNSET_LABEL },
    { label: '학력', value: profile.educationStatus || UNSET_LABEL },
    { label: '결혼상태', value: profile.maritalStatus || UNSET_LABEL },
    { label: '전공계열', value: profile.major || UNSET_LABEL },
    { label: '연소득', value: formatIncome(profile) },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-extrabold text-slate-800">맞춤 프로필 정보</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary font-bold hover:underline"
        >
          수정
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl bg-slate-50 px-3.5 py-2.5 min-w-0">
            <span className="block text-[10px] font-bold text-slate-400">{tile.label}</span>
            <span className="mt-0.5 block truncate text-xs font-extrabold text-slate-800">
              {tile.value}
            </span>
          </div>
        ))}

        {/* 연소득(1칸) 옆에 나란히 붙도록 2칸 폭으로 배치. sm 3열 그리드에서 정확히 한 행을 채운다. */}
        <ChipTile
          label="특화조건"
          values={profile.specialConditions}
          emptyText="해당없음"
          chipClassName="bg-slate-200/70 text-slate-700"
          className="col-span-2"
        />

        {/* 관심분야·추가 키워드는 온보딩에서 같은 단계로 수집되지만 매칭 비중이 달라(관심분야는 채점에 반영, 키워드는 미반영)
            타일은 유지하되 1:1 비율로 한 줄에 배치한다. */}
        <div className="col-span-2 grid grid-cols-2 gap-2.5 sm:col-span-3">
          <ChipTile
            label="관심분야"
            values={profile.interests}
            emptyText="관심 분야 미설정"
            chipClassName="bg-primary/10 text-primary"
          />

          <ChipTile
            label="추가 키워드"
            values={profile.keywords}
            emptyText="추가 키워드 미설정"
            chipClassName="bg-sky-50 text-sky-600"
          />
        </div>
      </div>
    </div>
  );
}
