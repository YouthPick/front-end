import { ArrowRight, Edit3, Sparkles } from 'lucide-react';

import type { Policy } from '@/entities/policy';
import type { UserProfile } from '@/entities/user';

import type { PolicyRecommendation } from '../types/recommendation.types';
import { RecommendationNotice } from './RecommendationNotice';

const PREVIEW_COUNT = 3;

interface RecommendationPreviewProps {
  userName: string;
  profile: UserProfile;
  recommendations: PolicyRecommendation[];
  isFallback: boolean;
  onEditProfile: () => void;
  onViewAll: () => void;
  onViewDetails: (policy: Policy) => void;
}

export function RecommendationPreview({
  userName,
  profile,
  recommendations,
  isFallback,
  onEditProfile,
  onViewAll,
  onViewDetails,
}: RecommendationPreviewProps) {
  return (
    <section className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center">
            <Sparkles className="h-4.5 w-4.5 text-primary mr-1.5 animate-pulse" />
            <span>{userName}님과 일치 확률이 가장 높은 추천 정책</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            현재 프로필:{' '}
            <span className="font-bold text-primary">
              {profile.region} {profile.subRegion} · {profile.employmentStatus} ·{' '}
              {profile.educationStatus}
            </span>
          </p>
          <RecommendationNotice isFallback={isFallback} className="text-[10px] mt-0.5" />
        </div>
        <button
          type="button"
          onClick={onEditProfile}
          className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Edit3 className="h-3 w-3" />
          <span>프로필 수정</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {recommendations.slice(0, PREVIEW_COUNT).map(({ policy, score }) => (
          <div
            key={policy.id}
            className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:border-primary/30 transition-all hover:bg-white flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  유사도 {score}점
                </span>
                <span className="text-[10px] text-slate-400">{policy.region}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">{policy.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {policy.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">마감 {policy.deadline}</span>
              <button
                type="button"
                onClick={() => onViewDetails(policy)}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                상세보기 →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center space-x-1 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          <span>추천된 맞춤 청년정책 전체 확인하기 ({recommendations.length}건)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}
