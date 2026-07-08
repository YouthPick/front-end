import { AlertTriangle, Check } from 'lucide-react';

import { getPolicyCategoryBadgeClasses, type Policy } from '@/entities/policy';

import type { PolicyRecommendation } from '../types/recommendation.types';

interface RecommendationCardProps {
  recommendation: PolicyRecommendation;
  isSaved: boolean;
  onViewDetails: (policy: Policy) => void;
  onToggleSave: (policyId: string) => void;
  onStartTracker: (policy: Policy) => void;
}

export function RecommendationCard({
  recommendation,
  isSaved,
  onViewDetails,
  onToggleSave,
  onStartTracker,
}: RecommendationCardProps) {
  const { policy, score, reasons } = recommendation;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 text-left hover:shadow-md transition-all space-y-4 relative overflow-hidden">
      {/* Corner ribbon matching score */}
      <div className="absolute right-0 top-0 bg-gradient-to-l from-primary to-brand-secondary text-white px-4.5 py-1.5 rounded-bl-3xl text-xs font-black shadow-sm">
        유사도 {score}점
      </div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-block rounded border px-1.5 py-0.5 text-[9px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
          >
            {policy.category}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">{policy.region}</span>
        </div>
        <h3 className="text-sm font-black text-slate-800 pr-16 leading-tight">{policy.title}</h3>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed pr-2">{policy.description}</p>

      {/* Reasons and warning section */}
      <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
        <div className="space-y-1.5">
          <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            추천 및 우대 조건 매칭
          </span>
          <div className="space-y-1 text-xs text-slate-600 font-semibold">
            <p className="flex items-center text-emerald-600">
              <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
              {reasons[0]} <span className="text-[10px] text-slate-400 ml-1">(+25)</span>
            </p>
            <p className="flex items-center text-emerald-600">
              <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
              {reasons[1]} <span className="text-[10px] text-slate-400 ml-1">(+20)</span>
            </p>
            <p className="flex items-center text-emerald-600">
              <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
              {reasons[2]} <span className="text-[10px] text-slate-400 ml-1">(+15)</span>
            </p>
          </div>
        </div>

        <div className="space-y-1 border-t border-slate-200/60 pt-2">
          <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
            자가진단 및 공식공고 대조 필요
          </span>
          <p className="text-[11px] text-slate-500 flex items-start">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0 mt-0.5" />
            <span>
              세부 건강보험 소득요건 및 기업 규모별 제한사항은 공식 페이지 상세조회가 필요합니다.
            </span>
          </p>
        </div>
      </div>

      {/* Card footer actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewDetails(policy)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          상세 자격조건 보기
        </button>
        <button
          type="button"
          onClick={() => onToggleSave(policy.id)}
          aria-pressed={isSaved}
          className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
            isSaved
              ? 'bg-rose-50 border-rose-100 text-rose-500'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          {isSaved ? '관심 저장됨 ♥' : '관심 정책 담기'}
        </button>
        <button
          type="button"
          onClick={() => onStartTracker(policy)}
          className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all"
        >
          신청관리 시작
        </button>
      </div>
    </div>
  );
}
