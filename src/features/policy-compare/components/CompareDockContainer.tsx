import { ArrowLeftRight, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { parseApiError } from '@/shared/api';

import { getCompareErrorMessage } from '../api/compareErrorMessages';
import { mapPolicyComparisonItemDtosToComparisonPolicies } from '../api/compareMapper';
import { useCompare } from '../hooks/useCompare';
import { usePolicyComparisonQuery } from '../hooks/usePolicyComparisonQuery';
import { CompareDetailDialog } from './CompareDetailDialog';
import { ComparePanelPresenter } from './ComparePanelPresenter';

// RootLayout에 상시 마운트되는 정책 비교 독.
// 담긴 정책이 없으면 숨기고, 담는 순간 우측에서 슬라이드-인 한다. 이후 접기/펼치기 토글이 가능하다.
export function CompareDockContainer() {
  const { policyIds, comparingPolicies, removeCompare, clearCompare } = useCompare();
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const count = comparingPolicies.length;
  const prevCountRef = useRef(count);

  // 비교함이 비거나(다음 담기를 위한 초기화) 접힌 상태에서 새로 담으면 펼쳐서 보여준다.
  useEffect(() => {
    if (count === 0 || count > prevCountRef.current) setIsCollapsed(false);
    prevCountRef.current = count;
  }, [count]);

  // 상세 비교 모달이 열려 있을 때만 실제 비교 API를 호출한다.
  const comparisonQuery = usePolicyComparisonQuery(policyIds, {
    enabled: showDetailDialog && count >= 2,
  });
  const comparisonPolicies = comparisonQuery.data
    ? mapPolicyComparisonItemDtosToComparisonPolicies(comparisonQuery.data.policies)
    : [];
  const isComparisonError =
    comparisonQuery.isError || (showDetailDialog && !comparisonQuery.isValidRequest);
  const comparisonErrorMessage = isComparisonError
    ? getCompareErrorMessage(parseApiError(comparisonQuery.error))
    : undefined;

  return (
    <>
      <AnimatePresence mode="wait">
        {count > 0 &&
          (isCollapsed ? (
            <motion.button
              key="compare-tab"
              type="button"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              style={{ y: '-50%' }}
              onClick={() => setIsCollapsed(false)}
              aria-label={`정책 비교 열기 (${count}개 선택됨)`}
              className="fixed right-0 top-1/2 z-40 flex items-center gap-1 rounded-l-xl bg-primary py-3 px-2.5 text-[11px] font-bold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-105"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>비교 {count}</span>
            </motion.button>
          ) : (
            <motion.div
              key="compare-dock"
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              style={{ y: '-50%' }}
              className="fixed right-4 top-1/2 z-40 w-[28rem] max-w-[calc(100vw-2rem)]"
            >
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="정책 비교 접기"
                className="absolute -left-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <ComparePanelPresenter
                comparingPolicies={comparingPolicies}
                onOpenDetail={() => setShowDetailDialog(true)}
                onRemove={removeCompare}
                onClear={clearCompare}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* 상세 비교 모달은 독(transform 컨테이너) 밖에서 렌더해 검색 페이지와 동일한 화면 중앙 모달로 통일한다. */}
      <AnimatePresence>
        {showDetailDialog && count >= 2 && (
          <CompareDetailDialog
            policies={comparisonPolicies}
            isLoading={comparisonQuery.isLoading}
            isError={isComparisonError}
            errorMessage={comparisonErrorMessage}
            onRetry={() => {
              // isValidRequest가 false면 refetch()를 호출해도 실제로는 성공할 수 없는 요청이라
              // (enabled와 무관하게 강제 실행되는) refetch를 아예 호출하지 않는다.
              if (comparisonQuery.isValidRequest) comparisonQuery.refetch();
            }}
            onClose={() => setShowDetailDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
