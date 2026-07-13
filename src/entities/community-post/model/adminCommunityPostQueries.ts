import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import {
  type AdminCommunityPostSearchParams,
  fetchAdminCommunityAttachments,
  fetchAdminCommunityComments,
  fetchAdminCommunityPosts,
  softDeleteAdminCommunityComment,
  softDeleteAdminCommunityPost,
} from '../api/adminCommunityPostApi';
import type { AdminCommunityPost } from './adminCommunityPost.types';
import {
  mapAdminAttachmentDtoToAdminAttachment,
  mapAdminCommunityCommentDtoToAdminCommunityComment,
  mapAdminCommunityPostDtoToAdminCommunityPost,
} from './adminCommunityPostMapper';

export const adminCommunityPostKeys = {
  all: ['admin', 'community-posts'] as const,
  list: (params: AdminCommunityPostSearchParams) =>
    ['admin', 'community-posts', 'list', params] as const,
  comments: (postId: string) => ['admin', 'community-posts', 'comments', postId] as const,
  attachments: (postId: string) => ['admin', 'community-posts', 'attachments', postId] as const,
};

export function useAdminCommunityPostsQuery(params: AdminCommunityPostSearchParams) {
  return useQuery({
    queryKey: adminCommunityPostKeys.list(params),
    queryFn: async (): Promise<PageResult<AdminCommunityPost>> => {
      const pageDto = await fetchAdminCommunityPosts(params);
      return { ...pageDto, items: pageDto.items.map(mapAdminCommunityPostDtoToAdminCommunityPost) };
    },
    placeholderData: keepPreviousData,
  });
}

export function useAdminCommunityCommentsQuery(postId: string | null) {
  return useQuery({
    queryKey: adminCommunityPostKeys.comments(postId ?? ''),
    queryFn: async () => {
      if (!postId) return [];
      const dtos = await fetchAdminCommunityComments(postId);
      return dtos.map(mapAdminCommunityCommentDtoToAdminCommunityComment);
    },
    enabled: postId !== null,
  });
}

export function useAdminCommunityAttachmentsQuery(postId: string | null) {
  return useQuery({
    queryKey: adminCommunityPostKeys.attachments(postId ?? ''),
    queryFn: async () => {
      if (!postId) return [];
      const dtos = await fetchAdminCommunityAttachments(postId);
      return dtos.map(mapAdminAttachmentDtoToAdminAttachment);
    },
    enabled: postId !== null,
  });
}

export function useSoftDeleteAdminCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => softDeleteAdminCommunityPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCommunityPostKeys.all });
    },
  });
}

export function useSoftDeleteAdminCommunityCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      softDeleteAdminCommunityComment(commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminCommunityPostKeys.comments(variables.postId),
      });
    },
  });
}
