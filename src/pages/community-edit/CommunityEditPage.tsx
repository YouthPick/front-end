import { Navigate, useParams } from 'react-router';

import { CommunityPostWriteContainer } from '@/features/community-write';
import { ROUTES } from '@/shared/constants';
import { useSeo } from '@/shared/hooks';

export function CommunityEditPage() {
  useSeo({ title: '게시글 수정', noindex: true });
  const { postId } = useParams<{ postId: string }>();

  if (!postId) {
    return <Navigate to={ROUTES.community} replace />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">
          YouthPick &gt; 커뮤니티 &gt; 글 수정
        </span>
        <h2 className="text-lg font-black text-slate-800">게시글 수정</h2>
      </div>
      <CommunityPostWriteContainer postId={postId} />
    </div>
  );
}
