import {
  ArrowRight,
  Briefcase,
  Edit3,
  GraduationCap,
  Hand,
  Heart,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";
import { HeroBanner } from "@widgets/home-hero";
import { RecentlyViewed } from "@widgets/recently-viewed";
import { PolicyCard, type Policy } from "@entities/policy";
import type { PolicyReadStatus, UserProfile } from "@entities/user";

interface HomeRecommendedPolicyItem {
  policy: Policy;
  score: number;
}

interface HomePageProps {
  isLoggedIn: boolean;
  userName: string;
  userProfile: UserProfile;
  searchQuery: string;
  serverPolicies: Policy[];
  recommendedPolicies: HomeRecommendedPolicyItem[];
  savedPolicyIds: string[];
  readStatesByPolicyId: Record<string, PolicyReadStatus>;
  comparingPolicies: Policy[];
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  onCategoryClick: (category: string) => void;
  onRequireRecommendationLogin: () => void;
  onNavigateSearch: () => void;
  onNavigateRecommend: () => void;
  onEditProfile: () => void;
  onViewPolicyDetails: (policy: Policy) => void;
  onToggleSave: (policyId: string) => void;
  onToggleCompare: (policy: Policy) => void;
}

export function HomePage({
  isLoggedIn,
  userName,
  userProfile,
  searchQuery,
  serverPolicies,
  recommendedPolicies,
  savedPolicyIds,
  readStatesByPolicyId,
  comparingPolicies,
  onSearchQueryChange,
  onSearchSubmit,
  onCategoryClick,
  onRequireRecommendationLogin,
  onNavigateSearch,
  onNavigateRecommend,
  onEditProfile,
  onViewPolicyDetails,
  onToggleSave,
  onToggleCompare,
}: HomePageProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Custom Hero Banner */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={onSearchQueryChange}
        onSearchSubmit={onSearchSubmit}
      />

      {/* Category Quicklinks Section */}
      <section className="space-y-4" id="category-section">
        <div className="text-left">
          <h3 className="text-sm font-extrabold text-slate-800">청년정책 분야 바로가기</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            원하시는 주요 분야별 정책 카테고리를 눌러 빠르게 상세 필터 탐색을 시작해 보세요.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              key: "일자리",
              title: "일자리",
              subtitle: "취업・창업 지원",
              bg: "bg-primary/10 text-primary hover:bg-primary/20",
              icon: Briefcase,
            },
            {
              key: "주거",
              title: "주거",
              subtitle: "주거・금융 지원",
              bg: "bg-blue-50 text-blue-600 hover:bg-blue-100/50",
              icon: HomeIcon,
            },
            {
              key: "교육",
              title: "교육",
              subtitle: "역량・자기개발",
              bg: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100/50",
              icon: GraduationCap,
            },
            {
              key: "복지문화",
              title: "복지・문화",
              subtitle: "생활・건강・문화",
              bg: "bg-rose-50 text-rose-600 hover:bg-rose-100/50",
              icon: Heart,
            },
            {
              key: "참여권리",
              title: "참여・권리",
              subtitle: "참여・권익 보호",
              bg: "bg-amber-50 text-amber-600 hover:bg-amber-100/50",
              icon: Hand,
            },
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onCategoryClick(item.key)}
                className="flex items-center space-x-3.5 rounded-3xl border border-slate-100 bg-white p-4.5 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer"
                id={`category-card-${item.key}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  <IconComp className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Profile configuration invite / Recommendation Overview Widget */}
      {!isLoggedIn ? (
        <section className="rounded-3xl bg-gradient-to-br from-primary/[0.08] to-brand-secondary/[0.04] border border-primary/20 p-6 sm:p-8 text-left space-y-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
              스마트 맞춤 추천 서비스
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              프로필을 딱 한 번만 입력하고, 나에게 꼭 맞는 청년 정책을 받아보세요!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              거주지역, 연령뿐만 아니라 상세한 취업상태, 학력, 관심 키워드 조건을 대조하여 복잡한
              수령자격을 자동으로 비교 분석해 드립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={onRequireRecommendationLogin}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:brightness-105 active:scale-95 cursor-pointer"
            >
              내 조건에 맞는 정책 추천받기
            </button>
            <button
              onClick={() => onNavigateSearch()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
            >
              일반 정책 전체 탐색
            </button>
          </div>
        </section>
      ) : (
        /* MEMBER HOME-02: LOGGED-IN CUSTOM OVERVIEW */
        <section className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center">
                <Sparkles className="h-4.5 w-4.5 text-primary mr-1.5 animate-pulse" />
                <span>{userName}님과 일치 확률이 가장 높은 추천 정책</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                현재 프로필:{" "}
                <span className="font-bold text-primary">
                  {userProfile.region} {userProfile.subRegion} · {userProfile.employmentStatus} ·{" "}
                  {userProfile.educationStatus}
                </span>
              </p>
            </div>
            <button
              onClick={onEditProfile}
              className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Edit3 className="h-3 w-3" />
              <span>프로필 수정</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recommendedPolicies.length === 0 && (
              <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs font-bold text-slate-400">
                서버 추천 정책이 없습니다. 추천 API 상태를 확인해 주세요.
              </div>
            )}
            {recommendedPolicies.slice(0, 3).map(({ policy, score }) => (
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
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">
                    {policy.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {policy.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">마감 {policy.deadline}</span>
                  <button
                    onClick={() => {
                      void onViewPolicyDetails(policy);
                    }}
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
              onClick={() => onNavigateRecommend()}
              className="inline-flex items-center space-x-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span>추천된 맞춤 청년정책 전체 확인하기 ({recommendedPolicies.length}건)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Recent & Grid Policies Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-slate-800">최근 화제인 신규 정책 소식</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                전국 및 서울 등 청년들이 가장 집중해서 조회하는 핵심 소식입니다.
              </p>
            </div>
            <button
              onClick={() => onNavigateSearch()}
              className="text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              전체보기
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {serverPolicies.length === 0 && (
              <div className="sm:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center text-xs font-bold text-slate-400">
                서버 정책 데이터를 불러오면 이 영역에 최신 정책이 표시됩니다.
              </div>
            )}
            {serverPolicies.slice(0, 4).map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                isSaved={savedPolicyIds.includes(policy.id)}
                readStatus={readStatesByPolicyId[policy.id] ?? "UNREAD"}
                onToggleSave={onToggleSave}
                onViewDetails={onViewPolicyDetails}
                isComparing={comparingPolicies.some((p) => p.id === policy.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>

        {/* Sidebar items */}
        <div className="lg:col-span-4 space-y-6">
          <RecentlyViewed policies={serverPolicies} onViewDetails={onViewPolicyDetails} />
        </div>
      </div>
    </div>
  );
}
