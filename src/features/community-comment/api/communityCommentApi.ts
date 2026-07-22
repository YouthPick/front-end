import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay, generateId } from '@/shared/utils';

import type { CommunityCommentDto } from './communityComment.dto';
import { MOCK_COMMUNITY_COMMENT_DTOS } from './communityCommentMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

let comments: CommunityCommentDto[] = [...MOCK_COMMUNITY_COMMENT_DTOS];

function cloneDto(dto: CommunityCommentDto): CommunityCommentDto {
  return { ...dto };
}

export async function fetchCommunityComments(postId: string): Promise<CommunityCommentDto[]> {
  await delay(MOCK_API_DELAY_MS);
  return comments.filter((comment) => comment.postId === postId).map(cloneDto);
}

export interface CreateCommunityCommentParams {
  postId: string;
  parentId: string | null;
  authorName: string;
  authorEmail: string;
  content: string;
}

export async function createCommunityComment(
  params: CreateCommunityCommentParams,
): Promise<CommunityCommentDto> {
  await delay(MOCK_API_DELAY_MS);
  const newComment: CommunityCommentDto = {
    id: generateId(),
    postId: params.postId,
    parentId: params.parentId,
    authorName: params.authorName,
    authorEmail: params.authorEmail,
    content: params.content,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  comments = [...comments, newComment];
  return cloneDto(newComment);
}

export interface UpdateCommunityCommentParams {
  commentId: string;
  content: string;
}

export async function updateCommunityComment(
  params: UpdateCommunityCommentParams,
): Promise<CommunityCommentDto | null> {
  await delay(MOCK_API_DELAY_MS);
  let updated: CommunityCommentDto | null = null;
  comments = comments.map((comment) => {
    if (comment.id !== params.commentId) return comment;
    updated = { ...comment, content: params.content };
    return updated;
  });
  return updated ? cloneDto(updated) : null;
}

export async function deleteCommunityComment(commentId: string): Promise<void> {
  await delay(MOCK_API_DELAY_MS);
  // 대댓글은 부모 댓글과 함께 정리한다.
  comments = comments.filter(
    (comment) => comment.id !== commentId && comment.parentId !== commentId,
  );
}

export async function fetchCommunityCommentCounts(
  postIds: string[],
): Promise<Record<string, number>> {
  await delay(MOCK_API_DELAY_MS);
  const counts: Record<string, number> = {};
  for (const postId of postIds) {
    counts[postId] = comments.filter((c) => c.postId === postId).length;
  }
  return counts;
}
