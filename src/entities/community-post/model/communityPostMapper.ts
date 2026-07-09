import type { CommunityPostDto } from '../api/communityPost.dto';
import { normalizeCommunityPostCategory } from './communityCategories';
import type { CommunityPost } from './communityPost.types';

// 카테고리를 식별할 수 없는 DTO는 null을 반환하므로 caller가 걸러낸다.
export function mapCommunityPostDtoToPost(dto: CommunityPostDto): CommunityPost | null {
  const category = normalizeCommunityPostCategory(dto.category);
  if (!category) {
    if (import.meta.env.DEV) {
      console.warn(`알 수 없는 커뮤니티 게시글 카테고리입니다: ${dto.category} (게시글 ${dto.id})`);
    }
    return null;
  }

  return {
    id: dto.id,
    title: dto.title,
    category,
    content: dto.content,
    authorName: dto.authorName,
    createdAt: dto.createdAt,
    viewCount: dto.viewCount,
    commentCount: dto.commentCount,
    likeCount: dto.likeCount,
  };
}

export function mapCommunityPostDtosToPosts(dtos: CommunityPostDto[]): CommunityPost[] {
  return dtos.map(mapCommunityPostDtoToPost).filter((post): post is CommunityPost => post !== null);
}
