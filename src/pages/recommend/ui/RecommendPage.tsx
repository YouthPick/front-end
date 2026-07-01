import { AlertTriangle, Check, Edit3, Info } from "lucide-react";
import { CompareModule } from "@features/policy-compare";
import type { Policy } from "@entities/policy";
import type { UserProfile } from "@entities/user";

interface RecommendationReasonDetail {
  code: string;
  message: string;
  score: number;
}

interface RecommendedPolicyItem {
  policy: Policy;
  score: number;
  reliability: string;
  reasons: string[];
  reasonDetails: RecommendationReasonDetail[];
  checkpoints: string[];
}

interface RecommendPageProps {
  userProfile: UserProfile;
  recommendedPolicies: RecommendedPolicyItem[];
  isRecommendationLoading: boolean;
  isRecommendationFallback: boolean;
  isRecommendationPersonalized: boolean;
  recommendationErrorMessage: string | null;
  recommendationMessage: string;
  comparingPolicies: Policy[];
  savedPolicyIds: string[];
  onEditProfile: () => void;
  onViewPolicyDetails: (policy: Policy) => void;
  onToggleSave: (policyId: string) => void;
  onStartTracker: (policy: Policy) => void;
  onClearCompare: () => void;
  onRemoveCompare: (policy: Policy) => void;
}

export function RecommendPage({
  userProfile,
  recommendedPolicies,
  isRecommendationLoading,
  isRecommendationFallback,
  isRecommendationPersonalized,
  recommendationErrorMessage,
  recommendationMessage,
  comparingPolicies,
  savedPolicyIds,
  onEditProfile,
  onViewPolicyDetails,
  onToggleSave,
  onStartTracker,
  onClearCompare,
  onRemoveCompare,
}: RecommendPageProps) {
  return (
<div className="space-y-6 animate-in fade-in duration-300">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
    <div>
      <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">AI 종합 분석 스마트 팩트 매칭</span>
      <h2 className="text-lg font-black text-slate-800">나만을 위한 1:1 맞춤 청년정책 추천</h2>
      <p className="text-xs text-slate-400 mt-0.5">회원님의 맞춤 프로필 가중치를 기반으로 상위 일치하는 자격을 자동 순위화했습니다.</p>
    </div>
    <button
      onClick={onEditProfile}
      className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
    >
      <Edit3 className="h-3.5 w-3.5" />
      <span>프로필 및 키워드 다시 작성</span>
    </button>
  </div>

  {/* Profile Briefing Plate */}
  <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
    <div className="md:col-span-8 space-y-1.5">
      <span className="text-[10px] font-extrabold text-slate-400">현재 대조 프로필 조건</span>
      <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
        {userProfile.region} {userProfile.subRegion} · {userProfile.birthYear}년생 · {userProfile.employmentStatus} · {userProfile.educationStatus}
      </p>
      <div className="flex flex-wrap gap-1">
        {userProfile.interests.map((it) => (
          <span key={it} className="text-[9px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md font-bold">
            #{it}
          </span>
        ))}
        {userProfile.keywords.map((it) => (
          <span key={it} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
            #{it}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-400 font-bold leading-relaxed">
        {recommendationMessage}
      </p>
    </div>
    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-1">
      <span className="text-[10px] font-extrabold text-slate-400 block">통합 매칭 수</span>
      <span className="text-lg font-black text-slate-800">총 {recommendedPolicies.length}건 추천</span>
      <div className="mt-1 flex flex-wrap gap-1 text-[9px] font-bold">
        {isRecommendationLoading && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">추천 API 동기화 중</span>
        )}
        <span className={`rounded-full px-2 py-0.5 ${isRecommendationPersonalized ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}>
          {isRecommendationPersonalized ? "API 맞춤 추천" : "기본 추천"}
        </span>
        {recommendationErrorMessage && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
            서버 추천 실패 · {recommendationErrorMessage}
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Recommendation Cards Flow (REC-01 / Section 7) */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-8 space-y-4">
      {recommendedPolicies.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs font-bold text-slate-400">
          {recommendationErrorMessage
            ? "서버 추천 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            : "현재 조건에 맞는 서버 추천 정책이 없습니다."}
        </div>
      )}
      {recommendedPolicies.slice(0, 8).map(({ policy, score, reliability, reasons, reasonDetails, checkpoints }) => (
        <div 
          key={policy.id}
          className="rounded-3xl border border-slate-100 bg-white p-5 text-left hover:shadow-md transition-all space-y-4 relative overflow-hidden"
        >
          {/* Corner ribbon matching score */}
          <div className="absolute right-0 top-0 bg-gradient-to-l from-primary to-brand-secondary text-white px-4.5 py-1.5 rounded-bl-3xl text-xs font-black shadow-sm">
            유사도 {score}점
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                {policy.category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{policy.region}</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                신뢰도 {reliability}
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-800 pr-16 leading-tight">{policy.title}</h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pr-2">{policy.description}</p>

          {/* Reasons and Warning Section (REC-01 Section 7 requirement) */}
          <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
            <div className="space-y-1.5">
              <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">추천 및 우대 조건 매칭</span>
              <div className="space-y-1 text-xs text-slate-600 font-semibold">
                {(reasonDetails.length > 0 ? reasonDetails : reasons.map((reason) => ({ code: reason, message: reason, score: 0 }))).map((reason) => (
                  <p key={reason.code} className="flex items-center text-emerald-600">
                    <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                    {reason.message}
                    {reason.score > 0 && <span className="text-[10px] text-slate-400 ml-1">(+{reason.score})</span>}
                  </p>
                ))}
                {reasonDetails.length === 0 && reasons.length === 0 && (
                  <p className="flex items-center text-slate-500">
                    <Info className="h-3.5 w-3.5 mr-1 shrink-0" />
                    비교 가능한 프로필 조건이 적어 기본 추천으로 표시됩니다.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1 border-t border-slate-200/60 pt-2">
              <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">자가진단 및 공식공고 대조 필요</span>
              <p className="text-[11px] text-slate-500 flex items-start">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0 mt-0.5" />
                <span>{checkpoints[0] ?? "공식 공고에서 소득·자산·특화 조건을 반드시 확인하세요."}</span>
              </p>
              {checkpoints.slice(1, 3).map((checkpoint) => (
                <p key={checkpoint} className="text-[11px] text-slate-500 pl-5">· {checkpoint}</p>
              ))}
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => void onViewPolicyDetails(policy)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              상세 자격조건 보기
            </button>
            <button
              onClick={() => void onToggleSave(policy.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                savedPolicyIds.includes(policy.id)
                  ? "bg-rose-50 border-rose-100 text-rose-500"
                  : "bg-white border-slate-200 text-slate-500"
              }`}
            >
              {savedPolicyIds.includes(policy.id) ? "관심 저장됨 ♥" : "관심 정책 담기"}
            </button>
            <button
              onClick={() => onStartTracker(policy)}
              className="rounded-xl bg-primary px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all"
            >
              신청관리 시작
            </button>
          </div>
        </div>
      ))}
    </div>

    <div className="lg:col-span-4 space-y-6">
      <CompareModule 
        comparingPolicies={comparingPolicies} 
        onClear={onClearCompare} 
        onRemove={onRemoveCompare} 
      />
    </div>
  </div>
</div>
  );
}
