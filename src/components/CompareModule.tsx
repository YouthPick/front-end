import { ArrowRight, HelpCircle, RefreshCw } from "lucide-react";
import { Policy } from "../types";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CompareModuleProps {
  comparingPolicies: Policy[];
  onClear: () => void;
  onRemove: (policy: Policy) => void;
}

export default function CompareModule({ comparingPolicies, onClear, onRemove }: CompareModuleProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-start justify-between">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800">정책 비교</h3>
          <p className="text-[10px] text-slate-400 font-medium">최대 2개 정책을 선택해 비교해보세요.</p>
        </div>
        
        {comparingPolicies.length >= 2 ? (
          <button
            onClick={() => setShowDetailDialog(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center space-x-0.5 cursor-pointer"
          >
            <span>비교하기</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-0.5 cursor-default select-none">
            <span>비교하기</span>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* Comparison slots row with VS inside */}
        <div className="grid grid-cols-11 items-center gap-2 rounded-xl bg-slate-50/50 p-3.5 border border-slate-100">
          
          {/* Slot 1 */}
          <div className="col-span-5 text-left relative min-h-[56px] flex flex-col justify-center">
            {comparingPolicies[0] ? (
              <div className="space-y-1 pr-4">
                <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {comparingPolicies[0].category}
                </span>
                <h4 className="line-clamp-2 text-[10px] font-bold text-slate-700 leading-normal" title={comparingPolicies[0].title}>
                  {comparingPolicies[0].title}
                </h4>
                <p className="text-[9px] text-slate-400 font-semibold">({comparingPolicies[0].region})</p>
                <button
                  onClick={() => onRemove(comparingPolicies[0])}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 text-[9px] text-slate-400 font-bold border border-dashed border-slate-200 rounded-lg bg-white h-full min-h-[48px]">
                <span>정책 1 선택</span>
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="col-span-1 flex justify-center text-[10px] font-black text-slate-300">
            VS
          </div>

          {/* Slot 2 */}
          <div className="col-span-5 text-left relative min-h-[56px] flex flex-col justify-center">
            {comparingPolicies[1] ? (
              <div className="space-y-1 pr-4">
                <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  {comparingPolicies[1].category}
                </span>
                <h4 className="line-clamp-2 text-[10px] font-bold text-slate-700 leading-normal" title={comparingPolicies[1].title}>
                  {comparingPolicies[1].title}
                </h4>
                <p className="text-[9px] text-slate-400 font-semibold">({comparingPolicies[1].region})</p>
                <button
                  onClick={() => onRemove(comparingPolicies[1])}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 text-[9px] text-slate-400 font-bold border border-dashed border-slate-200 rounded-lg bg-white h-full min-h-[48px]">
                <span>정책 2 선택</span>
              </div>
            )}
          </div>
        </div>

        {/* Clear comparisons if any selected */}
        {comparingPolicies.length > 0 && (
          <div className="mt-2.5 flex justify-end">
            <button
              onClick={onClear}
              className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>선택 해제</span>
            </button>
          </div>
        )}
      </div>

      {/* Detailed Side-By-Side Comparison Dialog */}
      <AnimatePresence>
        {showDetailDialog && comparingPolicies.length >= 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl"
              id="comparison-detail-modal"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-800">📊 청년정책 맞춤 비교분석</h3>
                <button
                  onClick={() => setShowDetailDialog(false)}
                  className="rounded-full p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  {/* Category names row */}
                  <div className="col-span-3 font-semibold text-xs text-slate-400 text-left self-center">구분</div>
                  <div className="col-span-4 font-bold text-xs text-primary text-left">{comparingPolicies[0].title}</div>
                  <div className="col-span-5 font-bold text-xs text-blue-600 text-left">{comparingPolicies[1].title}</div>
                </div>

                <div className="border-t border-slate-50 my-2"></div>

                {/* Categories */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-bold text-slate-500 text-left">카테고리</div>
                  <div className="col-span-4 text-xs text-slate-700 text-left">{comparingPolicies[0].category}</div>
                  <div className="col-span-5 text-xs text-slate-700 text-left">{comparingPolicies[1].category}</div>
                </div>

                {/* Regions */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-bold text-slate-500 text-left">소속 지역</div>
                  <div className="col-span-4 text-xs text-slate-700 text-left">{comparingPolicies[0].region}</div>
                  <div className="col-span-5 text-xs text-slate-700 text-left">{comparingPolicies[1].region}</div>
                </div>

                {/* Targets */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-bold text-slate-500 text-left">지원 연령</div>
                  <div className="col-span-4 text-xs text-slate-700 text-left">{comparingPolicies[0].target}</div>
                  <div className="col-span-5 text-xs text-slate-700 text-left">{comparingPolicies[1].target}</div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-bold text-slate-500 text-left">정책 소개</div>
                  <div className="col-span-4 text-[11px] text-slate-500 text-left leading-relaxed">{comparingPolicies[0].description}</div>
                  <div className="col-span-5 text-[11px] text-slate-500 text-left leading-relaxed">{comparingPolicies[1].description}</div>
                </div>

                {/* Details (ul list) */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 text-xs font-bold text-slate-500 text-left">상세 혜택 및 요건</div>
                  <div className="col-span-4 text-[10px] text-slate-600 text-left space-y-1.5 leading-relaxed">
                    {comparingPolicies[0].details.map((d, idx) => (
                      <p key={idx}>• {d}</p>
                    ))}
                  </div>
                  <div className="col-span-5 text-[10px] text-slate-600 text-left space-y-1.5 leading-relaxed">
                    {comparingPolicies[1].details.map((d, idx) => (
                      <p key={idx}>• {d}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowDetailDialog(false)}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
