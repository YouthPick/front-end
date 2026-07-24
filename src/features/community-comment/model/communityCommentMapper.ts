import type { CommunityCommentDto } from '../api/communityComment.dto';
import type { CommunityComment } from '../types/communityComment.types';

export function mapCommunityCommentDtoToComment(dto: CommunityCommentDto): CommunityComment {
  return {
    id: String(dto.id),
    parentId: dto.parentId === null ? null : String(dto.parentId),
    authorId: String(dto.authorId),
    authorNickname: dto.authorNickname,
    content: dto.content,
    createdAt: dto.createdAt,
  };
}

export function mapCommunityCommentDtosToComments(dtos: CommunityCommentDto[]): CommunityComment[] {
  return dtos.map(mapCommunityCommentDtoToComment);
}
