import type { Policy } from '@/entities/policy';

export type RecommendationReliability = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PolicyRecommendation {
  policy: Policy;
  score: number;
  reliability: RecommendationReliability;
  reasons: string[];
}
