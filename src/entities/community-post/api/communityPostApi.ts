import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

import type { CommunityPostDto } from './communityPost.dto';
import { MOCK_COMMUNITY_POST_DTOS } from './communityPostMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface CommunityPostSearchParams {
  query?: string;
  category?: string;
}

function cloneDto(dto: CommunityPostDto): CommunityPostDto {
  return { ...dto };
}

function matchesSearchParams(post: CommunityPostDto, params: CommunityPostSearchParams): boolean {
  const query = params.query?.trim().toLowerCase() ?? '';
  if (query !== '') {
    const matchesQuery =
      post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
    if (!matchesQuery) return false;
  }

  if (params.category && params.category !== '전체' && post.category !== params.category) {
    return false;
  }

  return true;
}

export async function searchCommunityPosts(
  params: CommunityPostSearchParams,
): Promise<CommunityPostDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return MOCK_COMMUNITY_POST_DTOS.filter((post) => matchesSearchParams(post, params)).map(cloneDto);
}

export async function fetchCommunityPost(postId: string): Promise<CommunityPostDto | null> {
  await delay(MOCK_API_DELAY_MS);
  const found = MOCK_COMMUNITY_POST_DTOS.find((post) => post.id === postId);
  return found ? cloneDto(found) : null;
}
