import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { 
  Briefcase, 
  Home as HomeIcon, 
  GraduationCap, 
  Heart, 
  Info, 
  Facebook, 
  Instagram, 
  Youtube, 
  ArrowRight,
  Hand,
  Compass,
  Search,
  Calendar,
  User,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  CheckSquare,
  Square,
  ChevronRight,
  LogOut,
  ShieldAlert,
  FileText,
  LayoutDashboard,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
  fetchPolicyDetail,
  mapPolicyDetailDto,
  PolicyCard,
  usePolicies,
  usePolicySearchSuggestions,
  useRecommendedPolicies,
  type Policy
} from "@entities/policy";
import { useAdminMetrics, useAdminSync } from "@features/admin-sync";
import { completeOAuthLogin, deleteCurrentUser, fetchCurrentUser, fetchOAuthAuthorizationUrl, getStoredAuthUser, logoutCurrentUser, normalizeOAuthProvider, toDisplayUserName, toOAuthProviderLabel, useFavoritePolicies, usePolicyReadStates, useProfileWizard, type CurrentUserDto, type FavoritePolicyDto } from "@entities/user";
import { ChatbotAssistant } from "@features/policy-chat";
import { CompareModule } from "@features/policy-compare";
import { DetailModal } from "@features/policy-detail";
import { FilterBar, type FilterState } from "@features/policy-filter";
import { useTrackerManagement } from "@features/tracker-management";
import { HeroBanner } from "@widgets/home-hero";
import { Header } from "@widgets/app-header";
import { RecentlyViewed } from "@widgets/recently-viewed";
import { viewForPath, type AppView } from "@pages/page-route-registry";

const AdminPage = lazy(() => import("@pages/admin").then((module) => ({ default: module.AdminPage })));
const HomePage = lazy(() => import("@pages/home").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("@pages/login").then((module) => ({ default: module.LoginPage })));
const MyPage = lazy(() => import("@pages/mypage").then((module) => ({ default: module.MyPage })));
const SearchPage = lazy(() => import("@pages/search").then((module) => ({ default: module.SearchPage })));
const ProfileSetupPage = lazy(() => import("@pages/profile").then((module) => ({ default: module.ProfileSetupPage })));
const RecommendPage = lazy(() => import("@pages/recommend").then((module) => ({ default: module.RecommendPage })));
const TrackerPage = lazy(() => import("@pages/tracker").then((module) => ({ default: module.TrackerPage })));

// Toast Interface
interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
}

const KNOWN_POLICY_CATEGORIES: Policy["category"][] = ["일자리", "주거", "교육", "복지문화", "참여권리"];
const OAUTH_PROVIDER_STORAGE_KEY = "bop.oauth.pendingProvider";
const OAUTH_RETURN_VIEW_STORAGE_KEY = "bop.oauth.returnView";
const POLICY_PAGE_SIZE = 20;
const DEFAULT_FILTERS: FilterState = {
  region: "전체",
  status: "전체",
  category: "전체",
  age: "전체"
};

function requiresProfileSetup(user: Pick<CurrentUserDto, "onboardingStatus">): boolean {
  return user.onboardingStatus === "NEEDS_PROFILE";
}

function canAccessAdminPage(user: Pick<CurrentUserDto, "role" | "permissions"> | null): boolean {
  if (!user) {
    return false;
  }

  if (user.role.trim().toUpperCase() === "ADMIN") {
    return true;
  }

  return user.permissions.some((permission) => permission.trim().toUpperCase().includes("ADMIN"));
}

function favoritePolicyToPolicy(item: FavoritePolicyDto): Policy {
  const category = KNOWN_POLICY_CATEGORIES.includes(item.category as Policy["category"])
    ? item.category as Policy["category"]
    : "참여권리";

  return {
    id: item.policyId,
    title: item.title,
    category,
    region: item.region || "전국",
    tag: item.applicationStatus === "마감임박" ? "마감임박" : "NEW",
    description: "관심 정책 API에서 불러온 저장 항목입니다. 상세 내용을 눌러 최신 공고 정보를 확인하세요.",
    target: "전체",
    deadline: "상세확인",
    logoType: category === "일자리" ? "job" : category === "주거" ? "home" : category === "교육" ? "education" : category === "복지문화" ? "heart" : "hand",
    details: [item.applicationStatus ? `신청상태: ${item.applicationStatus}` : "신청상태: 미정"],
    link: "#",
  };
}

