import { COMMUNITY_POST_CATEGORIES, type CommunityPostCategory } from '@/entities/community-post';

interface CommunityPostWriteFormProps {
  category: CommunityPostCategory | null;
  title: string;
  content: string;
  onCategoryChange: (category: CommunityPostCategory) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function CommunityPostWriteForm({
  category,
  title,
  content,
  onCategoryChange,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
  isSubmitting,
  canSubmit,
}: CommunityPostWriteFormProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-600">카테고리</span>
        <div className="flex flex-wrap gap-1.5">
          {COMMUNITY_POST_CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onCategoryChange(option)}
              aria-pressed={category === option}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                category === option
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200/85'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="community-write-title" className="block text-xs font-bold text-slate-600">
          제목
        </label>
        <input
          id="community-write-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력해 주세요"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="community-write-content" className="block text-xs font-bold text-slate-600">
          내용
        </label>
        <textarea
          id="community-write-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="내용을 입력해 주세요"
          rows={10}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed transition-colors focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:brightness-105 disabled:opacity-40 disabled:hover:brightness-100"
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
