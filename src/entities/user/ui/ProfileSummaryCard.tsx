import type { UserProfile } from '../model/user.types';

interface ProfileSummaryCardProps {
  profile: UserProfile;
  onEdit: () => void;
}

function formatIncome(profile: UserProfile): string {
  if (profile.incomeUnknown) return '소득 무관';
  if (profile.annualIncome === null) return '미설정';
  return `연 ${profile.annualIncome.toLocaleString()}만원`;
}

interface ChipTileProps {
  label: string;
  values: string[];
  emptyText: string;
  chipClassName: string;
}

// 값이 여러 개(뱃지 목록)라 한 줄에 안 들어갈 수 있으므로 그리드 전체 폭을 차지하는 타일로 렌더한다.
function ChipTile({ label, values, emptyText, chipClassName }: ChipTileProps) {
  return (
    <div className="col-span-2 rounded-xl bg-slate-50 px-3.5 py-2.5 sm:col-span-3">
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
    { label: '거주지', value: `${profile.region} ${profile.subRegion}` },
    { label: '출생연도', value: `${profile.birthYear}년생` },
    { label: '취업상태', value: profile.employmentStatus },
    { label: '학력', value: profile.educationStatus },
    { label: '결혼상태', value: profile.maritalStatus },
    { label: '전공계열', value: profile.major },
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

        <ChipTile
          label="특화조건"
          values={profile.specialConditions}
          emptyText="해당없음"
          chipClassName="bg-slate-200/70 text-slate-700"
        />

        <ChipTile
          label="관심분야"
          values={profile.interests}
          emptyText="관심 분야 미설정"
          chipClassName="bg-primary/10 text-primary"
        />
      </div>
    </div>
  );
}
