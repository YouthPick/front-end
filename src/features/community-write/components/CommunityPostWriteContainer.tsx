import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { CommunityPostCategory } from '@/entities/community-post';
import type { Policy } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';

import { useCreateCommunityPost } from '../hooks/useCreateCommunityPost';
import { CommunityPostWriteForm } from './CommunityPostWriteForm';

// 정책 첨부는 정책과 직접 관련된 카테고리에서만 의미가 있어, 그 외 카테고리로 바꾸면 첨부를 비운다.
const POLICY_ATTACHABLE_CATEGORIES: CommunityPostCategory[] = ['정책질문', '정책후기'];

export function CommunityPostWriteContainer() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { createPost, isSubmitting } = useCreateCommunityPost();

  const [category, setCategory] = useState<CommunityPostCategory | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedPolicy, setAttachedPolicy] = useState<Policy | null>(null);

  const canSubmit = category !== null && title.trim() !== '' && content.trim() !== '';

  const handleCategoryChange = (next: CommunityPostCategory) => {
    setCategory(next);
    if (!POLICY_ATTACHABLE_CATEGORIES.includes(next)) {
      setAttachedPolicy(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || category === null || !canSubmit) return;
    try {
      const created = await createPost({
        title: title.trim(),
        category,
        content: content.trim(),
        authorName: user.name,
        attachedPolicy: attachedPolicy
          ? {
              id: attachedPolicy.id,
              title: attachedPolicy.title,
              category: attachedPolicy.category,
              deadline: attachedPolicy.deadline,
            }
          : null,
      });
      navigate(buildCommunityDetailPath(created.id));
    } catch {
      // 실패 토스트는 useCreateCommunityPost의 onError가 표시한다.
    }
  };

  return (
    <CommunityPostWriteForm
      category={category}
      title={title}
      content={content}
      attachedPolicy={attachedPolicy}
      onCategoryChange={handleCategoryChange}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onAttachPolicy={setAttachedPolicy}
      onRemoveAttachedPolicy={() => setAttachedPolicy(null)}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.community)}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
    />
  );
}
