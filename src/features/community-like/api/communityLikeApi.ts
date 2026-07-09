import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let likedPostIds: string[] = ['cp2', 'cp5'];

export async function fetchLikedCommunityPostIds(): Promise<string[]> {
  await delay(MOCK_API_DELAY_MS);
  return [...likedPostIds];
}

export async function toggleCommunityLike(postId: string): Promise<{ liked: boolean }> {
  await delay(MOCK_API_DELAY_MS);
  if (likedPostIds.includes(postId)) {
    likedPostIds = likedPostIds.filter((id) => id !== postId);
    return { liked: false };
  }
  likedPostIds = [...likedPostIds, postId];
  return { liked: true };
}
