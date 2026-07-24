export interface CommunityComment {
  id: string;
  parentId: string | null;
  authorId: string;
  authorNickname: string;
  content: string;
  createdAt: string;
}
