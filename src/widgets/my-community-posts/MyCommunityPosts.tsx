import { useNavigate } from 'react-router';

import { CommunityPostPreviewList } from '@/entities/community-post';
import { useMyCommunityPosts } from '@/features/community-my-posts';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';

export function MyCommunityPosts() {
  const { posts, isLoading, isError, refetch } = useMyCommunityPosts();
  const navigate = useNavigate();

  return (
    <CommunityPostPreviewList
      title="내가 작성한 글"
      posts={posts}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      emptyMessage="내가 작성한 글 모아보기는 준비 중입니다. 서비스가 준비되면 여기에서 확인할 수 있어요."
      onViewAll={() => navigate(ROUTES.myPosts)}
      onSelectPost={(post) => navigate(buildCommunityDetailPath(post.id))}
      renderTrailing={(post) => (
        <span className="relative z-10 shrink-0 pl-2 text-[10px] font-bold text-slate-400">
          {post.createdAt}
        </span>
      )}
    />
  );
}
