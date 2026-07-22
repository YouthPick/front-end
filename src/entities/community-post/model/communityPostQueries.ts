import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api';
import {
  type CommunityPostPageSearchParams,
  type CommunityPostSearchParams,
  fetchCommunityPost,
  fetchCommunityPosts,
  searchCommunityPosts,
} from '../api/communityPostApi';
import { mapCommunityPostDtosToPosts, mapCommunityPostDtoToPost } from './communityPostMapper';

export const communityPostKeys = {
  all: ['community-posts'] as const,
  list: (params: CommunityPostSearchParams) => ['community-posts', 'list', params] as const,
  page: (params: CommunityPostPageSearchParams) => ['community-posts', 'page', params] as const,
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
  const query = useQuery({
    queryKey: communityPostKeys.detail(postId),
    queryFn: async () => {
      const dto = await fetchCommunityPost(postId);
      return dto ? mapCommunityPostDtoToPost(dto) : null;
    },
    enabled: options?.enabled,
    // 404(삭제·미존재 게시글)는 재시도해도 영원히 실패하므로 전역 retry: 1 대상에서 제외한다.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
  });

  return {
    ...query,
    // 404는 복구 가능한 오류가 아니라 "존재하지 않는 데이터"(rules §9.1) —
    // 소비처가 재시도 UI 대신 not-found 안내 UI로 분기할 수 있게 별도 플래그로 노출한다.
    isNotFound: query.isError && isNotFoundError(query.error),
  };
}
