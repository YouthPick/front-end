export interface CommunityCommentDto {
  id: number;
  parentId: number | null;
  authorId: number;
  authorNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
