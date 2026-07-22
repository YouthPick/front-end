import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  type CommunityPostPageSearchParams,
  fetchCommunityPost,
  fetchCommunityPosts,
} from '../api/communityPostApi';
import { mapCommunityPostDtosToPosts, mapCommunityPostDtoToPost } from './communityPostMapper';

export const communityPostKeys = {
  all: ['community-posts'] as const,
  page: (params: CommunityPostPageSearchParams) => ['community-posts', 'page', params] as const,
  detail: (postId: string) => ['community-posts', 'detail', postId] as const,
};

// 커뮤니티 메인 목록: 서버 페이지네이션 + 검색어/카테고리/정렬 조회.
export function useCommunityPostPageQuery(
  params: CommunityPostPageSearchParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: communityPostKeys.page(params),
    queryFn: async () => {
      const result = await fetchCommunityPosts(params);
      return { ...result, items: mapCommunityPostDtosToPosts(result.items) };
    },
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useCommunityPostQuery(postId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: communityPostKeys.detail(postId),
    queryFn: async () => {
      const dto = await fetchCommunityPost(postId);
      return dto ? mapCommunityPostDtoToPost(dto) : null;
    },
    enabled: options?.enabled,
  });
}
