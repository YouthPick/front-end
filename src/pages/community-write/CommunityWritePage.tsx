import { CommunityPostWriteContainer } from '@/features/community-write';

export function CommunityWritePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">
          YouthPick &gt; 커뮤니티 &gt; 글쓰기
        </span>
        <h2 className="text-lg font-black text-slate-800">게시글 작성</h2>
      </div>

      <CommunityPostWriteContainer />
    </div>
  );
}
