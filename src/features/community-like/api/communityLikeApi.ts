import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let likedPostIds: string[] = ['cp2', 'cp5', 'cp7', 'cp9', 'cp11', 'cp13', 'cp15'];

export async function fetchLikedCommunityPostIds(): Promise<string[]> {
  await delay(MOCK_API_DELAY_MS);
  return [...likedPostIds];
}

export async function toggleCommunityLike(postId: string): Promise<{ liked: boolean }> {
  // 지연 전에 현재 상태를 읽어, 짧은 시간 내 중복 호출 시 잃어버린 갱신을 방지한다.
  const isCurrentlyLiked = likedPostIds.includes(postId);
  await delay(MOCK_API_DELAY_MS);
  if (isCurrentlyLiked) {
    likedPostIds = likedPostIds.filter((id) => id !== postId);
    return { liked: false };
  }
  likedPostIds = [...likedPostIds, postId];
  return { liked: true };
}
