import { Search, Home, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import youthPurpleIllustration from "@/assets/images/youth_purple_illustration_1782457991844.jpg";

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearchSubmit: () => void;
}

export default function HeroBanner({ searchQuery, setSearchQuery, onSearchSubmit }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-[#F1F5F9]/30 py-10 lg:py-14 border-b border-slate-100">
      {/* Background soft circles and shapes as seen in screenshot */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="absolute right-[30%] top-[-10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute left-[10%] bottom-[-10%] h-72 w-72 rounded-full bg-brand-secondary/10 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          
          {/* Left Text and Search (5 columns) */}
          <div className="space-y-6 lg:col-span-5 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl lg:text-4.5xl leading-tight">
                나에게 맞는 <br />
                <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">청년정책</span>을 찾아보세요
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                지역, 생활 상태, 관심사에 맞는 정책을 쉽고 빠르게 찾아드립니다.
              </p>
            </motion.div>

            {/* Custom styled large search box matching screenshot */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex max-w-md items-center rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-md shadow-slate-100 focus-within:ring-2 focus-within:ring-primary/15"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="정책명 또는 키워드를 입력하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                  className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  id="hero-search-input"
                />
              </div>
              <button
                onClick={onSearchSubmit}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-all hover:brightness-105 active:scale-[0.98]"
                id="hero-search-button"
              >
                검색
              </button>
            </motion.div>
          </div>

          {/* Expanded Illustration */}
          <div className="hidden lg:block lg:col-span-7 h-72 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-gradient-to-tr from-primary/10 to-brand-secondary/10 flex items-center justify-center relative"
            >
              {/* Underlay shapes to resemble the design in screenshot */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]"></div>
              
              {/* Insert the generated character illustration */}
              <img
                src={youthPurpleIllustration}
                alt="Youth Illustration"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
              />

              {/* Floating decorative vector bubbles like the original illustration */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] h-8 w-8 rounded-full bg-white/95 shadow-sm border border-primary/20 flex items-center justify-center text-primary">
                  <Home className="h-4 w-4" />
                </div>
                <div className="absolute top-[40%] right-[8%] h-8 w-8 rounded-full bg-white/95 shadow-sm border border-primary/20 flex items-center justify-center text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="absolute bottom-[20%] left-[45%] h-8 w-8 rounded-full bg-white/95 shadow-sm border border-primary/20 flex items-center justify-center text-primary">
                  <GraduationCap className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
