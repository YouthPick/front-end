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
import { ErrorState, Skeleton, useToast } from '@/shared/ui';

import { useCreateCommunityPost } from '../hooks/useCreateCommunityPost';
import { resolveEditPostAccess } from '../model/editPostAccess';
import { CommunityPostWriteForm } from './CommunityPostWriteForm';

interface CommunityPostWriteContainerProps {
  postId?: string;
}

export function CommunityPostWriteContainer({ postId }: CommunityPostWriteContainerProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { createPost, updatePost, isSubmitting } = useCreateCommunityPost();
  const {
    data: existingPost,
    isLoading,
    isError,
    error,
    refetch,
  } = useCommunityPostQuery(postId ?? '', {
    enabled: postId !== undefined,
  });
  const { data: existingPolicy } = usePolicyDetailQuery(existingPost?.policyId ?? null);

  const access = resolveEditPostAccess({
    isEditMode: postId !== undefined,
    isLoading,
    isError,
    error,
    post: existingPost,
    currentUserId: user?.id,
  });

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

  // 작성자가 아니거나 게시글이 없으면 폼을 보여주지 않고 안내 후 리다이렉트한다.
  useEffect(() => {
    if (access === 'forbidden') {
      showToast('작성자만 수정할 수 있습니다.', 'warning');
      navigate(postId ? buildCommunityDetailPath(postId) : ROUTES.community, { replace: true });
      return;
    }
    if (access === 'not-found') {
      showToast('존재하지 않거나 삭제된 게시글입니다.', 'warning');
      navigate(ROUTES.community, { replace: true });
    }
  }, [access, navigate, postId, showToast]);

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

  // 수정 모드 로딩 중(그리고 리다이렉트 직전)에는 빈 폼 대신 스켈레톤을 보여준다(rules §10).
  if (access === 'loading' || access === 'forbidden' || access === 'not-found') {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (access === 'error') {
    return <ErrorState title="게시글을 불러오지 못했습니다" onRetry={() => refetch()} />;
  }

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
