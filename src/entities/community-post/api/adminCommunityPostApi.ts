import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type {
  AdminAttachmentDto,
  AdminCommunityCommentDto,
  AdminCommunityPostDto,
} from './adminCommunityPost.dto';

export interface AdminCommunityPostSearchParams extends PageParams {
  category?: string;
  authorId?: string;
  // "YYYY-MM-DD". 작성일(createdAt)이 이 범위 안에 있는 게시글만 조회한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchAdminCommunityPosts(
  params: AdminCommunityPostSearchParams,
): Promise<PageResult<AdminCommunityPostDto>> {
  const response = await apiClient.get<ApiPageEnvelope<AdminCommunityPostDto>>(
    '/v1/admin/community-posts',
    { params },
  );
  return toPageResult(response.data, params.pageSize);
}

export async function fetchAdminCommunityComments(
  postId: string,
): Promise<AdminCommunityCommentDto[]> {
  const response = await apiClient.get<{ data: AdminCommunityCommentDto[] }>(
    `/v1/admin/community-posts/${postId}/comments`,
  );
  return response.data.data;
}

export async function fetchAdminCommunityAttachments(
  postId: string,
): Promise<AdminAttachmentDto[]> {
  const response = await apiClient.get<{ data: AdminAttachmentDto[] }>(
    `/v1/admin/community-posts/${postId}/attachments`,
  );
  return response.data.data;
}

export async function softDeleteAdminCommunityPost(postId: string): Promise<AdminCommunityPostDto> {
  const response = await apiClient.delete<{ data: AdminCommunityPostDto }>(
    `/v1/admin/community-posts/${postId}`,
  );
  return response.data.data;
}

export async function softDeleteAdminCommunityComment(
  commentId: string,
): Promise<AdminCommunityCommentDto> {
  const response = await apiClient.delete<{ data: AdminCommunityCommentDto }>(
    `/v1/admin/community-comments/${commentId}`,
  );
  return response.data.data;
}
