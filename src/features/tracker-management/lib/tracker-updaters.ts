import type { TrackerItem } from "@entities/tracker";
import { createChecklistItem } from "./tracker-factory";

export function updateTrackerMemo(trackers: TrackerItem[], policyId: string, memo: string): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId ? { ...tracker, memo } : tracker,
  );
}

export function addTrackerChecklistItem(trackers: TrackerItem[], policyId: string, text: string): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId
      ? { ...tracker, checklist: [...tracker.checklist, createChecklistItem(text)] }
      : tracker,
  );
}

export function toggleTrackerChecklistItem(trackers: TrackerItem[], policyId: string, itemId: string): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId
      ? {
          ...tracker,
          checklist: tracker.checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item,
          ),
        }
      : tracker,
  );
}

export function deleteTrackerChecklistItem(trackers: TrackerItem[], policyId: string, itemId: string): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId
      ? { ...tracker, checklist: tracker.checklist.filter((item) => item.id !== itemId) }
      : tracker,
  );
}

export function updateTrackerStatus(
  trackers: TrackerItem[],
  policyId: string,
  status: TrackerItem["status"],
): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId ? { ...tracker, status } : tracker,
  );
}

export function updateTrackerTargetDate(trackers: TrackerItem[], policyId: string, targetDate: string): TrackerItem[] {
  return trackers.map((tracker) =>
    tracker.policyId === policyId ? { ...tracker, targetDate } : tracker,
  );
}

export function deleteTracker(trackers: TrackerItem[], policyId: string): TrackerItem[] {
  return trackers.filter((tracker) => tracker.policyId !== policyId);
}
