// 비교 슬롯별 라벨과 강조색. Presenter의 배지와 상세 다이얼로그의 제목 색을 함께 맞춘다.
// 배열 길이가 지원 가능한 최대 슬롯 수이며, 실제 노출 수는 MAX_COMPARE_COUNT로 slice 한다.
export interface CompareSlotStyle {
  label: string;
  badge: string;
  title: string;
}

export const COMPARE_SLOTS: CompareSlotStyle[] = [
  {
    label: '정책 1 선택',
    badge: 'bg-primary/10 text-primary border border-primary/20',
    title: 'text-primary',
  },
  {
    label: '정책 2 선택',
    badge: 'bg-blue-50 text-blue-600 border border-blue-100',
    title: 'text-blue-600',
  },
  {
    label: '정책 3 선택',
    badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    title: 'text-emerald-600',
  },
];
