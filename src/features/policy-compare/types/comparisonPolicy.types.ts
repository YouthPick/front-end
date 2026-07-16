export interface ComparisonPolicy {
  policyId: number;
  title: string;
  category: string;
  organizationName: string;
  ageRangeText: string;
  incomeText: string;
  additionalQualification: string;
  participationRestriction: string;
  applicationEndDateText: string;
  applicationUrl: string | null;
}
