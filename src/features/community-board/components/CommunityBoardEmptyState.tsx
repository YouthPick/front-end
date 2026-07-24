import { EmptyState } from '@/shared/ui';

interface CommunityBoardEmptyStateProps {
  onResetFilters: () => void;
}

export function CommunityBoardEmptyState({ onResetFilters }: CommunityBoardEmptyStateProps) {
  return (
    <EmptyState
      icon="💬"
      title="아직 등록된 게시글이 없습니다"
      description="선택한 카테고리나 검색어에 맞는 글이 없어요. 필터를 초기화하고 다른 조건으로 둘러보세요."
    >
      <button
        type="button"
        onClick={onResetFilters}
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        검색·카테고리 초기화
      </button>
    </EmptyState>
  );
}
