import { useState } from 'react';
import { useNavigate } from 'react-router';

import { type CommunityPostCategory, isPolicyAttachableCategory } from '@/entities/community-post';
import type { Policy } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';

import { useCreateCommunityPost } from '../hooks/useCreateCommunityPost';
import { CommunityPostWriteForm } from './CommunityPostWriteForm';

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
    if (!isPolicyAttachableCategory(next)) {
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
        authorId: user.id,
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
