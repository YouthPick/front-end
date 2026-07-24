import { apiClient } from '@/shared/api';
import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

import type { CommunityCommentDto } from './communityComment.dto';
import { MOCK_COMMUNITY_COMMENT_COUNTS } from './communityCommentMockData';

export async function fetchCommunityComments(postId: string): Promise<CommunityCommentDto[]> {
  const response = await apiClient.get<{ data: CommunityCommentDto[] }>(
    `/v1/posts/${postId}/comments`,
  );
  return response.data.data;
}

export interface CreateCommunityCommentParams {
  postId: string;
  parentId: string | null;
  content: string;
}

export async function createCommunityComment(
  params: CreateCommunityCommentParams,
): Promise<CommunityCommentDto> {
  const response = await apiClient.post<{ data: CommunityCommentDto }>(
    `/v1/posts/${params.postId}/comments`,
    {
      content: params.content,
      parentId: params.parentId === null ? null : Number(params.parentId),
    },
  );
  return response.data.data;
}

export interface UpdateCommunityCommentParams {
  postId: string;
  commentId: string;
  content: string;
}

export async function updateCommunityComment(
  params: UpdateCommunityCommentParams,
): Promise<CommunityCommentDto> {
  const response = await apiClient.patch<{ data: CommunityCommentDto }>(
    `/v1/posts/${params.postId}/comments/${params.commentId}`,
    { content: params.content },
  );
  return response.data.data;
}

export interface DeleteCommunityCommentParams {
  postId: string;
  commentId: string;
}

export async function deleteCommunityComment(params: DeleteCommunityCommentParams): Promise<void> {
  await apiClient.delete(`/v1/posts/${params.postId}/comments/${params.commentId}`);
}

// 게시글 목록의 댓글 수 배지는 백엔드에 벌크 조회 API가 없어 이 mock으로만 동작한다(별도 이슈 스코프).
export async function fetchCommunityCommentCounts(
  postIds: string[],
): Promise<Record<string, number>> {
  await delay(MOCK_API_DELAY_MS);
  const counts: Record<string, number> = {};
  for (const postId of postIds) {
    counts[postId] = MOCK_COMMUNITY_COMMENT_COUNTS.filter((c) => c.postId === postId).length;
  }
  return counts;
}
