import { motion } from "motion/react";

import type { Policy } from "@/entities/policy";

interface CompareDetailDialogProps {
  firstPolicy: Policy;
  secondPolicy: Policy;
  onClose: () => void;
}

export function CompareDetailDialog({ firstPolicy, secondPolicy, onClose }: CompareDetailDialogProps) {
  return (
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
            type="button"
            onClick={onClose}
            aria-label="비교 분석 닫기"
            className="rounded-full p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 font-semibold text-xs text-slate-400 text-left self-center">구분</div>
            <div className="col-span-4 font-bold text-xs text-primary text-left">{firstPolicy.title}</div>
            <div className="col-span-5 font-bold text-xs text-blue-600 text-left">{secondPolicy.title}</div>
          </div>

          <div className="border-t border-slate-50 my-2"></div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 text-xs font-bold text-slate-500 text-left">카테고리</div>
            <div className="col-span-4 text-xs text-slate-700 text-left">{firstPolicy.category}</div>
            <div className="col-span-5 text-xs text-slate-700 text-left">{secondPolicy.category}</div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 text-xs font-bold text-slate-500 text-left">소속 지역</div>
            <div className="col-span-4 text-xs text-slate-700 text-left">{firstPolicy.region}</div>
            <div className="col-span-5 text-xs text-slate-700 text-left">{secondPolicy.region}</div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 text-xs font-bold text-slate-500 text-left">지원 연령</div>
            <div className="col-span-4 text-xs text-slate-700 text-left">{firstPolicy.target}</div>
            <div className="col-span-5 text-xs text-slate-700 text-left">{secondPolicy.target}</div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 text-xs font-bold text-slate-500 text-left">정책 소개</div>
            <div className="col-span-4 text-[11px] text-slate-500 text-left leading-relaxed">
              {firstPolicy.description}
            </div>
            <div className="col-span-5 text-[11px] text-slate-500 text-left leading-relaxed">
              {secondPolicy.description}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 text-xs font-bold text-slate-500 text-left">상세 혜택 및 요건</div>
            <div className="col-span-4 text-[10px] text-slate-600 text-left space-y-1.5 leading-relaxed">
              {firstPolicy.details.map((detail) => (
                <p key={detail}>• {detail}</p>
              ))}
            </div>
            <div className="col-span-5 text-[10px] text-slate-600 text-left space-y-1.5 leading-relaxed">
              {secondPolicy.details.map((detail) => (
                <p key={detail}>• {detail}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
