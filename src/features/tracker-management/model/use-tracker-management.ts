import { useEffect, useMemo, useState } from "react";

import type { Policy } from "@entities/policy";
import type { TrackerItem } from "@entities/tracker";
import {
  addTrackerChecklistItem,
  deleteTracker,
  deleteTrackerChecklistItem,
  toggleTrackerChecklistItem,
  updateTrackerMemo,
  updateTrackerStatus,
  updateTrackerTargetDate,
} from "../lib/tracker-updaters";
import { createTrackerFromPolicy } from "../lib/tracker-factory";
import { persistTrackerState, restoreTrackerState } from "../lib/tracker-storage";

interface UseTrackerManagementOptions {
  isLoggedIn: boolean;
  onRequireLogin: () => void;
  onToast: (message: string, type: "success" | "info" | "warning") => void;
}

export function useTrackerManagement({
  isLoggedIn,
  onRequireLogin,
  onToast,
}: UseTrackerManagementOptions) {
  const restoredState = useMemo(() => restoreTrackerState(), []);
  const [trackers, setTrackers] = useState<TrackerItem[]>(restoredState.trackers);
  const [selectedTrackerPolicyId, setSelectedTrackerPolicyId] = useState<string | null>(
    restoredState.selectedTrackerPolicyId,
  );
  const [trackerTab, setTrackerTab] = useState<string>(restoredState.trackerTab);
  const [showAddChecklistItem, setShowAddChecklistItem] = useState<boolean>(false);
  const [newChecklistItemText, setNewChecklistItemText] = useState<string>("");
  const [tempMemoText, setTempMemoText] = useState<string>("");
  const [showDeleteTrackerConfirm, setShowDeleteTrackerConfirm] = useState<string | null>(null);

  const activeTrackerItem = useMemo(() => {
    return trackers.find((tracker) => tracker.policyId === selectedTrackerPolicyId) || null;
  }, [trackers, selectedTrackerPolicyId]);

  const activeTrackerPolicy = useMemo(() => {
    if (!activeTrackerItem) return null;
    return activeTrackerItem.policySnapshot;
  }, [activeTrackerItem]);

  useEffect(() => {
    if (
      selectedTrackerPolicyId &&
      !trackers.some((tracker) => tracker.policyId === selectedTrackerPolicyId)
    ) {
      setSelectedTrackerPolicyId(null);
    }
  }, [trackers, selectedTrackerPolicyId]);

  useEffect(() => {
    persistTrackerState({
      trackers,
      selectedTrackerPolicyId,
      trackerTab,
    });
  }, [trackers, selectedTrackerPolicyId, trackerTab]);

  useEffect(() => {
    if (activeTrackerItem) {
      setTempMemoText(activeTrackerItem.memo);
    }
  }, [selectedTrackerPolicyId, activeTrackerItem]);

  const startTracker = (policy: Policy) => {
    if (!isLoggedIn) {
      onRequireLogin();
      onToast("신청관리 일정 추가를 위해 먼저 로그인해 주세요.", "info");
      return;
    }

    const exists = trackers.find((tracker) => tracker.policyId === policy.id);
    if (exists) {
      setSelectedTrackerPolicyId(policy.id);
      onToast("이미 등록된 신청 정보가 존재하여, 관리 상세로 연결되었습니다.", "info");
      return;
    }

    const newTracker = createTrackerFromPolicy(policy);
    setTrackers((prev) => [...prev, newTracker]);
    setSelectedTrackerPolicyId(policy.id);
    onToast(`🎉 '${policy.title}' 신청관리 상태가 새로 시작되었습니다!`, "success");
  };

  const saveMemo = () => {
    if (!selectedTrackerPolicyId) return;
    setTrackers((prev) => updateTrackerMemo(prev, selectedTrackerPolicyId, tempMemoText));
    onToast("📝 개인 기록 메모가 성공적으로 저장되었습니다.", "success");
  };

  const addChecklistItem = () => {
    const normalizedText = newChecklistItemText.trim();
    if (normalizedText === "" || !selectedTrackerPolicyId) return;
    setTrackers((prev) => addTrackerChecklistItem(prev, selectedTrackerPolicyId, normalizedText));
    setNewChecklistItemText("");
    setShowAddChecklistItem(false);
    onToast("체크리스트 준비 일감이 추가되었습니다.", "success");
  };

  const toggleChecklistItem = (policyId: string, itemId: string) => {
    setTrackers((prev) => toggleTrackerChecklistItem(prev, policyId, itemId));
  };

  const removeChecklistItem = (policyId: string, itemId: string) => {
    setTrackers((prev) => deleteTrackerChecklistItem(prev, policyId, itemId));
    onToast("준비할 일감이 삭제되었습니다.", "info");
  };

  const changeTrackerStatus = (policyId: string, status: TrackerItem["status"]) => {
    setTrackers((prev) => updateTrackerStatus(prev, policyId, status));
    onToast(`신청관리 상태가 [${status}]로 갱신되었습니다.`, "success");
  };

  const changeTrackerDate = (policyId: string, date: string) => {
    setTrackers((prev) => updateTrackerTargetDate(prev, policyId, date));
    onToast(`제출 마감일정이 변경되었습니다: ${date}`, "info");
  };

  const removeTracker = (policyId: string) => {
    setTrackers((prev) => deleteTracker(prev, policyId));
    setSelectedTrackerPolicyId(null);
    setShowDeleteTrackerConfirm(null);
    onToast("신청관리 목록에서 안전하게 삭제되었습니다.", "warning");
  };

  const openAddChecklistItem = () => setShowAddChecklistItem(true);

  const cancelAddChecklistItem = () => {
    setShowAddChecklistItem(false);
    setNewChecklistItemText("");
  };

  const requestDeleteTracker = (policyId: string) => setShowDeleteTrackerConfirm(policyId);
  const cancelDeleteTracker = () => setShowDeleteTrackerConfirm(null);

  return {
    trackers,
    selectedTrackerPolicyId,
    trackerTab,
    showAddChecklistItem,
    newChecklistItemText,
    tempMemoText,
    showDeleteTrackerConfirm,
    activeTrackerItem,
    activeTrackerPolicy,
    setTrackerTab,
    setSelectedTrackerPolicyId,
    setNewChecklistItemText,
    setTempMemoText,
    startTracker,
    saveMemo,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    changeTrackerStatus,
    changeTrackerDate,
    removeTracker,
    openAddChecklistItem,
    cancelAddChecklistItem,
    requestDeleteTracker,
    cancelDeleteTracker,
  };
}
