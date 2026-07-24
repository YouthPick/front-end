import { Briefcase, GraduationCap, Hand, Heart, Home, type LucideIcon } from 'lucide-react';

import type { PolicyCategory } from '@/entities/policy';

interface CategoryCard {
  key: PolicyCategory;
  title: string;
  subtitle: string;
  bg: string;
  icon: LucideIcon;
}

// key는 POLICY_CATEGORIES(정규화된 실분류 5개)와 일치시킨다. '기타'는 미분류 fallback이라 제외한다.
// bg 색상 계열은 getPolicyCategoryBadgeClasses(shared/utils)의 카테고리별 배지 색과 맞춘다.
const CATEGORY_CARDS = [
  {
    key: '일자리',
    title: '일자리',
    subtitle: '취업・창업 지원',
    bg: 'bg-primary/10 text-primary hover:bg-primary/20',
    icon: Briefcase,
  },
  {
    key: '주거',
    title: '주거',
    subtitle: '주거・생활 안정',
    bg: 'bg-blue-50 text-blue-600 hover:bg-blue-100/50',
    icon: Home,
  },
  {
    key: '교육·직업훈련',
    title: '교육',
    subtitle: '역량・직업훈련',
    bg: 'bg-teal-50 text-teal-600 hover:bg-teal-100/50',
    icon: GraduationCap,
  },
  {
    key: '금융·복지·문화',
    title: '복지・문화',
    subtitle: '금융・건강・문화',
    bg: 'bg-rose-50 text-rose-600 hover:bg-rose-100/50',
    icon: Heart,
  },
  {
    key: '참여·기반',
    title: '참여・기반',
    subtitle: '참여・권익 보호',
    bg: 'bg-amber-50 text-amber-600 hover:bg-amber-100/50',
    icon: Hand,
  },
] satisfies CategoryCard[];

interface CategoryQuickLinksProps {
  onSelectCategory: (category: PolicyCategory) => void;
}

export function CategoryQuickLinks({ onSelectCategory }: CategoryQuickLinksProps) {
  return (
    <section className="space-y-4" id="category-section">
      <div className="text-left">
        <h3 className="text-sm font-extrabold text-slate-800">청년정책 분야 바로가기</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          원하시는 주요 분야별 정책 카테고리를 눌러 빠르게 상세 필터 탐색을 시작해 보세요.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORY_CARDS.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectCategory(item.key)}
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
  );
}
