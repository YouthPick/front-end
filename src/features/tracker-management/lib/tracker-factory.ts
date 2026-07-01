import type { Policy } from "@entities/policy";
import type { TrackerChecklistItem, TrackerItem } from "@entities/tracker";

function createLocalId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

export function createChecklistItem(text: string): TrackerChecklistItem {
  return {
    id: createLocalId("checklist"),
    text,
    completed: false,
  };
}

export function createTrackerFromPolicy(policy: Policy): TrackerItem {
  return {
    policyId: policy.id,
    policySnapshot: policy,
    status: "준비중",
    targetDate:
      policy.deadline !== "원본확인불가" && policy.deadline !== "상시모집"
        ? policy.deadline
        : "2026-06-30",
    checklist: [
      createChecklistItem("기본 제출 서류 취합"),
      createChecklistItem("공고 상세 자격요건 검증"),
      createChecklistItem("지원서 및 온라인 제출 완료"),
    ],
    memo: "",
  };
}
