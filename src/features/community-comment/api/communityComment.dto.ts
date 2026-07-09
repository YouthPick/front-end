export interface CommunityCommentDto {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}
