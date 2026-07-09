export interface CommunityCommentDto {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
}
