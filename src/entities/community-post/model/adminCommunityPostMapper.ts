import type {
  AdminAttachmentDto,
  AdminCommunityCommentDto,
  AdminCommunityPostDto,
} from '../api/adminCommunityPost.dto';
import type {
  AdminAttachment,
  AdminCommunityComment,
  AdminCommunityPost,
} from './adminCommunityPost.types';

export function mapAdminCommunityPostDtoToAdminCommunityPost(
  dto: AdminCommunityPostDto,
): AdminCommunityPost {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    content: dto.content,
    authorId: dto.authorId,
    authorName: dto.authorName,
    createdAt: dto.createdAt,
    viewCount: dto.viewCount,
    deletedAt: dto.deletedAt,
  };
}

export function mapAdminCommunityCommentDtoToAdminCommunityComment(
  dto: AdminCommunityCommentDto,
): AdminCommunityComment {
  return {
    id: dto.id,
    postId: dto.postId,
    parentCommentId: dto.parentCommentId,
    authorName: dto.authorName,
    content: dto.content,
    createdAt: dto.createdAt,
    deletedAt: dto.deletedAt,
  };
}

export function mapAdminAttachmentDtoToAdminAttachment(dto: AdminAttachmentDto): AdminAttachment {
  return {
    id: dto.id,
    postId: dto.postId,
    fileKey: dto.fileKey,
    fileSize: dto.fileSize,
    createdAt: dto.createdAt,
  };
}
