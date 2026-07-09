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

export function ProfileSummaryCard({ profile, onEdit }: ProfileSummaryCardProps) {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xs font-extrabold text-slate-800">개인 맞춤 조건 가중치 프로필</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary font-bold hover:underline"
        >
          수정
        </button>
      </div>

      <div className="space-y-3.5 text-xs text-slate-600">
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">기본 거주지</span>
          <span className="col-span-3 font-extrabold text-slate-800">
            {profile.region} {profile.subRegion}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">출생연도</span>
          <span className="col-span-3 font-extrabold text-slate-800">{profile.birthYear}년생</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">현재 취업상태</span>
          <span className="col-span-3 font-extrabold text-slate-800">
            {profile.employmentStatus}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">최종 학력수준</span>
          <span className="col-span-3 font-extrabold text-slate-800">
            {profile.educationStatus}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">결혼 상태</span>
          <span className="col-span-3 font-extrabold text-slate-800">{profile.maritalStatus}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">전공 계열</span>
          <span className="col-span-3 font-extrabold text-slate-800">{profile.major}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">특화 조건</span>
          <span className="col-span-3 flex flex-wrap gap-1 font-bold text-slate-700">
            {profile.specialConditions.length > 0 ? (
              profile.specialConditions.map((condition) => (
                <span key={condition} className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                  {condition}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">해당없음</span>
            )}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">연소득</span>
          <span className="col-span-3 font-extrabold text-slate-800">{formatIncome(profile)}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <span className="text-slate-400 font-bold">관심 분야 목록</span>
          <span className="col-span-3 flex flex-wrap gap-1 font-bold text-slate-700">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span key={interest} className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">관심 분야 미설정</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
