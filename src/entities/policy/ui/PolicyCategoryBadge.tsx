import type { PolicyCategory } from '../model/policy.types';

interface PolicyCategoryBadgeProps {
  category: PolicyCategory;
}

export function getPolicyCategoryBadgeClasses(category: PolicyCategory): string {
  switch (category) {
    case '일자리':
      return 'bg-primary/10 text-primary border-primary/20';
    case '주거':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case '교육':
      return 'bg-teal-50 text-teal-600 border-teal-100';
    case '복지·문화':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    default:
      return 'bg-amber-50 text-amber-600 border-amber-100';
  }
}

export function PolicyCategoryBadge({ category }: PolicyCategoryBadgeProps) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getPolicyCategoryBadgeClasses(category)}`}
    >
      {category}
    </span>
  );
}
