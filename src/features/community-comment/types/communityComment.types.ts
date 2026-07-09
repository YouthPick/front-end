export interface CommunityComment {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
}
