import Image from '@tiptap/extension-image';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadFile } from '@/shared/api/fileApi';

interface RichTextEditorProps {
  id?: string;
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  id,
  content,
  onChange,
  placeholder = '내용을 입력해 주세요...',
  disabled = false,
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled && !isUploading,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUploadClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // 이미지 파일인지 가볍게 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);
      editor.setEditable(false);

      const response = await uploadFile(file);

      // 에디터에 이미지 삽입
      editor.chain().focus().setImage({ src: response.url, alt: response.filename }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
      editor.setEditable(true);
      // input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isHeadingActive = (level: 1 | 2) => editor.isActive('heading', { level });

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border bg-white transition-all focus-within:border-primary ${
        disabled ? 'opacity-65 pointer-events-none' : 'border-slate-200'
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/50 p-2 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('bold') ? 'bg-slate-150 text-primary font-bold' : 'text-slate-500'
          }`}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('italic') ? 'bg-slate-150 text-primary' : 'text-slate-500'
          }`}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('strike') ? 'bg-slate-150 text-primary' : 'text-slate-500'
          }`}
          title="취소선"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            isHeadingActive(1) ? 'bg-slate-150 text-primary font-bold' : 'text-slate-500'
          }`}
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            isHeadingActive(2) ? 'bg-slate-150 text-primary font-bold' : 'text-slate-500'
          }`}
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('bulletList') ? 'bg-slate-150 text-primary' : 'text-slate-500'
          }`}
          title="글머리 기호"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('orderedList') ? 'bg-slate-150 text-primary' : 'text-slate-500'
          }`}
          title="번호 매기기"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 hover:text-slate-900 ${
            editor.isActive('blockquote') ? 'bg-slate-150 text-primary' : 'text-slate-500'
          }`}
          title="인용구"
        >
          <Quote className="h-4 w-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={handleImageUploadClick}
          disabled={isUploading}
          className={`p-1.5 rounded-lg transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 ${
            isUploading ? 'bg-slate-100 opacity-60' : ''
          }`}
          title="이미지 추가"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
          title="실행 취소"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
          title="다시 실행"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[250px] p-4 text-xs leading-relaxed outline-none">
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 pointer-events-none text-slate-400 select-none">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} className="prose max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
