import { delay } from "@/shared/utils";

import type { TrackerItem, TrackerStatus } from "../types/tracker.types";

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.
const MOCK_API_DELAY_MS = 150;

const DEFAULT_TARGET_DATE = "2026-06-30";
const UNKNOWN_DEADLINES = ["원본확인불가", "상시모집"];

let trackers: TrackerItem[] = [
  {
    policyId: "p1",
    status: "준비중",
    targetDate: "2026-06-25",
    checklist: [
      { id: "c1", text: "지원서 작성", completed: true },
      { id: "c2", text: "자기소개서 초안 작성", completed: true },
      { id: "c3", text: "구직상태 확인서 발급", completed: false },
      { id: "c4", text: "최종 제출 완료", completed: false },
    ],
    memo: "교육 일정과 면접 일정이 겹치는지 확인할 것",
  },
  {
    policyId: "p2",
    status: "관심",
    targetDate: "2026-07-10",
    checklist: [
      { id: "c5", text: "주민등록등본 발급", completed: false },
      { id: "c6", text: "임대차계약서 사본 준비", completed: false },
    ],
    memo: "월세 이체 내역 3개월분 미리 출력해두기",
  },
  {
    policyId: "p5",
    status: "결과대기",
    targetDate: "2026-06-20",
    checklist: [
      { id: "c7", text: "서류 업로드", completed: true },
      { id: "c8", text: "심사 대기 확인", completed: true },
    ],
    memo: "결과 발표는 공식 홈페이지 고시 예정",
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
export async function startTracker(policyId: string, deadline: string): Promise<StartTrackerResult> {
  await delay(MOCK_API_DELAY_MS);

  const existing = trackers.find((tracker) => tracker.policyId === policyId);
  if (existing) {
    return { tracker: cloneTracker(existing), created: false };
  }

  const newTracker: TrackerItem = {
    policyId,
    status: "준비중",
    targetDate: UNKNOWN_DEADLINES.includes(deadline) ? DEFAULT_TARGET_DATE : deadline,
    checklist: [
      { id: crypto.randomUUID(), text: "기본 제출 서류 취합", completed: false },
      { id: crypto.randomUUID(), text: "공고 상세 자격요건 검증", completed: false },
      { id: crypto.randomUUID(), text: "지원서 및 온라인 제출 완료", completed: false },
    ],
    memo: "",
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
    checklist: [...tracker.checklist, { id: crypto.randomUUID(), text, completed: false }],
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

export async function saveTrackerMemo(
  policyId: string,
  memo: string,
): Promise<TrackerItem | null> {
  await delay(MOCK_API_DELAY_MS);
  return updateTracker(policyId, (tracker) => ({ ...tracker, memo }));
}

export async function deleteTracker(policyId: string): Promise<void> {
  await delay(MOCK_API_DELAY_MS);
  trackers = trackers.filter((tracker) => tracker.policyId !== policyId);
}
