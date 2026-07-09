import { Calendar, Check, CheckCircle2, Heart, HelpCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

import { getPolicyCategoryBadgeClasses, type Policy } from '@/entities/policy';

interface PolicyDetailModalPresenterProps {
  policy: Policy;
  isSaved: boolean;
  isRecommendation: boolean;
  recommendationScore: number;
  onToggleSave: (policyId: string) => void;
  onStartTracker: (policy: Policy) => void;
  onClose: () => void;
}

export function PolicyDetailModalPresenter({
  policy,
  isSaved,
  isRecommendation,
  recommendationScore,
  onToggleSave,
  onStartTracker,
  onClose,
}: PolicyDetailModalPresenterProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        id="policy-detail-modal"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="text-left space-y-1.5">
            <div className="flex items-center space-x-2">
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
              >
                {policy.category}
              </span>
              <span className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                {policy.region}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-slate-800">{policy.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="상세 정보 닫기"
            className="rounded-full p-1.5 transition-colors hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content body */}
        <div className="mt-4 space-y-5 text-left max-h-[58vh] overflow-y-auto pr-1">
          {/* Recommendation basis panel */}
          {isRecommendation && (
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.01] p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  회원님과의 조건 분석 결과
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  데이터 신뢰도: <span className="text-emerald-500 font-extrabold">MEDIUM</span>
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-primary">{recommendationScore}점</span>
                <span className="text-xs text-slate-400 font-bold">유사도 매칭</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  일치하는 조건
                </span>
                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-emerald-600">
                      <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                      거주지역이 서울특별시로 일치합니다.
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">+25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-emerald-600">
                      <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                      관심 분야인 {policy.category} 정책입니다.
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">+20</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-emerald-600">
                      <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                      취업상태 조건이 일치합니다.
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">+15</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
                  확인 필요 사항
                </span>
                <div className="space-y-1 text-[11px] text-slate-500 leading-normal">
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-1">•</span>
                    세부 소득요건은 공식 공고에서 자격 자가진단으로 확인해야 합니다.
                  </p>
                  <p className="flex items-start">
                    <span className="text-amber-500 mr-1">•</span>
                    추가 신청자격 및 제출서류 조건이 변경되었는지 공고에서 대조하세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Intro description */}
          <div className="rounded-2xl bg-slate-50/50 border border-slate-100 p-4">
            <p className="text-xs leading-relaxed text-slate-600 font-medium">
              {policy.description}
            </p>
          </div>

          {/* Quick info row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 rounded-2xl bg-primary/5 p-3 border border-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <span className="block text-[10px] text-slate-400">신청 마감</span>
                <span className="text-xs font-bold text-slate-700">{policy.deadline}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 rounded-2xl bg-blue-50/50 p-3 border border-blue-50">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <div>
                <span className="block text-[10px] text-slate-400">지원 대상</span>
                <span className="text-xs font-bold text-slate-700">{policy.target}</span>
              </div>
            </div>
          </div>

          {/* Bullet point lists of details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-primary mr-1" />
              <span>상세 혜택 및 신청요건</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 pl-1 leading-relaxed">
              {policy.details.map((detail) => (
                <li key={detail} className="flex items-start">
                  <span className="mr-1.5 text-primary">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onToggleSave(policy.id)}
            aria-pressed={isSaved}
            className={`flex items-center justify-center space-x-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
              isSaved
                ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100/50'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-rose-500'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? '담김' : '담기'}</span>
          </button>

          <button
            type="button"
            onClick={() => onStartTracker(policy)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-teal-50 border border-teal-200 py-2.5 text-xs font-bold text-teal-600 hover:bg-teal-100 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span>신청관리 시작</span>
          </button>

          <a
            href={policy.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center space-x-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition-all hover:brightness-105"
          >
            <span>공식 공고 ↗</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
