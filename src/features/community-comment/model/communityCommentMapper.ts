import type { CommunityCommentDto } from '../api/communityComment.dto';
import type { CommunityComment } from '../types/communityComment.types';

export function mapCommunityCommentDtoToComment(dto: CommunityCommentDto): CommunityComment {
  return {
    id: dto.id,
    postId: dto.postId,
    parentId: dto.parentId,
    authorName: dto.authorName,
    authorEmail: dto.authorEmail,
    content: dto.content,
    createdAt: dto.createdAt,
  };
}

export function mapCommunityCommentDtosToComments(dtos: CommunityCommentDto[]): CommunityComment[] {
  return dtos.map(mapCommunityCommentDtoToComment);
}
