// 정책 카테고리(및 온보딩 관심분야처럼 같은 값 체계를 공유하는 문자열)의 배지 색상 매핑.
// entities/policy와 entities/user는 같은 레이어라 서로 import할 수 없어 shared에 둔다.
//
// 표시되는 분류는 6개(PolicyCategory)이므로 5개 실분류에 각각 색을 배정하고, 미분류인 '기타'와
// 알 수 없는 값만 중립색(slate)으로 남긴다. '기타'를 default에 함께 두면 실분류인 '참여·기반'과
// 같은 색으로 보인다(#121). 각 case의 첫 값은 정규화 전 백엔드 원본 표기다.
export function getPolicyCategoryBadgeClasses(category: string): string {
  switch (category) {
    case '일자리':
      return 'bg-primary/10 text-primary border-primary/20';
    case '주거':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case '교육':
    case '교육·직업훈련':
      return 'bg-teal-50 text-teal-600 border-teal-100';
    case '복지·문화':
    case '금융·복지·문화':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    case '참여권리':
    case '참여·기반':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}
