import type { Policy } from "@entities/policy";

export interface TrackerChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TrackerItem {
  policyId: string;
  policySnapshot: Policy;
  status: '관심' | '준비중' | '신청완료' | '결과대기' | '종료';
  targetDate: string;
  checklist: TrackerChecklistItem[];
  memo: string;
}
