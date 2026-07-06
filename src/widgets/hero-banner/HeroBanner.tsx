import { useState } from "react";
import { Bell, Briefcase, GraduationCap, Home, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/shared/constants";
import youthIllustration from "@/assets/images/youth_purple_illustration_1782457991844.jpg";

export function HeroBanner() {
  const [searchInput, setSearchInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (searchInput.trim() !== "") {
      params.set("q", searchInput.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `${ROUTES.search}?${queryString}` : ROUTES.search);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setShowDialog(false);
      setSubscribed(false);
      setEmail("");
    }, 2000);
  };

  return (
    <div className="relative overflow-hidden bg-[#F1F5F9]/30 py-10 lg:py-14 border-b border-slate-100">
      {/* Background soft circles and shapes */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      <div className="absolute right-[30%] top-[-10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute left-[10%] bottom-[-10%] h-72 w-72 rounded-full bg-brand-secondary/10 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Left text and search */}
          <div className="space-y-6 lg:col-span-5 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl lg:text-4.5xl leading-tight">
                나에게 맞는 <br />
                <span className="bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                  청년정책
                </span>
                을 찾아보세요
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                지역, 생활 상태, 관심사에 맞는 정책을 쉽고 빠르게 찾아드립니다.
              </p>
            </motion.div>

            {/* Large search box */}
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  className="w-full bg-transparent py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
                  id="hero-search-input"
                  aria-label="정책 검색어 입력"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-5 py-2.5 text-xs font-bold text-white transition-all hover:brightness-105 active:scale-[0.98]"
                id="hero-search-button"
              >
                검색
              </button>
            </motion.div>
          </div>

          {/* Middle illustration */}
          <div className="hidden lg:block lg:col-span-4 h-60 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-gradient-to-tr from-primary/10 to-brand-secondary/10 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]"></div>

              <img
                src={youthIllustration}
                alt="청년 일러스트레이션"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
              />

              {/* Floating decorative bubbles */}
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

          {/* Right notification card */}
          <div className="lg:col-span-3 text-left">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-100 flex flex-col justify-between h-60"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                    <Bell className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 leading-tight">청년을 위한 정부 지원 정책</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">알림 서비스</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  새로운 정책 소식과 마감 임박 정책을 알림으로 받아보세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDialog(true)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                id="alert-signup-button"
              >
                알림 설정하기
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subscription dialog */}
      <AnimatePresence>
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              id="subscription-modal"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">신규 청년 정책 알림 설정</h3>
                  <button
                    type="button"
                    onClick={() => setShowDialog(false)}
                    aria-label="알림 설정 닫기"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
                {!subscribed ? (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <p className="text-xs leading-relaxed text-slate-500">
                      관심 지역과 전공/분야에 일치하는 맞춤형 정부 정책이 공고될 때 가장 신속하게 알림을 받아보실 수 있습니다.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500" htmlFor="subscribe-email-input">
                        이메일 주소
                      </label>
                      <input
                        id="subscribe-email-input"
                        type="email"
                        required
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-primary to-brand-secondary py-2.5 text-xs font-semibold text-white hover:brightness-105"
                    >
                      무료 구독하기
                    </button>
                  </form>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <span className="text-4xl">🎉</span>
                    <h4 className="text-sm font-bold bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">
                      알림 설정 완료!
                    </h4>
                    <p className="text-xs text-slate-500">매주 맞춤 추천 소식을 보내드립니다.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
