import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  type CommunityPostSearchParams,
  fetchCommunityPost,
  searchCommunityPosts,
} from '../api/communityPostApi';
import { mapCommunityPostDtosToPosts, mapCommunityPostDtoToPost } from './communityPostMapper';

export const communityPostKeys = {
  all: ['community-posts'] as const,
  list: (params: CommunityPostSearchParams) => ['community-posts', 'list', params] as const,
  detail: (postId: string) => ['community-posts', 'detail', postId] as const,
};

export function useCommunityPostSearchQuery(
  params: CommunityPostSearchParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: communityPostKeys.list(params),
    queryFn: async () => mapCommunityPostDtosToPosts(await searchCommunityPosts(params)),
    // 파라미터 변경 시 이전 결과를 유지해 스켈레톤 flash와 '총 0건' 깜빡임을 막는다.
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useCommunityPostQuery(postId: string) {
  return useQuery({
    queryKey: communityPostKeys.detail(postId),
    queryFn: async () => {
      const dto = await fetchCommunityPost(postId);
      return dto ? mapCommunityPostDtoToPost(dto) : null;
    },
  });
}
