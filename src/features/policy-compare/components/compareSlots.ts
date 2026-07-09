// 비교 슬롯별 라벨과 강조색(제목 텍스트 색으로 열을 구분한다). 카테고리 뱃지는 정책 원래 카테고리 색을 그대로 쓴다.
// 배열 길이가 지원 가능한 최대 슬롯 수이며, 실제 노출 수는 MAX_COMPARE_COUNT로 slice 한다.
export interface CompareSlotStyle {
  label: string;
  title: string;
}

export const COMPARE_SLOTS: CompareSlotStyle[] = [
  { label: '정책 1 선택', title: 'text-primary' },
  { label: '정책 2 선택', title: 'text-blue-600' },
  { label: '정책 3 선택', title: 'text-emerald-600' },
];
