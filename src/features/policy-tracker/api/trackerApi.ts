import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay, generateId, toIsoDateString } from '@/shared/utils';

import type { TrackerItem, TrackerStatus } from '../types/tracker.types';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

const DEFAULT_TARGET_DATE = '2026-06-30';

let trackers: TrackerItem[] = [];

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
