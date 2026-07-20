import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  type CommunityPostCategory,
  isPolicyAttachableCategory,
  useCommunityPostQuery,
} from '@/entities/community-post';
import { type Policy, usePolicyDetailQuery } from '@/entities/policy';
import { useAuthStore } from '@/entities/user';
import { buildCommunityDetailPath, ROUTES } from '@/shared/constants';

import { useCreateCommunityPost } from '../hooks/useCreateCommunityPost';
import { CommunityPostWriteForm } from './CommunityPostWriteForm';

interface CommunityPostWriteContainerProps {
  postId?: string;
}

export function CommunityPostWriteContainer({ postId }: CommunityPostWriteContainerProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { createPost, updatePost, isSubmitting } = useCreateCommunityPost();
  const { data: existingPost } = useCommunityPostQuery(postId ?? '', {
    enabled: postId !== undefined,
  });
  const { data: existingPolicy } = usePolicyDetailQuery(existingPost?.policyId ?? null);

  const [category, setCategory] = useState<CommunityPostCategory | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedPolicy, setAttachedPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    if (!existingPost) return;
    setCategory(existingPost.category);
    setTitle(existingPost.title);
    setContent(existingPost.content);
  }, [existingPost]);

  useEffect(() => {
    if (existingPolicy) setAttachedPolicy(existingPolicy);
  }, [existingPolicy]);

  const isContentEmpty = (html: string) => {
    const clean = html.replace(/<[^>]*>/g, '').trim();
    const hasImage = /<img[^>]*>/.test(html);
    return clean === '' && !hasImage;
  };

  const needsPolicy = category !== null && isPolicyAttachableCategory(category);
  const canSubmit =
    category !== null &&
    title.trim() !== '' &&
    content.trim() !== '' &&
    !isContentEmpty(content) &&
    (!needsPolicy || attachedPolicy !== null);

  const handleCategoryChange = (next: CommunityPostCategory) => {
    setCategory(next);
    if (!isPolicyAttachableCategory(next)) {
      setAttachedPolicy(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || category === null || !canSubmit) return;
    const params = {
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
    };

    try {
      const saved = postId ? await updatePost({ postId, params }) : await createPost(params);
      navigate(buildCommunityDetailPath(saved.id));
    } catch {
      // 실패 토스트는 mutation hook이 표시한다.
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
      onCancel={() => navigate(postId ? buildCommunityDetailPath(postId) : ROUTES.community)}
      isSubmitting={isSubmitting}
      canSubmit={canSubmit}
      submitLabel={postId ? '수정하기' : '등록하기'}
    />
  );
}
