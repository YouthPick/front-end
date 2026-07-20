// 온보딩 화면에 노출하는 한글 라벨과, 백엔드 제출 시 보낼 코드값을 한 곳에서 짝지어 관리한다.
// 옵션을 추가/변경할 때 라벨과 코드가 따로 노는 것을 막기 위해 Wizard 컴포넌트는 이 목록에서 라벨만 뽑아 쓰고,
// 제출 시에는 codeForLabel로 같은 목록에서 코드를 찾는다.
export interface ProfileOption {
  label: string;
  code: string;
}

export const EMPLOYMENT_STATUS_OPTIONS: ProfileOption[] = [
  { label: '미취업·구직', code: 'UNEMPLOYED' },
  { label: '재직', code: 'EMPLOYED' },
  { label: '자영업', code: 'SELF_EMPLOYED' },
  { label: '프리랜서', code: 'FREELANCER' },
  { label: '창업·창업준비', code: 'STARTUP' },
  { label: '기타', code: 'ETC' },
];

export const EDUCATION_STATUS_OPTIONS: ProfileOption[] = [
  { label: '고졸 미만', code: 'UNDER_HS' },
  { label: '고교 재학', code: 'HS_ENROLLED' },
  { label: '고교 졸업', code: 'HS_GRADUATE' },
  { label: '대학 재학', code: 'UNIV_ENROLLED' },
  { label: '대졸 예정', code: 'UNIV_EXPECTED' },
  { label: '대학 졸업', code: 'UNIV_GRADUATE' },
  { label: '석·박사', code: 'GRAD_SCHOOL' },
  { label: '기타', code: 'ETC' },
];

export const MARITAL_STATUS_OPTIONS: ProfileOption[] = [
  { label: '미혼', code: 'SINGLE' },
  { label: '기혼', code: 'MARRIED' },
];

export const MAJOR_OPTIONS: ProfileOption[] = [
  { label: '인문계열', code: 'HUMANITIES' },
  { label: '사회계열', code: 'SOCIAL_SCIENCE' },
  { label: '상경계열', code: 'BUSINESS_ECONOMICS' },
  { label: '공학계열', code: 'ENGINEERING' },
  { label: '자연계열', code: 'NATURAL_SCIENCE' },
  { label: '예체능계열', code: 'ARTS_PHYSICAL' },
  { label: '기타', code: 'ETC' },
];

export const SPECIAL_CONDITION_OPTIONS: ProfileOption[] = [
  { label: '여성', code: 'WOMEN' },
  { label: '기초생활수급자', code: 'BASIC_LIVELIHOOD' },
  { label: '한부모가정', code: 'SINGLE_PARENT' },
  { label: '장애인', code: 'DISABLED' },
  { label: '농업인', code: 'FARMER' },
  { label: '군인·제대군인', code: 'VETERAN' },
  { label: '지역인재', code: 'REGIONAL_TALENT' },
];

export function codeForLabel(options: ProfileOption[], label: string): string | null {
  return options.find((option) => option.label === label)?.code ?? null;
}
