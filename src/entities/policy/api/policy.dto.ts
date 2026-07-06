export interface PolicyDto {
  id: string;
  title: string;
  category: string;
  region: string;
  tag: string;
  description: string;
  target: string;
  deadline: string;
  logoType: string;
  details: string[];
  link: string;
  isSourceMissing?: boolean;
}

export interface RecentlyViewedPolicyDto {
  id: string;
  category: string;
  title: string;
  date: string;
}
