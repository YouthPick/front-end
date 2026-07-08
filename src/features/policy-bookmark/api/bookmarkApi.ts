import { MOCK_API_DELAY_MS } from "@/shared/constants";
import { delay } from "@/shared/utils";

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let savedPolicyIds: string[] = ["p1", "p2", "p5", "p_missing"];

export async function fetchBookmarkedPolicyIds(): Promise<string[]> {
  await delay(MOCK_API_DELAY_MS);
  return [...savedPolicyIds];
}

export async function toggleBookmark(policyId: string): Promise<{ saved: boolean }> {
  await delay(MOCK_API_DELAY_MS);
  if (savedPolicyIds.includes(policyId)) {
    savedPolicyIds = savedPolicyIds.filter((id) => id !== policyId);
    return { saved: false };
  }
  savedPolicyIds = [...savedPolicyIds, policyId];
  return { saved: true };
}
