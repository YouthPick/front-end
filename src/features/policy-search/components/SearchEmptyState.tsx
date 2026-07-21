import { EmptyState } from '@/shared/ui';

interface SearchEmptyStateProps {
  onResetRegion: () => void;
  onResetAll: () => void;
}

// 안내문이 시·도 조건을 원인으로 지목하므로, 기본 액션도 지역만 푼다 — 입력한 검색어와 나머지 필터를
// 살린 채 결과가 나오게 하는 가장 좁은 복구다. 전체 초기화는 검색어까지 지우므로 보조로 둔다.
export function SearchEmptyState({ onResetRegion, onResetAll }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon="🔍"
      title="일치하는 검색 결과가 전혀 없습니다"
      description="선택한 시·도 필터 조건이 맞지 않거나, 특정 카테고리에 너무 협소한 연령 조건이 지정되었을 수 있습니다."
    >
      <button
        type="button"
        onClick={onResetRegion}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-colors"
      >
        지역 조건 해제하고 다시 보기
      </button>
      <button
        type="button"
        onClick={onResetAll}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        필터 전체 초기화
      </button>
    </EmptyState>
  );
}
