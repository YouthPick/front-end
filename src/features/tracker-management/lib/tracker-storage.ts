import type { TrackerItem } from "@entities/tracker";

const TRACKER_STORAGE_KEY = "youthpick:tracker-management:v1";
const TRACKER_STORAGE_VERSION = 1;

export interface StoredTrackerState {
  version: number;
  trackers: TrackerItem[];
  selectedTrackerPolicyId: string | null;
  trackerTab: string;
}

export interface TrackerStorageState {
  trackers: TrackerItem[];
  selectedTrackerPolicyId: string | null;
  trackerTab: string;
}

function emptyTrackerState(): TrackerStorageState {
  return {
    trackers: [],
    selectedTrackerPolicyId: null,
    trackerTab: "전체",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isChecklistItem(value: unknown): value is TrackerItem["checklist"][number] {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.completed === "boolean"
  );
}

function isPolicySnapshot(value: unknown): value is TrackerItem["policySnapshot"] {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    typeof value.region === "string" &&
    typeof value.description === "string"
  );
}

function isTrackerItem(value: unknown): value is TrackerItem {
  return (
    isRecord(value) &&
    typeof value.policyId === "string" &&
    isPolicySnapshot(value.policySnapshot) &&
    typeof value.status === "string" &&
    typeof value.targetDate === "string" &&
    Array.isArray(value.checklist) &&
    value.checklist.every(isChecklistItem) &&
    typeof value.memo === "string"
  );
}

function normalizeSelection(
  trackers: TrackerItem[],
  selectedTrackerPolicyId: string | null,
): string | null {
  if (!selectedTrackerPolicyId) return null;
  return trackers.some((tracker) => tracker.policyId === selectedTrackerPolicyId)
    ? selectedTrackerPolicyId
    : null;
}

function normalizeStoredState(value: unknown): TrackerStorageState | null {
  if (!isRecord(value)) return null;
  if (value.version !== TRACKER_STORAGE_VERSION) return null;
  if (!Array.isArray(value.trackers) || !value.trackers.every(isTrackerItem)) return null;

  const trackers = value.trackers;
  const selectedTrackerPolicyId =
    typeof value.selectedTrackerPolicyId === "string" ? value.selectedTrackerPolicyId : null;
  const trackerTab =
    typeof value.trackerTab === "string" && value.trackerTab.trim() !== ""
      ? value.trackerTab
      : "전체";

  return {
    trackers,
    selectedTrackerPolicyId: normalizeSelection(trackers, selectedTrackerPolicyId),
    trackerTab,
  };
}

export function restoreTrackerState(): TrackerStorageState {
  if (typeof window === "undefined") {
    return emptyTrackerState();
  }

  try {
    const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) {
      return emptyTrackerState();
    }

    const parsed = JSON.parse(raw) as unknown;
    return normalizeStoredState(parsed) ?? emptyTrackerState();
  } catch {
    return emptyTrackerState();
  }
}

export function persistTrackerState(state: TrackerStorageState): void {
  if (typeof window === "undefined") return;

  try {
    const payload: StoredTrackerState = {
      version: TRACKER_STORAGE_VERSION,
      trackers: state.trackers,
      selectedTrackerPolicyId: normalizeSelection(state.trackers, state.selectedTrackerPolicyId),
      trackerTab: state.trackerTab,
    };
    window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable in private browsing or restricted environments.
  }
}

export function clearTrackerState(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(TRACKER_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
