export type TrackerStatus = '관심' | '준비중' | '신청완료' | '종료';

// 상태 선택지의 단일 출처. 배지 목록, 상태 select, 탭 등 여러 곳에서 이 배열만 참조한다.
export const TRACKER_STATUSES: readonly TrackerStatus[] = ['관심', '준비중', '신청완료', '종료'];

export function isTrackerStatus(value: string): value is TrackerStatus {
  return (TRACKER_STATUSES as readonly string[]).includes(value);
}

export interface TrackerChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface TrackerItem {
  /** 백엔드 PolicyApplication 식별자. 상태·메모·체크리스트 요청에 사용한다. */
  applicationId: number;
  policyId: string;
  /** 정책 자체의 공식 신청 마감일(yyyy-MM-dd). 없으면 빈 문자열 — 개인 마감일은 이 날짜를 넘을 수 없다. */
  policyDeadline: string;
  /** 신청관리 기록이 생성된 날짜(yyyy-MM-dd). */
  createdAt: string;
  status: TrackerStatus;
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}

export type TrackerStatusTab = '전체' | TrackerStatus;
