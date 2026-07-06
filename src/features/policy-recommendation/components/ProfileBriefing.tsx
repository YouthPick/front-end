import type { UserProfile } from "@/entities/user";

interface ProfileBriefingProps {
  profile: UserProfile;
}

export function ProfileBriefing({ profile }: ProfileBriefingProps) {
  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-8 space-y-1.5">
        <span className="text-[10px] font-extrabold text-slate-400">현재 대조 프로필 조건</span>
        <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
          {profile.region} {profile.subRegion} · {profile.birthYear}년생 · {profile.employmentStatus} · {profile.educationStatus}
        </p>
        <div className="flex flex-wrap gap-1">
          {profile.interests.map((interest) => (
            <span key={interest} className="text-[9px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md font-bold">
              #{interest}
            </span>
          ))}
          {profile.keywords.map((keyword) => (
            <span key={keyword} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
              #{keyword}
            </span>
          ))}
        </div>
      </div>
      <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-1">
        <span className="text-[10px] font-extrabold text-slate-400 block">통합 매칭 수</span>
        <span className="text-lg font-black text-slate-800">총 28건 추천</span>
      </div>
    </div>
  );
}
