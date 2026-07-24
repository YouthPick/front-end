import type { CommunityPostCategory } from '../model/communityPost.types';

interface CommunityCategoryBadgeProps {
  category: CommunityPostCategory;
}

export function getCommunityCategoryBadgeClasses(category: CommunityPostCategory): string {
  switch (category) {
    case '정책질문':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case '정책후기':
      return 'bg-teal-50 text-teal-600 border-teal-100';
    default:
      return 'bg-amber-50 text-amber-600 border-amber-100';
  }
}

export function CommunityCategoryBadge({ category }: CommunityCategoryBadgeProps) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getCommunityCategoryBadgeClasses(category)}`}
    >
      {category}
    </span>
  );
}
