import { ArrowRight, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Policy } from "@entities/policy";
import { createPolicyComparison, type PolicyComparisonDto } from "../api/policy-comparison-api";

interface CompareModuleProps {
  comparingPolicies: Policy[];
  onClear: () => void;
  onRemove: (policy: Policy) => void;
}

export default function CompareModule({
  comparingPolicies,
  onClear,
  onRemove,
}: CompareModuleProps) {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [comparison, setComparison] = useState<PolicyComparisonDto | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [comparisonErrorMessage, setComparisonErrorMessage] = useState<string | null>(null);

  const handleOpenComparison = async () => {
    if (comparingPolicies.length < 2) return;
    setIsLoadingComparison(true);
    setComparisonErrorMessage(null);

    try {
      const result = await createPolicyComparison(comparingPolicies.map((policy) => policy.id));
      setComparison(result);
    } catch (error) {
      setComparison(null);
      setComparisonErrorMessage(
        error instanceof Error ? error.message : "비교 API 응답을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoadingComparison(false);
      setShowDetailDialog(true);
    }
  };

  const handleRemove = (policy: Policy) => {
    setComparison(null);
    setComparisonErrorMessage(null);
    onRemove(policy);
  };

  const handleClear = () => {
    setComparison(null);
    setComparisonErrorMessage(null);
    onClear();
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-start justify-between">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800">정책 비교</h3>
          <p className="text-[10px] text-slate-400 font-medium">
            최대 3개 정책을 선택해 같은 기준으로 비교해보세요.
          </p>
        </div>

        {comparingPolicies.length >= 2 ? (
          <button
            onClick={() => void handleOpenComparison()}
            disabled={isLoadingComparison}
            className="text-xs font-bold text-primary hover:underline flex items-center space-x-0.5 cursor-pointer disabled:cursor-wait disabled:opacity-60"
          >
            {isLoadingComparison ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span>비교하기</span>
            )}
            <ArrowRight className="h-3 w-3" />
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-0.5 cursor-default select-none">
            <span>비교하기</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50/50 p-3.5 border border-slate-100">
          {[0, 1, 2].map((slotIndex) => {
            const policy = comparingPolicies[slotIndex];
            return (
              <div key={slotIndex} className="relative min-h-[64px] text-left">
                {policy ? (
                  <div className="h-full space-y-1 rounded-lg bg-white p-2 pr-6 border border-slate-100">
                    <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {policy.category}
                    </span>
                    <h4
                      className="line-clamp-2 text-[10px] font-bold text-slate-700 leading-normal"
                      title={policy.title}
                    >
                      {policy.title}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-semibold">{policy.region}</p>
                    <button
                      onClick={() => handleRemove(policy)}
                      className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                      aria-label={`${policy.title} 비교 목록에서 제거`}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[64px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-2 text-[9px] font-bold text-slate-400">
                    <span>정책 {slotIndex + 1} 선택</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {comparingPolicies.length === 1 && (
          <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
            <HelpCircle className="h-3 w-3" />
            비교하려면 정책을 하나 더 선택하세요.
          </p>
        )}

        {comparingPolicies.length > 0 && (
          <div className="mt-2.5 flex justify-end">
            <button
              onClick={handleClear}
              className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>선택 해제</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDetailDialog && comparingPolicies.length >= 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl rounded-3xl bg-white p-6 shadow-xl"
              id="comparison-detail-modal"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">📊 청년정책 비교표</h3>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {comparison?.notice ?? "서버 비교 데이터를 불러오지 못했습니다."}
                  </p>
                  {comparisonErrorMessage && (
                    <p className="mt-1 text-[11px] font-bold text-rose-600">
                      {comparisonErrorMessage}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailDialog(false)}
                  className="rounded-full p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                  aria-label="비교표 닫기"
                >
                  ✕
                </button>
              </div>

              {comparison ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 w-36 bg-white px-3 py-3 text-xs font-black text-slate-400">
                          구분
                        </th>
                        {comparison.policies.map((policy) => (
                          <th key={policy.policyId} className="min-w-48 px-3 py-3 align-top">
                            <p className="text-xs font-black text-slate-800">{policy.title}</p>
                            <p className="mt-1 text-[10px] font-bold text-slate-400">
                              {policy.region} · {policy.category}
                            </p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.rows.map((row) => (
                        <tr key={row.key} className="border-t border-slate-100">
                          <th className="sticky left-0 z-10 bg-white px-3 py-3 text-xs font-bold text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              {row.different && <span className="text-primary">●</span>}
                              {row.label}
                            </span>
                          </th>
                          {row.values.map((value) => (
                            <td
                              key={`${row.key}-${value.policyId}`}
                              className={`border-t border-slate-100 px-3 py-3 text-xs leading-relaxed ${
                                row.different
                                  ? "bg-primary/[0.03] text-slate-800"
                                  : "text-slate-600"
                              } ${value.missing ? "text-slate-400" : ""}`}
                            >
                              {value.displayValue}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs font-bold text-slate-400">
                  서버 비교 API 응답이 없어 비교표를 표시하지 않습니다.
                </div>
              )}

              <div className="mt-6 flex justify-end">
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
