export type PolicyCategory = "일자리" | "주거" | "교육" | "복지문화" | "참여권리";

export interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  region: string;
  tag: "HIGH" | "추천" | "NEW" | "마감임박";
  description: string;
  target: string;
  deadline: string;
  logoType: "job" | "home" | "education" | "heart" | "hand";
  details: string[];
  link: string;
  isSourceMissing?: boolean;
}
