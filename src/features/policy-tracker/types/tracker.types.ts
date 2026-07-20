export type TrackerStatus = '관심' | '준비중' | '신청완료' | '종료';

export interface TrackerChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TrackerItem {
  policyId: string;
  /** 정책 자체의 공식 신청 마감일(yyyy-MM-dd). 없으면 빈 문자열 — 개인 마감일은 이 날짜를 넘을 수 없다. */
  policyDeadline: string;
  status: TrackerStatus;
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}

export type TrackerStatusTab = '전체' | TrackerStatus;
