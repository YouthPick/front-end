export type TrackerStatus = '관심' | '준비중' | '신청완료' | '종료';

export interface TrackerChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TrackerItem {
  policyId: string;
  status: TrackerStatus;
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}

export type TrackerStatusTab = '전체' | TrackerStatus;
