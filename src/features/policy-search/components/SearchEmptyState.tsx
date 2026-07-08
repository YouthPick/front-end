import { EmptyState } from '@/shared/ui';

interface SearchEmptyStateProps {
  onResetAll: () => void;
  onShowNationwide: () => void;
}

export function SearchEmptyState({ onResetAll, onShowNationwide }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon="🔍"
      title="일치하는 검색 결과가 전혀 없습니다"
      description="선택한 시·도 필터 조건이 맞지 않거나, 특정 카테고리에 너무 협소한 연령 조건이 지정되었을 수 있습니다."
    >
      <button
        type="button"
        onClick={onResetAll}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        필터 설정 전체 초기화
      </button>
      <button
        type="button"
        onClick={onShowNationwide}
        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-colors"
      >
        전국 공통 정책 보기
      </button>
    </EmptyState>
  );
}
