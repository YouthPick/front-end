export type TrackerStatus = '관심' | '준비중' | '신청완료' | '종료';

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
  status: TrackerStatus;
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}

export type TrackerStatusTab = '전체' | TrackerStatus;
