import { useState } from 'react';
import { useNavigate } from 'react-router';

import type { CommunityPostCategory } from '@/entities/community-post';
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

  const canSubmit = category !== null && title.trim() !== '' && content.trim() !== '';

  const handleSubmit = async () => {
    if (!user || category === null || !canSubmit) return;
    const created = await createPost({
      title: title.trim(),
      category,
      content: content.trim(),
      authorName: user.name,
    });
    navigate(buildCommunityDetailPath(created.id));
  };

  return (
    <CommunityPostWriteForm
      category={category}
      title={title}
      content={content}
      onCategoryChange={setCategory}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.community)}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
    />
  );
}
