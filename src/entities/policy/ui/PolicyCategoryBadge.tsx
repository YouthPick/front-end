import { getPolicyCategoryBadgeClasses } from '@/shared/utils';

import type { PolicyCategory } from '../model/policy.types';

export { getPolicyCategoryBadgeClasses };

interface PolicyCategoryBadgeProps {
  category: PolicyCategory;
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
