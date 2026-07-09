// 정책 카테고리(및 온보딩 관심분야처럼 같은 값 체계를 공유하는 문자열)의 배지 색상 매핑.
// entities/policy와 entities/user는 같은 레이어라 서로 import할 수 없어 shared에 둔다.
export function getPolicyCategoryBadgeClasses(category: string): string {
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
