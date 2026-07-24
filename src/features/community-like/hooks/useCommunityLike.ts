import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { type CommunityPost, communityPostKeys } from '@/entities/community-post';
import { useAuthStore } from '@/entities/user';
import { ROUTES } from '@/shared/constants';
import type { PageResult } from '@/shared/types';
import { useToast } from '@/shared/ui';

import { fetchLikedCommunityPostIds, toggleCommunityLike } from '../api/communityLikeApi';

export const communityLikeKeys = {
  all: ['community-likes'] as const,
};

type CommunityPostCache = CommunityPost[] | PageResult<CommunityPost> | CommunityPost | null;

// 게시글 캐시 형태별(목록 배열 / 페이지 결과 / 상세 단건)로 해당 게시글의 likeCount에 delta를 적용한다.
// 좋아요 백엔드가 없어 서버 집계값을 받을 수 없으므로, mock 게시글 배열에 의존하지 않고
// 캐시에 있는 값 기준 ±1로 직접 계산한다(서버 집계와 어긋나면 이후 refetch 시 보정).
function patchLikeCount(
  old: CommunityPostCache | undefined,
  postId: string,
  delta: 1 | -1,
): CommunityPostCache | undefined {
  const apply = (post: CommunityPost): CommunityPost =>
    post.id === postId ? { ...post, likeCount: Math.max(0, post.likeCount + delta) } : post;

  if (!old) return old;
  if (Array.isArray(old)) return old.map(apply);
  if ('items' in old) return { ...old, items: old.items.map(apply) };
  return apply(old);
}

export function useCommunityLike() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  // React Query의 isPending은 다음 렌더에서야 반영되므로, 같은 이벤트 루프의 연속 클릭은 ref로 즉시 차단한다.
  const isTogglingRef = useRef(false);

  const {
    data: likedPostIds = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: communityLikeKeys.all,
    queryFn: fetchLikedCommunityPostIds,
  });

  const likedPostIdSet = useMemo(() => new Set(likedPostIds), [likedPostIds]);

  const toggleMutation = useMutation({
    mutationFn: async (postId: string) => {
      const result = await toggleCommunityLike(postId);
      return { postId, liked: result.liked };
    },
    onSuccess: ({ postId, liked }) => {
      queryClient.invalidateQueries({ queryKey: communityLikeKeys.all });
      // 좋아요 개수만 바뀌었으므로 전체 게시글 쿼리를 refetch하는 대신 캐시를 직접 patch한다.
      queryClient.setQueriesData<CommunityPostCache>({ queryKey: communityPostKeys.all }, (old) =>
        patchLikeCount(old, postId, liked ? 1 : -1),
      );
    },
    onError: () => {
      showToast('좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'warning');
    },
    onSettled: () => {
      isTogglingRef.current = false;
    },
  });

  const isLiked = (postId: string) => likedPostIdSet.has(postId);

  const toggleLike = (postId: string) => {
    if (!isAuthenticated) {
      showToast('로그인이 필요한 기능입니다. 로그인 화면으로 안내합니다.', 'info');
      navigate(ROUTES.login, {
        state: { from: location.pathname + location.search },
        replace: true,
      });
      return;
    }
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;
    toggleMutation.mutate(postId);
  };

  return {
    likedPostIds,
    isLiked,
    toggleLike,
    isLoading,
    isError,
    isToggling: toggleMutation.isPending,
    toggleError: toggleMutation.isError,
    // 좋아요 저장/조회가 아직 백엔드 없이 mock(in-memory) 기반임을 UI에 알린다(rules §8).
    isFallback: true,
    refetch,
  };
}
