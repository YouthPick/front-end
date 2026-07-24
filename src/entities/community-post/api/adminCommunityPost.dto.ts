export interface AdminCommunityPostDto {
  id: string;
  title: string;
  // CommunityPostCategory 값 중 하나(entities/community-post/model/communityCategories 참고).
  category: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  deletedAt: string | null;
}

export interface AdminCommunityCommentDto {
  id: string;
  postId: string;
  parentCommentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface AdminAttachmentDto {
  id: string;
  postId: string;
  fileKey: string;
  fileSize: number;
  createdAt: string;
}
