import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay, generateId, toIsoDateString } from '@/shared/utils';

import type { TrackerItem, TrackerStatus } from '../types/tracker.types';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

const DEFAULT_TARGET_DATE = '2026-06-30';

let trackers: TrackerItem[] = [
  {
    policyId: 'p1',
    policyDeadline: '2026-06-25',
    status: '준비중',
    targetDate: '2026-06-25',
    checklist: [
      { id: 'c1', text: '지원서 작성', completed: true },
      { id: 'c2', text: '자기소개서 초안 작성', completed: true },
      { id: 'c3', text: '구직상태 확인서 발급', completed: false },
      { id: 'c4', text: '최종 제출 완료', completed: false },
    ],
    memo: '교육 일정과 면접 일정이 겹치는지 확인할 것',
  },
  {
    policyId: 'p2',
    policyDeadline: '2026-07-10',
    status: '관심',
    targetDate: '2026-07-10',
    checklist: [
      { id: 'c5', text: '주민등록등본 발급', completed: false },
      { id: 'c6', text: '임대차계약서 사본 준비', completed: false },
    ],
    memo: '월세 이체 내역 3개월분 미리 출력해두기',
  },
  {
    policyId: 'p5',
    policyDeadline: '2026-06-20',
    status: '신청완료',
    targetDate: '2026-06-20',
    checklist: [
      { id: 'c7', text: '서류 업로드', completed: true },
      { id: 'c8', text: '심사 대기 확인', completed: true },
    ],
    memo: '결과 발표는 공식 홈페이지 고시 예정',
  },
  {
    policyId: 'p3',
    policyDeadline: '2026-07-15',
    status: '준비중',
    targetDate: '2026-07-15',
    checklist: [
      { id: 'c9', text: '수강 신청서 작성', completed: true },
      { id: 'c10', text: '재직/재학 증명서 발급', completed: false },
    ],
    memo: '개강 전까지 훈련장려금 계좌 개설 완료하기',
  },
  {
    policyId: 'p6',
    policyDeadline: '2026-08-01',
    status: '관심',
    targetDate: '2026-08-01',
    checklist: [{ id: 'c11', text: '희망 강좌 목록 조사', completed: false }],
    memo: '',
  },
  {
    policyId: 'p7',
    policyDeadline: '2026-06-30',
    status: '신청완료',
    targetDate: '2026-06-30',
    checklist: [
      { id: 'c12', text: '구직활동 보고서 제출', completed: true },
      { id: 'c13', text: '진로 프로그램 참여 신청', completed: true },
    ],
    memo: '매달 말일까지 보고서 제출 필수',
  },
  {
    policyId: 'p8',
    policyDeadline: '2026-05-15',
    status: '종료',
    targetDate: '2026-05-15',
    checklist: [
      { id: 'c14', text: '가입 신청', completed: true },
      { id: 'c15', text: '첫 회차 저축 이체', completed: true },
    ],
    memo: '3년 만기 예정일 캘린더에 등록해두기',
  },
  {
    policyId: 'p9',
    policyDeadline: '2026-07-01',
    status: '준비중',
    targetDate: '2026-07-01',
    checklist: [{ id: 'c16', text: '만 19세 확인 서류 준비', completed: false }],
    memo: '선착순 마감이라 신청 오픈 시각 확인 필요',
  },
];

function cloneTracker(tracker: TrackerItem): TrackerItem {
  return { ...tracker, checklist: tracker.checklist.map((item) => ({ ...item })) };
}

function updateTracker(
  policyId: string,
  updater: (tracker: TrackerItem) => TrackerItem,
): TrackerItem | null {
  let updated: TrackerItem | null = null;
  trackers = trackers.map((tracker) => {
    if (tracker.policyId !== policyId) return tracker;
    updated = updater(tracker);
    return updated;
  });
  return updated ? cloneTracker(updated) : null;
}

export async function fetchTrackers(): Promise<TrackerItem[]> {
  await delay(MOCK_API_DELAY_MS);
  return trackers.map(cloneTracker);
}

export interface StartTrackerResult {
  tracker: TrackerItem;
  created: boolean;
}

// 이미 등록된 정책이면 기존 항목을 반환한다(중복 생성 방지).
export async function startTracker(
  policyId: string,
  deadline: string,
): Promise<StartTrackerResult> {
  await delay(MOCK_API_DELAY_MS);

  const existing = trackers.find((tracker) => tracker.policyId === policyId);
  if (existing) {
    return { tracker: cloneTracker(existing), created: false };
  }

  const newTracker: TrackerItem = {
    policyId,
    policyDeadline: toIsoDateString(deadline) ?? '',
    status: '준비중',
    targetDate: toIsoDateString(deadline) ?? DEFAULT_TARGET_DATE,
    checklist: [
      { id: generateId(), text: '기본 제출 서류 취합', completed: false },
      { id: generateId(), text: '공고 상세 자격요건 검증', completed: false },
      { id: generateId(), text: '지원서 및 온라인 제출 완료', completed: false },
    ],
    memo: '',
  };
  trackers = [...trackers, newTracker];
  return { tracker: cloneTracker(newTracker), created: true };
}

export async function updateTrackerStatus(
  policyId: string,
  status: TrackerStatus,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({ ...tracker, status }));
}

export async function updateTrackerDate(
  policyId: string,
  targetDate: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({ ...tracker, targetDate }));
}

export async function addChecklistItem(
  policyId: string,
  text: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({
    ...tracker,
    checklist: [...tracker.checklist, { id: generateId(), text, completed: false }],
  }));
}

export async function editChecklistItem(
  policyId: string,
  itemId: string,
  text: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({
    ...tracker,
    checklist: tracker.checklist.map((item) => (item.id === itemId ? { ...item, text } : item)),
  }));
}

export async function toggleChecklistItem(
  policyId: string,
  itemId: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({
    ...tracker,
    checklist: tracker.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item,
    ),
  }));
}

export async function deleteChecklistItem(
  policyId: string,
  itemId: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({
    ...tracker,
    checklist: tracker.checklist.filter((item) => item.id !== itemId),
  }));
}

export async function saveTrackerMemo(policyId: string, memo: string): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({ ...tracker, memo }));
}

export async function deleteTracker(policyId: string): Promise<void> {
  await delay(MOCK_API_DELAY_MS);
  trackers = trackers.filter((tracker) => tracker.policyId !== policyId);
}
