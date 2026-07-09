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

      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-2.5 text-[11px] font-bold text-amber-700"
      >
        임시 작성 화면입니다. 추후 에디터 라이브러리 도입 시 UI가 교체될 예정입니다.
      </div>

      <CommunityPostWriteContainer />
    </div>
  );
}