export default function App() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeView = viewForPath(pathname);
  const [previousView, setPreviousView] = useState<AppView>("home");

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("익명");
  const [accountProviderLabel, setAccountProviderLabel] = useState<string>("소셜");
  const [canAccessAdmin, setCanAccessAdmin] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Custom Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const {
    userProfile,
    profileSetupStep,
    wizardProfile,
    newKeywordInput,
    profileOptions,
    isProfileOptionsLoading,
    isProfileOptionsFallback,
    profileOptionsErrorMessage,
    isProfileSaving,
    setNewKeywordInput,
    updateWizardProfile,
    startProfileSetup,
    loadSavedProfile,
    handleWizardNext,
    handleWizardPrev,
    addKeyword,
    handleAddKeyword,
    handleRemoveKeyword,
    handleToggleInterest
  } = useProfileWizard({
    onComplete: () => navigateTo("recommend"),
    onToast: showToast
  });

  // Search & Filter State (POLICY-01)
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [policyPage, setPolicyPage] = useState(0);

  // Saved bookmarks (Favorite policies)
  const {
    savedPolicyIds,
    favoritePolicies,
    isLoading: isFavoriteLoading,
    isFallback: isFavoriteFallback,
    errorMessage: favoriteErrorMessage,
    toggleFavoritePolicy
  } = useFavoritePolicies();

  // Comparing policies
  const [comparingPolicies, setComparingPolicies] = useState<Policy[]>([]);

  // Selected policy in detail modal
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Confirmation Modals
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState<boolean>(false);

  // Admin sync states
  const {
    syncHistory,
    isLoadingHistory: isAdminSyncHistoryLoading,
    isAdminSyncing,
    isSearchIndexRebuilding,
    isFallback: isAdminSyncFallback,
    errorMessage: adminSyncErrorMessage,
    runAdminSync: requestAdminSync,
    runSearchIndexRebuild: requestSearchIndexRebuild
  } = useAdminSync();

  const {
    metrics: adminMetrics,
    isLoading: isAdminMetricsLoading,
    isFallback: isAdminMetricsFallback,
    errorMessage: adminMetricsErrorMessage,
  } = useAdminMetrics();

  const {
    trackers,
    selectedTrackerPolicyId,
    trackerTab,
    showAddChecklistItem,
    newChecklistItemText,
    tempMemoText,
    showDeleteTrackerConfirm,
    activeTrackerItem,
    activeTrackerPolicy,
    setTrackerTab,
    setSelectedTrackerPolicyId,
    setNewChecklistItemText,
    setTempMemoText,
    startTracker,
    saveMemo,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    changeTrackerStatus,
    changeTrackerDate,
    removeTracker,
    openAddChecklistItem,
    cancelAddChecklistItem,
    requestDeleteTracker,
    cancelDeleteTracker
  } = useTrackerManagement({
    isLoggedIn,
    onRequireLogin: () => {
      setPreviousView("tracker");
      navigateTo("login", { preservePrevious: true });
    },
    onToast: showToast
  });

  const navigateToPath = (view: AppView) => {
    switch (view) {
      case "home":
        void navigate({ to: "/" });
        break;
      case "search":
        void navigate({ to: "/search" });
        break;
      case "recommend":
        void navigate({ to: "/recommend" });
        break;
      case "tracker":
        void navigate({ to: "/tracker" });
        break;
      case "mypage":
        void navigate({ to: "/mypage" });
        break;
      case "admin":
        void navigate({ to: "/admin" });
        break;
      case "login":
        void navigate({ to: "/login" });
        break;
      case "profile_setup":
        void navigate({ to: "/profile" });
        break;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCurrentUser(controller.signal)
      .then(async (currentUser) => {
        const storedUser = getStoredAuthUser();
        setIsLoggedIn(true);
        setUserName(toDisplayUserName(storedUser ?? currentUser));
        setAccountProviderLabel(toOAuthProviderLabel(storedUser?.provider));
        setCanAccessAdmin(canAccessAdminPage(currentUser));

        if (requiresProfileSetup(currentUser) && activeView !== "profile_setup") {
          startProfileSetup();
          navigateToPath("profile_setup");
          showToast("프로필 설정이 필요합니다. 맞춤 추천을 위해 온보딩을 먼저 진행해 주세요.", "info");
          return;
        }

        if (!requiresProfileSetup(currentUser)) {
          try {
            await loadSavedProfile(controller.signal);
          } catch {
            showToast("저장된 프로필을 불러오지 못해 기본 프로필로 표시합니다.", "warning");
          }
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserName("익명");
        setAccountProviderLabel("소셜");
        setCanAccessAdmin(false);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsAuthChecking(false);
        }
      });

    return () => controller.abort();
  }, []);

  // View navigation router
  const navigateTo = (view: AppView, options?: { preservePrevious?: boolean }) => {
    // Check if member view is requested but user is logged out
    if ((view === "recommend" || view === "tracker" || view === "mypage") && !isLoggedIn) {
      setPreviousView(view);
      navigateToPath("login");
      showToast("이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.", "info");
      return;
    }
    if (view === "admin" && !canAccessAdmin) {
      navigateToPath("home");
      showToast("관리자 권한이 필요한 메뉴입니다.", "warning");
      return;
    }
    if (!options?.preservePrevious) {
      setPreviousView(activeView);
    }
    navigateToPath(view);
    // Auto sync scroll
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView !== "home") {
      return;
    }

    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
    setPolicyPage(0);
  }, [activeView]);

  useEffect(() => {
    if (isAuthChecking || isLoggedIn) {
      return;
    }
    if (activeView !== "recommend" && activeView !== "tracker" && activeView !== "mypage") {
      return;
    }

    setPreviousView(activeView);
    navigateToPath("login");
    showToast("이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.", "info");
  }, [activeView, isAuthChecking, isLoggedIn]);

  useEffect(() => {
    if (isAuthChecking || activeView !== "admin" || canAccessAdmin) {
      return;
    }

    navigateToPath("home");
    showToast("관리자 권한이 필요한 메뉴입니다.", "warning");
  }, [activeView, canAccessAdmin, isAuthChecking]);

  useEffect(() => {
    if (pathname !== "/login/callback") {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const pendingProvider = window.sessionStorage.getItem(OAUTH_PROVIDER_STORAGE_KEY);
    const returnView = (window.sessionStorage.getItem(OAUTH_RETURN_VIEW_STORAGE_KEY) as AppView | null) ?? previousView;

    if (error) {
      showToast("소셜 로그인 승인이 취소되었거나 실패했습니다.", "warning");
      window.sessionStorage.removeItem(OAUTH_PROVIDER_STORAGE_KEY);
      window.sessionStorage.removeItem(OAUTH_RETURN_VIEW_STORAGE_KEY);
      navigateToPath("login");
      return;
    }

    if (!code || !pendingProvider) {
      showToast("OAuth 로그인 정보를 확인할 수 없습니다. 다시 시도해 주세요.", "warning");
      navigateToPath("login");
      return;
    }

    completeOAuthLogin(pendingProvider, code)
      .then(async (currentUser) => {
        setIsLoggedIn(currentUser.authenticated);
        setUserName(toDisplayUserName(currentUser));
        setAccountProviderLabel(toOAuthProviderLabel(currentUser.provider));
        setCanAccessAdmin(canAccessAdminPage(currentUser));
        showToast(`🎉 ${currentUser.provider} 계정으로 로그인되었습니다.`, "success");
        if (requiresProfileSetup(currentUser)) {
          startProfileSetup();
          navigateToPath("profile_setup");
          showToast("프로필 설정이 필요합니다. 맞춤 추천을 위해 온보딩을 먼저 진행해 주세요.", "info");
          return;
        } else {
          try {
            await loadSavedProfile();
          } catch {
            showToast("저장된 프로필을 불러오지 못해 기본 프로필로 표시합니다.", "warning");
          }
        }
        window.sessionStorage.removeItem(OAUTH_PROVIDER_STORAGE_KEY);
        navigateToPath(returnView === "login" ? "home" : returnView);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCanAccessAdmin(false);
        showToast("OAuth 로그인 처리에 실패했습니다. 백엔드 OAuth 설정을 확인해 주세요.", "warning");
        navigateToPath("login");
      })
      .finally(() => {
        window.sessionStorage.removeItem(OAUTH_PROVIDER_STORAGE_KEY);
        window.sessionStorage.removeItem(OAUTH_RETURN_VIEW_STORAGE_KEY);
      });
  }, [pathname]);

  // Social Login Execution
  const handleSocialLogin = async (provider: string) => {
    try {
      const normalizedProvider = normalizeOAuthProvider(provider);
      window.sessionStorage.setItem(OAUTH_PROVIDER_STORAGE_KEY, normalizedProvider);
      window.sessionStorage.setItem(OAUTH_RETURN_VIEW_STORAGE_KEY, previousView);
      const state = crypto.randomUUID();
      const { authorizationUrl } = await fetchOAuthAuthorizationUrl(normalizedProvider, state);
      window.location.assign(authorizationUrl);
    } catch {
      showToast(`${provider} OAuth 로그인 URL 생성에 실패했습니다. 백엔드 OAuth 환경변수를 확인해 주세요.`, "warning");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutCurrentUser();
      showToast("안전하게 로그아웃 되었습니다.", "info");
    } catch {
      showToast("로그아웃 API 응답을 확인하지 못했지만 화면 로그인 상태는 종료합니다.", "info");
    } finally {
      setIsLoggedIn(false);
      setAccountProviderLabel("소셜");
      setCanAccessAdmin(false);
      navigateTo("home");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteCurrentUser();
      showToast("회원 탈퇴가 안전하게 처리되었습니다. 이용해주셔서 감사합니다.", "warning");
    } catch {
      showToast("회원 탈퇴 API 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.", "warning");
      return;
    }

    setIsLoggedIn(false);
    setAccountProviderLabel("소셜");
    setCanAccessAdmin(false);
    setShowDeleteAccountConfirm(false);
    navigateTo("home");
  };

  // Toggle Save bookmark (favorite)
  const handleToggleSave = async (id: string) => {
    const wasSaved = savedPolicyIds.includes(id);

    try {
      const result = await toggleFavoritePolicy(id);
      if (result === "removed") {
        showToast("관심 정책 목록에서 해제되었습니다.", "info");
      } else {
        showToast("관심 정책으로 보관되었습니다! [신청관리]에서 일정을 추가해 보세요.", "success");
      }
    } catch {
      showToast(
        wasSaved
          ? "관심 해제에 실패해 저장 상태를 복구했습니다. 잠시 후 다시 시도해 주세요."
          : "관심 저장에 실패해 이전 상태로 되돌렸습니다. 잠시 후 다시 시도해 주세요.",
        "warning"
      );
    }
  };

  // Compare Policy Controls
  const handleToggleCompare = (policy: Policy) => {
    if (comparingPolicies.some((p) => p.id === policy.id)) {
      setComparingPolicies((prev) => prev.filter((p) => p.id !== policy.id));
    } else {
      if (comparingPolicies.length >= 3) {
        showToast("비교 분석은 한 번에 최대 3개의 정책만 가능합니다.", "warning");
        return;
      }
      setComparingPolicies((prev) => [...prev, policy]);
      showToast(`${policy.title}이 비교 슬롯에 등록되었습니다.`, "success");
    }
  };

  const handleClearCompare = () => {
    setComparingPolicies([]);
  };

  const handleRemoveCompare = (policy: Policy) => {
    setComparingPolicies((prev) => prev.filter((p) => p.id !== policy.id));
  };

  const handleViewPolicyDetails = async (policy: Policy) => {
    setSelectedPolicy(policy);

    try {
      const detail = await fetchPolicyDetail(policy.id);
      setSelectedPolicy(mapPolicyDetailDto(detail, policy));
      try {
        await markRead(policy.id);
      } catch {
        showToast("읽음 상태 동기화에 실패했지만 상세 정보는 계속 확인할 수 있습니다.", "info");
      }
    } catch {
      showToast("상세 API 응답을 불러오지 못해 현재 카드 정보로 표시합니다.", "info");
    }
  };

  // Policy Search Listings from API only
  const {
    policies: filteredPolicies,
    pagination: policyPagination,
    isLoading: isPolicyLoading,
    isFallback: isPolicyFallback,
    errorMessage: policyApiErrorMessage
  } = usePolicies(searchQuery, filters, policyPage, POLICY_PAGE_SIZE);

  useEffect(() => {
    setPolicyPage(0);
  }, [searchQuery, filters]);

  const {
    suggestions: policySearchSuggestions,
    isLoading: isPolicySuggestionLoading,
    isFallback: isPolicySuggestionFallback,
    errorMessage: policySuggestionErrorMessage
  } = usePolicySearchSuggestions(searchQuery);

  const handleApplySearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    showToast(`추천 검색어가 적용되었습니다: '${suggestion}'`, "info");
  };

  const savedPolicies = useMemo(() => {
    const apiFavoritePolicies = favoritePolicies.map(favoritePolicyToPolicy);
    return savedPolicyIds
      .map((id) => apiFavoritePolicies.find((policy) => policy.id === id)
        ?? filteredPolicies.find((policy) => policy.id === id))
      .filter((policy): policy is Policy => Boolean(policy));
  }, [favoritePolicies, filteredPolicies, savedPolicyIds]);

  const readTrackedPolicyIds = useMemo(() => Array.from(new Set([
    ...filteredPolicies.map((policy) => policy.id),
    ...savedPolicies.map((policy) => policy.id),
  ])), [filteredPolicies, savedPolicies]);

  const {
    readStatesByPolicyId,
    isFallback: isReadStateFallback,
    errorMessage: readStateErrorMessage,
    markRead
  } = usePolicyReadStates(readTrackedPolicyIds);

  const recommendationQuery = useMemo(() => ({
    region: userProfile.region,
    category: userProfile.interests[0],
    keyword: userProfile.keywords[0],
  }), [userProfile]);

  const {
    recommendedPolicies,
    isLoading: isRecommendationLoading,
    isFallback: isRecommendationFallback,
    errorMessage: recommendationErrorMessage,
    message: recommendationMessage,
    personalized: isRecommendationPersonalized
  } = useRecommendedPolicies(recommendationQuery);

  const handleStartTracker = (policy: Policy) => {
    startTracker(policy);
    if (isLoggedIn) {
      navigateTo("tracker");
    }
  };

  // Run admin database synchronizer
  const runAdminSync = async () => {
    try {
      const log = await requestAdminSync();
      if (log.status === "FAILED") {
        showToast(log.failureMessage || "정책 동기화가 실패 상태로 기록되었습니다.", "warning");
        return;
      }
      showToast("공공 API 연동 및 청년정책 정보 수동 동기화 요청이 완료되었습니다!", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "정책 동기화 실행에 실패했습니다.", "warning");
    }
  };

  const runSearchIndexRebuild = async () => {
    try {
      const message = await requestSearchIndexRebuild();
      showToast(message, "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "검색 인덱스 재생성에 실패했습니다.", "warning");
    }
  };

  // Category selection handler from home
  const handleCategoryCardClick = (catKey: string) => {
    setSearchQuery("");
    setFilters({
      ...DEFAULT_FILTERS,
      category: catKey
    });
    navigateTo("search");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8fafc]" id="app-root">
      
      {/* Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-2xl p-4 text-xs font-bold text-left shadow-lg pointer-events-auto flex items-start space-x-2 border ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : toast.type === "warning"
                  ? "bg-rose-50 border-rose-100 text-rose-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />}
              {toast.type === "warning" && <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />}
              {toast.type === "info" && <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header component */}
      <Header 
        isLoggedIn={isLoggedIn} 
        canAccessAdmin={canAccessAdmin}
        activeView={activeView}
        onNavigate={navigateTo} 
        onLoginClick={() => navigateTo("login")}
        userName={isAuthChecking ? "확인 중" : userName}
      />

      {/* Main Content Router */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-xs font-bold text-slate-400 shadow-sm">
            페이지를 불러오는 중입니다...
          </div>
        }>
        
        {/* VIEW 1: HOME PAGE (Guest HOME-01 / Member HOME-02) */}
        {activeView === "home" && (
          <HomePage
            isLoggedIn={isLoggedIn}
            userName={userName}
            userProfile={userProfile}
            searchQuery={searchQuery}
            serverPolicies={filteredPolicies}
            recommendedPolicies={recommendedPolicies}
            savedPolicyIds={savedPolicyIds}
            readStatesByPolicyId={readStatesByPolicyId}
            comparingPolicies={comparingPolicies}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={() => navigateTo("search")}
            onCategoryClick={handleCategoryCardClick}
            onRequireRecommendationLogin={() => {
              setPreviousView("recommend");
              navigateTo("login", { preservePrevious: true });
            }}
            onNavigateSearch={() => navigateTo("search")}
            onNavigateRecommend={() => navigateTo("recommend")}
            onEditProfile={() => {
              startProfileSetup();
              navigateTo("profile_setup");
            }}
            onViewPolicyDetails={(policy) => void handleViewPolicyDetails(policy)}
            onToggleSave={(policyId) => void handleToggleSave(policyId)}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {/* VIEW 2: POLICY SEARCH (POLICY-01) */}
        {activeView === "search" && (
          <SearchPage
            searchQuery={searchQuery}
            policySearchSuggestions={policySearchSuggestions}
            isPolicySuggestionLoading={isPolicySuggestionLoading}
            isPolicySuggestionFallback={isPolicySuggestionFallback}
            policySuggestionErrorMessage={policySuggestionErrorMessage}
            filters={filters}
            filteredPolicies={filteredPolicies}
            isPolicyLoading={isPolicyLoading}
            isPolicyFallback={isPolicyFallback}
            policyApiErrorMessage={policyApiErrorMessage}
            policyPagination={policyPagination}
            savedPolicyIds={savedPolicyIds}
            readStatesByPolicyId={readStatesByPolicyId}
            comparingPolicies={comparingPolicies}
            onSearchQueryChange={setSearchQuery}
            onSearchSubmit={() => showToast(`검색 쿼리가 적용되었습니다: '${searchQuery}'`, "info")}
            onApplySearchSuggestion={handleApplySearchSuggestion}
            onFiltersChange={setFilters}
            onPolicyPageChange={setPolicyPage}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
            onResetEmptyState={() => {
              setFilters(DEFAULT_FILTERS);
              setSearchQuery("");
            }}
            onShowNationwidePolicies={() => {
              setFilters({ region: "전국", status: "전체", category: "전체", age: "전체" });
              setSearchQuery("");
            }}
            onToggleSave={(policyId) => void handleToggleSave(policyId)}
            onViewPolicyDetails={(policy) => void handleViewPolicyDetails(policy)}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onRemoveCompare={handleRemoveCompare}
          />
        )}

        {/* VIEW 3: USER CUSTOM RECOMMENDATIONS (REC-01) */}
        {activeView === "recommend" && (
          <RecommendPage
            userProfile={userProfile}
            recommendedPolicies={recommendedPolicies}
            isRecommendationLoading={isRecommendationLoading}
            isRecommendationFallback={isRecommendationFallback}
            isRecommendationPersonalized={isRecommendationPersonalized}
            recommendationErrorMessage={recommendationErrorMessage}
            recommendationMessage={recommendationMessage}
            comparingPolicies={comparingPolicies}
            savedPolicyIds={savedPolicyIds}
            onEditProfile={() => {
              startProfileSetup();
              navigateTo("profile_setup");
            }}
            onViewPolicyDetails={(policy) => void handleViewPolicyDetails(policy)}
            onToggleSave={(policyId) => void handleToggleSave(policyId)}
            onStartTracker={handleStartTracker}
            onClearCompare={handleClearCompare}
            onRemoveCompare={handleRemoveCompare}
          />
        )}

        {/* VIEW 4: APPLICATION TRACKER (TRACKER-01 & TRACKER-02) */}
        {activeView === "tracker" && (
          <TrackerPage
            trackers={trackers}
            trackerTab={trackerTab}
            selectedTrackerPolicyId={selectedTrackerPolicyId}
            activeTrackerItem={activeTrackerItem}
            activeTrackerPolicy={activeTrackerPolicy}
            showAddChecklistItem={showAddChecklistItem}
            newChecklistItemText={newChecklistItemText}
            tempMemoText={tempMemoText}
            showDeleteTrackerConfirm={showDeleteTrackerConfirm}
            onTrackerTabChange={setTrackerTab}
            onSelectTrackerPolicy={setSelectedTrackerPolicyId}
            onStatusChange={changeTrackerStatus}
            onTargetDateChange={changeTrackerDate}
            onOpenAddChecklistItem={openAddChecklistItem}
            onCancelAddChecklistItem={cancelAddChecklistItem}
            onNewChecklistItemTextChange={setNewChecklistItemText}
            onAddChecklistItem={addChecklistItem}
            onToggleChecklistItem={toggleChecklistItem}
            onDeleteChecklistItem={removeChecklistItem}
            onTempMemoTextChange={setTempMemoText}
            onSaveMemo={saveMemo}
            onRequestDeleteTracker={requestDeleteTracker}
            onCancelDeleteTracker={cancelDeleteTracker}
            onConfirmDeleteTracker={removeTracker}
          />
        )}

        {/* VIEW 5: MY PAGE (MY-01) */}
        {activeView === "mypage" && (
          <MyPage
            userName={userName}
            accountProviderLabel={accountProviderLabel}
            userProfile={userProfile}
            savedPolicyIds={savedPolicyIds}
            savedPolicies={savedPolicies}
            trackers={trackers}
            isFavoriteLoading={isFavoriteLoading}
            isFavoriteFallback={isFavoriteFallback}
            favoriteErrorMessage={favoriteErrorMessage}
            isReadStateFallback={isReadStateFallback}
            readStateErrorMessage={readStateErrorMessage}
            showDeleteAccountConfirm={showDeleteAccountConfirm}
            onGoSearchWithResetFilters={() => {
              setFilters(DEFAULT_FILTERS);
              navigateTo("search");
            }}
            onGoTracker={() => navigateTo("tracker")}
            onEditProfile={() => {
              startProfileSetup();
              navigateTo("profile_setup");
            }}
            onToggleSave={(policyId) => void handleToggleSave(policyId)}
            onViewPolicyDetails={(policy) => void handleViewPolicyDetails(policy)}
            onViewMissingPolicyBackup={(policy) => {
              void handleViewPolicyDetails(policy);
              showToast("만료전 백업된 최종 저장 정보를 대조합니다.", "info");
            }}
            onStartTracker={handleStartTracker}
            onLogout={() => void handleLogout()}
            onRequestDeleteAccount={() => setShowDeleteAccountConfirm(true)}
            onCancelDeleteAccount={() => setShowDeleteAccountConfirm(false)}
            onConfirmDeleteAccount={handleDeleteAccount}
          />
        )}

        {/* VIEW 6: SOCIAL LOGIN (AUTH-01) */}
        {activeView === "login" && (
          <LoginPage
            onSocialLogin={(provider) => void handleSocialLogin(provider)}
            onGuestHome={() => navigateTo("home")}
          />
        )}

        {/* VIEW 7: PROFILE SETTING WIZARD (PROFILE-01 ~ PROFILE-03) */}
        {activeView === "profile_setup" && (
          <ProfileSetupPage
            profileSetupStep={profileSetupStep}
            wizardProfile={wizardProfile}
            newKeywordInput={newKeywordInput}
            profileOptions={profileOptions}
            isProfileOptionsLoading={isProfileOptionsLoading}
            isProfileOptionsFallback={isProfileOptionsFallback}
            profileOptionsErrorMessage={profileOptionsErrorMessage}
            isProfileSaving={isProfileSaving}
            onUpdateWizardProfile={updateWizardProfile}
            onNewKeywordInputChange={setNewKeywordInput}
            onToggleInterest={handleToggleInterest}
            onAddKeywordSuggestion={addKeyword}
            onAddKeyword={handleAddKeyword}
            onRemoveKeyword={handleRemoveKeyword}
            onWizardPrev={handleWizardPrev}
            onWizardNext={() => void handleWizardNext()}
            onSkip={() => {
              navigateTo("home");
              showToast("설정 마법사가 일시적으로 보류되었습니다.", "info");
            }}
          />
        )}

        {/* VIEW 8: ADMIN DASHBOARD (ADMIN-01) */}
        {activeView === "admin" && (
          <AdminPage
            adminMetrics={adminMetrics}
            syncHistory={syncHistory}
            isAdminSyncHistoryLoading={isAdminSyncHistoryLoading}
            isAdminMetricsLoading={isAdminMetricsLoading}
            isAdminSyncFallback={isAdminSyncFallback}
            isAdminMetricsFallback={isAdminMetricsFallback}
            adminSyncErrorMessage={adminSyncErrorMessage}
            adminMetricsErrorMessage={adminMetricsErrorMessage}
            isAdminSyncing={isAdminSyncing}
            isSearchIndexRebuilding={isSearchIndexRebuilding}
            onRunAdminSync={() => void runAdminSync()}
            onRunSearchIndexRebuild={() => void runSearchIndexRebuild()}
          />
        )}
        </Suspense>

        {/* Bottom Banner Note Info */}
        <section className="mt-12 rounded-3xl bg-blue-50/50 border border-blue-100 p-4.5 flex items-start space-x-3 text-left">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">알림 및 안내사항</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              YouthPick의 청년복지 및 주거 일자리 지원 정보는 공공 API 데이터를 매 시간 대조하여 최신 상태로 유지되나, 실제 거주 조건이나 주관기관의 접수 마감 변동 시점에 따른 간차가 생길 수 있습니다. 
              최종 승인은 세부 상세보기 링크의 주관 기관 공식 창구를 반드시 방문 검토하시기 권장합니다.
            </p>
          </div>
        </section>

      </main>

      <ChatbotAssistant />

      {/* Mobile Bottom Bar Navigation (Section 3 requirement) */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
        <button 
          onClick={() => navigateTo("home")}
          className={`flex flex-col items-center space-y-0.5 ${activeView === "home" ? "text-primary font-black" : "hover:text-slate-600"}`}
        >
          <HomeIcon className="h-4.5 w-4.5" />
          <span>홈</span>
        </button>
        <button 
          onClick={() => navigateTo("search")}
          className={`flex flex-col items-center space-y-0.5 ${activeView === "search" ? "text-primary font-black" : "hover:text-slate-600"}`}
        >
          <Compass className="h-4.5 w-4.5" />
          <span>정책</span>
        </button>
        <button 
          onClick={() => navigateTo("mypage")}
          className={`flex flex-col items-center space-y-0.5 ${activeView === "mypage" ? "text-primary font-black" : "hover:text-slate-600"}`}
        >
          <User className="h-4.5 w-4.5" />
          <span>마이</span>
        </button>
      </div>

      {/* Footer component */}
      <footer className="mt-16 border-t border-slate-100 bg-white py-8 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
            <span className="hover:text-slate-800 cursor-pointer">이용약관</span>
            <span>|</span>
            <span className="hover:text-slate-800 cursor-pointer font-bold text-primary">개인정보처리방침</span>
            <span>|</span>
            <span className="hover:text-slate-800 cursor-pointer">사이트맵</span>
            <span>|</span>
            <span className="hover:text-slate-800 cursor-pointer">고객센터</span>
          </div>

          <div className="flex items-center space-x-4">
            <Facebook className="h-4.5 w-4.5 text-slate-400 hover:text-blue-600 cursor-pointer" />
            <Instagram className="h-4.5 w-4.5 text-slate-400 hover:text-rose-500 cursor-pointer" />
            <Youtube className="h-4.5 w-4.5 text-slate-400 hover:text-red-500 cursor-pointer" />
          </div>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-6">
          © 2026 YouthPick Inc. 나에게 맞는 청년 맞춤 복지·일자리 탐색 시스템. All Rights Reserved.
        </p>
      </footer>

      {/* Detail Overlay Modal */}
      <AnimatePresence>
        {selectedPolicy && (
          <DetailModal
            policy={selectedPolicy}
            onClose={() => setSelectedPolicy(null)}
            isSaved={savedPolicyIds.includes(selectedPolicy.id)}
            onToggleSave={handleToggleSave}
            onStartTracker={handleStartTracker}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
