import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Compass,
  Edit3,
  Facebook,
  GraduationCap,
  Hand,
  Heart,
  Home as HomeIcon,
  Info,
  Instagram,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Square,
  Trash2,
  User,
  Youtube,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import ChatbotAssistant from './components/ChatbotAssistant';
import CompareModule from './components/CompareModule';
import DetailModal from './components/DetailModal';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import PolicyCard from './components/PolicyCard';
import RecentlyViewed from './components/RecentlyViewed';
import { MOCK_POLICIES } from './data';
import type { FilterState, Policy, TrackerItem, UserProfile } from './types';

// Toast Interface
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export default function App() {
  // Views: 'home' | 'search' | 'recommend' | 'tracker' | 'mypage' | 'admin' | 'login' | 'profile_setup'
  const [activeView, setActiveView] = useState<string>('home');
  const [previousView, setPreviousView] = useState<string>('home');

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('민지');

  // Custom User Profile State (PROFILE-01 ~ 03)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    birthYear: 1998,
    region: '서울특별시',
    subRegion: '마포구',
    employmentStatus: '미취업·구직',
    educationStatus: '대학 졸업',
    interests: ['일자리', '교육'],
    keywords: ['직무교육', '면접비'],
  });

  // Profile setup wizard steps (1 | 2 | 3)
  const [profileSetupStep, setProfileSetupStep] = useState<number>(1);
  const [wizardProfile, setWizardProfile] = useState<UserProfile>({
    birthYear: 1998,
    region: '서울특별시',
    subRegion: '마포구',
    employmentStatus: '미취업·구직',
    educationStatus: '대학 졸업',
    interests: ['일자리', '교육'],
    keywords: ['직무교육', '면접비'],
  });
  const [newKeywordInput, setNewKeywordInput] = useState<string>('');

  // Application Tracker State (TRACKER-01 ~ 02)
  const [trackers, setTrackers] = useState<TrackerItem[]>([
    {
      policyId: 'p1',
      status: '준비중',
      targetDate: '2026-06-25',
      checklist: [
        { id: 'c1', text: '지원서 작성', completed: true },
        { id: 'c2', text: '자기소개서 초안 작성', completed: true },
        { id: 'c3', text: '구직상태 확인서 발급', completed: false },
        { id: 'c4', text: '최종 제출 완료', completed: false },
      ],
      memo: '교육 일정과 면접 일정이 겹치는지 확인할 것',
    },
    {
      policyId: 'p2',
      status: '관심',
      targetDate: '2026-07-10',
      checklist: [
        { id: 'c5', text: '주민등록등본 발급', completed: false },
        { id: 'c6', text: '임대차계약서 사본 준비', completed: false },
      ],
      memo: '월세 이체 내역 3개월분 미리 출력해두기',
    },
    {
      policyId: 'p5',
      status: '결과대기',
      targetDate: '2026-06-20',
      checklist: [
        { id: 'c7', text: '서류 업로드', completed: true },
        { id: 'c8', text: '심사 대기 확인', completed: true },
      ],
      memo: '결과 발표는 공식 홈페이지 고시 예정',
    },
  ]);

  // Selected tracker policy ID for TRACKER-02 detail view
  const [selectedTrackerPolicyId, setSelectedTrackerPolicyId] = useState<string | null>(null);

  // Search & Filter State (POLICY-01)
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    region: '전체',
    status: '전체',
    category: '전체',
    age: '전체',
  });

  // Saved bookmarks (Favorite policies)
  const [savedPolicyIds, setSavedPolicyIds] = useState<string[]>(['p1', 'p2', 'p5', 'p_missing']);

  // Comparing policies
  const [comparingPolicies, setComparingPolicies] = useState<Policy[]>([]);

  // Selected policy in detail modal
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Tracker interactive states
  const [trackerTab, setTrackerTab] = useState<string>('전체');
  const [showAddChecklistItem, setShowAddChecklistItem] = useState<boolean>(false);
  const [newChecklistItemText, setNewChecklistItemText] = useState<string>('');
  const [tempMemoText, setTempMemoText] = useState<string>('');

  // Confirmation Modals
  const [showDeleteTrackerConfirm, setShowDeleteTrackerConfirm] = useState<string | null>(null);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState<boolean>(false);

  // Admin sync states
  const [isAdminSyncing, setIsAdminSyncing] = useState<boolean>(false);
  const [syncHistory, setSyncHistory] = useState([
    {
      date: '06.24 06:00',
      status: 'SUCCESS',
      newCount: 18,
      editCount: 44,
      missingCount: 2,
      errorCount: 0,
    },
    {
      date: '06.23 06:00',
      status: 'PARTIAL',
      newCount: 12,
      editCount: 31,
      missingCount: 4,
      errorCount: 2,
    },
  ]);

  // Custom Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // View navigation router
  const navigateTo = (view: string) => {
    // Check if member view is requested but user is logged out
    if ((view === 'recommend' || view === 'tracker' || view === 'mypage') && !isLoggedIn) {
      setPreviousView(view);
      setActiveView('login');
      showToast('이 서비스는 로그인이 필요합니다. 회원 화면으로 안내합니다.', 'info');
      return;
    }
    setPreviousView(activeView);
    setActiveView(view);
    // Auto sync scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Social Login Execution
  const handleSocialLogin = (provider: string) => {
    setIsLoggedIn(true);
    setUserName('민지');
    showToast(
      `🎉 ${provider} 계정으로 환영합니다! 맞춤 청년 정책 매칭이 활성화되었습니다.`,
      'success',
    );

    // First-time simulation: if user has no interests, direct to profile setup
    if (userProfile.interests.length === 0) {
      setProfileSetupStep(1);
      setWizardProfile({ ...userProfile });
      setActiveView('profile_setup');
    } else {
      // Go back to previous or targeted page
      if (previousView === 'recommend') {
        setActiveView('recommend');
      } else if (previousView === 'tracker') {
        setActiveView('tracker');
      } else if (previousView === 'mypage') {
        setActiveView('mypage');
      } else {
        setActiveView('home');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('home');
    showToast('안전하게 로그아웃 되었습니다.', 'info');
  };

  const handleDeleteAccount = () => {
    setIsLoggedIn(false);
    setShowDeleteAccountConfirm(false);
    setActiveView('home');
    showToast('회원 탈퇴가 안전하게 처리되었습니다. 이용해주셔서 감사합니다.', 'warning');
  };

  // Toggle Save bookmark (favorite)
  const handleToggleSave = (id: string) => {
    if (savedPolicyIds.includes(id)) {
      setSavedPolicyIds((prev) => prev.filter((pId) => pId !== id));
      showToast('관심 정책 목록에서 해제되었습니다.', 'info');
    } else {
      setSavedPolicyIds((prev) => [...prev, id]);
      showToast('관심 정책으로 보관되었습니다! [신청관리]에서 일정을 추가해 보세요.', 'success');
    }
  };

  // Compare Policy Controls
  const handleToggleCompare = (policy: Policy) => {
    if (comparingPolicies.some((p) => p.id === policy.id)) {
      setComparingPolicies((prev) => prev.filter((p) => p.id !== policy.id));
    } else {
      if (comparingPolicies.length >= 2) {
        showToast('비교 분석은 한 번에 최대 2개의 정책만 가능합니다.', 'warning');
        return;
      }
      setComparingPolicies((prev) => [...prev, policy]);
      showToast(`${policy.title}이 비교 슬롯에 등록되었습니다.`, 'success');
    }
  };

  const handleClearCompare = () => {
    setComparingPolicies([]);
  };

  const handleRemoveCompare = (policy: Policy) => {
    setComparingPolicies((prev) => prev.filter((p) => p.id !== policy.id));
  };

  // Profile setup wizard buttons
  const handleWizardNext = () => {
    if (profileSetupStep < 3) {
      setProfileSetupStep((prev) => prev + 1);
    } else {
      // Step 3 finished
      setUserProfile({ ...wizardProfile });
      setActiveView('recommend');
      showToast('✨ 맞춤 프로필 설정 완료! 실시간 추천 결과 28건이 연계되었습니다.', 'success');
    }
  };

  const handleWizardPrev = () => {
    if (profileSetupStep > 1) {
      setProfileSetupStep((prev) => prev - 1);
    }
  };

  const handleAddKeyword = () => {
    if (newKeywordInput.trim() === '') return;
    if (wizardProfile.keywords.length >= 5) {
      showToast('관심 키워드는 최대 5개까지 추가할 수 있습니다.', 'warning');
      return;
    }
    setWizardProfile((prev) => ({
      ...prev,
      keywords: [...prev.keywords, newKeywordInput.trim()],
    }));
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (kw: string) => {
    setWizardProfile((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== kw),
    }));
  };

  const handleToggleInterest = (interest: string) => {
    if (wizardProfile.interests.includes(interest)) {
      setWizardProfile((prev) => ({
        ...prev,
        interests: prev.interests.filter((i) => i !== interest),
      }));
    } else {
      if (wizardProfile.interests.length >= 3) {
        showToast('관심 분야는 최대 3개까지 선택할 수 있습니다.', 'warning');
        return;
      }
      setWizardProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
    }
  };

  // Policy Search Listings Filtered
  const filteredPolicies = useMemo(() => {
    return MOCK_POLICIES.filter((policy) => {
      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          policy.title.toLowerCase().includes(query) ||
          policy.category.toLowerCase().includes(query) ||
          policy.description.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Region Filter
      if (filters.region !== '전체' && policy.region !== '전국') {
        if (policy.region !== filters.region) return false;
      }

      // Category Filter
      if (filters.category !== '전체' && policy.category !== filters.category) {
        if (filters.category === '참여・권리' && policy.category === '참여·권리') {
          // ignore slightly different characters
        } else {
          return false;
        }
      }

      // Status/Age Filter matching
      if (filters.age !== '전체' && policy.target !== '전체' && policy.target !== filters.age) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Recommended Matching Engine based on Active Profile
  const recommendedPolicies = useMemo(() => {
    return MOCK_POLICIES.map((p, index) => {
      // Calculate a highly realistic match score based on user Profile
      let score = 70;
      if (p.region === userProfile.region || p.region === '전국') score += 15;
      if (userProfile.interests.includes(p.category)) score += 10;
      if (p.target === '전체' || p.target === '만 19~34세') score += 5;
      // Add small mock variance
      score += (index % 3) * 4;
      return {
        policy: p,
        score: Math.min(score, 98),
        reliability: 'MEDIUM' as const,
        reasons: [
          `거주지역이 ${userProfile.region} 조건과 일치합니다.`,
          `관심 분야인 ${p.category} 카테고리에 속합니다.`,
          `취업상태 조건이 정책 자격에 근접합니다.`,
        ],
      };
    }).sort((a, b) => b.score - a.score);
  }, [userProfile]);

  // Start Tracker Control
  const handleStartTracker = (policy: Policy) => {
    if (!isLoggedIn) {
      setPreviousView('tracker');
      setActiveView('login');
      showToast('신청관리 일정 추가를 위해 먼저 로그인해 주세요.', 'info');
      return;
    }

    const exists = trackers.find((t) => t.policyId === policy.id);
    if (exists) {
      setSelectedTrackerPolicyId(policy.id);
      setActiveView('tracker');
      showToast('이미 등록된 신청 정보가 존재하여, 관리 상세로 연결되었습니다.', 'info');
    } else {
      const newTracker: TrackerItem = {
        policyId: policy.id,
        status: '준비중',
        targetDate:
          policy.deadline !== '원본확인불가' && policy.deadline !== '상시모집'
            ? policy.deadline
            : '2026-06-30',
        checklist: [
          { id: Math.random().toString(), text: '기본 제출 서류 취합', completed: false },
          { id: Math.random().toString(), text: '공고 상세 자격요건 검증', completed: false },
          { id: Math.random().toString(), text: '지원서 및 온라인 제출 완료', completed: false },
        ],
        memo: '',
      };
      setTrackers((prev) => [...prev, newTracker]);
      setSelectedTrackerPolicyId(policy.id);
      setActiveView('tracker');
      showToast(`🎉 '${policy.title}' 신청관리 상태가 새로 시작되었습니다!`, 'success');
    }
  };

  // Selected tracker item for detail
  const activeTrackerItem = useMemo(() => {
    return trackers.find((t) => t.policyId === selectedTrackerPolicyId) || null;
  }, [trackers, selectedTrackerPolicyId]);

  // Selected tracker policy reference
  const activeTrackerPolicy = useMemo(() => {
    if (!activeTrackerItem) return null;
    return MOCK_POLICIES.find((p) => p.id === activeTrackerItem.policyId) || null;
  }, [activeTrackerItem]);

  // Memo temp editor synchronization
  useEffect(() => {
    if (activeTrackerItem) {
      setTempMemoText(activeTrackerItem.memo);
    }
  }, [activeTrackerItem]);

  const handleSaveMemo = () => {
    if (!selectedTrackerPolicyId) return;
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === selectedTrackerPolicyId) {
          return { ...t, memo: tempMemoText };
        }
        return t;
      }),
    );
    showToast('📝 개인 기록 메모가 성공적으로 저장되었습니다.', 'success');
  };

  const handleAddChecklistItemAction = () => {
    if (newChecklistItemText.trim() === '' || !selectedTrackerPolicyId) return;
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === selectedTrackerPolicyId) {
          return {
            ...t,
            checklist: [
              ...t.checklist,
              { id: Math.random().toString(), text: newChecklistItemText.trim(), completed: false },
            ],
          };
        }
        return t;
      }),
    );
    setNewChecklistItemText('');
    setShowAddChecklistItem(false);
    showToast('체크리스트 준비 일감이 추가되었습니다.', 'success');
  };

  const handleToggleChecklistItem = (policyId: string, itemId: string) => {
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === policyId) {
          return {
            ...t,
            checklist: t.checklist.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            }),
          };
        }
        return t;
      }),
    );
  };

  const handleDeleteChecklistItem = (policyId: string, itemId: string) => {
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === policyId) {
          return {
            ...t,
            checklist: t.checklist.filter((item) => item.id !== itemId),
          };
        }
        return t;
      }),
    );
    showToast('준비할 일감이 삭제되었습니다.', 'info');
  };

  const handleUpdateTrackerStatus = (policyId: string, newStatus: TrackerItem['status']) => {
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === policyId) {
          return { ...t, status: newStatus };
        }
        return t;
      }),
    );
    showToast(`신청관리 상태가 [${newStatus}]로 갱신되었습니다.`, 'success');
  };

  const handleUpdateTrackerDate = (policyId: string, date: string) => {
    setTrackers((prev) =>
      prev.map((t) => {
        if (t.policyId === policyId) {
          return { ...t, targetDate: date };
        }
        return t;
      }),
    );
    showToast(`제출 마감일정이 변경되었습니다: ${date}`, 'info');
  };

  const handleDeleteTracker = (policyId: string) => {
    setTrackers((prev) => prev.filter((t) => t.policyId !== policyId));
    setSelectedTrackerPolicyId(null);
    setShowDeleteTrackerConfirm(null);
    showToast('신청관리 목록에서 안전하게 삭제되었습니다.', 'warning');
  };

  // Run admin database synchronizer
  const runAdminSync = () => {
    setIsAdminSyncing(true);
    setTimeout(() => {
      setIsAdminSyncing(false);
      const newLog = {
        date: `오늘 ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`,
        status: 'SUCCESS',
        newCount: Math.floor(Math.random() * 20) + 5,
        editCount: Math.floor(Math.random() * 30) + 10,
        missingCount: Math.floor(Math.random() * 3),
        errorCount: 0,
      };
      setSyncHistory((prev) => [newLog, ...prev]);
      showToast('공공 API 연동 및 청년정책 정보 수동 동기화가 완료되었습니다!', 'success');
    }, 2000);
  };

  // Category selection handler from home
  const handleCategoryCardClick = (catKey: string) => {
    setFilters((prev) => ({
      ...prev,
      category: catKey,
    }));
    setActiveView('search');
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
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  : toast.type === 'warning'
                    ? 'bg-rose-50 border-rose-100 text-rose-800'
                    : 'bg-blue-50 border-blue-100 text-blue-800'
              }`}
            >
              {toast.type === 'success' && (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header component */}
      <Header
        isLoggedIn={isLoggedIn}
        activeView={activeView}
        onNavigate={navigateTo}
        onLoginClick={() => navigateTo('login')}
        userName={userName}
      />

      {/* Main Content Router */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* VIEW 1: HOME PAGE (Guest HOME-01 / Member HOME-02) */}
        {activeView === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Custom Hero Banner */}
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={() => navigateTo('search')}
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
                    key: '일자리',
                    title: '일자리',
                    subtitle: '취업・창업 지원',
                    bg: 'bg-primary/10 text-primary hover:bg-primary/20',
                    icon: Briefcase,
                  },
                  {
                    key: '주거',
                    title: '주거',
                    subtitle: '주거・금융 지원',
                    bg: 'bg-blue-50 text-blue-600 hover:bg-blue-100/50',
                    icon: HomeIcon,
                  },
                  {
                    key: '교육',
                    title: '교육',
                    subtitle: '역량・자기개발',
                    bg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100/50',
                    icon: GraduationCap,
                  },
                  {
                    key: '복지·문화',
                    title: '복지・문화',
                    subtitle: '생활・건강・문화',
                    bg: 'bg-rose-50 text-rose-600 hover:bg-rose-100/50',
                    icon: Heart,
                  },
                  {
                    key: '참여·권리',
                    title: '참여・권리',
                    subtitle: '참여・권익 보호',
                    bg: 'bg-amber-50 text-amber-600 hover:bg-amber-100/50',
                    icon: Hand,
                  },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handleCategoryCardClick(item.key)}
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
                    거주지역, 연령뿐만 아니라 상세한 취업상태, 학력, 관심 키워드 조건을 대조하여
                    복잡한 수령자격을 자동으로 비교 분석해 드립니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviousView('recommend');
                      setActiveView('login');
                    }}
                    className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                  >
                    내 조건에 맞는 정책 추천받기
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('search')}
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
                      현재 프로필:{' '}
                      <span className="font-bold text-primary">
                        {userProfile.region} {userProfile.subRegion} ·{' '}
                        {userProfile.employmentStatus} · {userProfile.educationStatus}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileSetupStep(1);
                      setWizardProfile({ ...userProfile });
                      setActiveView('profile_setup');
                    }}
                    className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>프로필 수정</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                          type="button"
                          onClick={() => {
                            setSelectedPolicy(policy);
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
                    type="button"
                    onClick={() => navigateTo('recommend')}
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
                    <h3 className="text-sm font-extrabold text-slate-800">
                      최근 화제인 신규 정책 소식
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      전국 및 서울 등 청년들이 가장 집중해서 조회하는 핵심 소식입니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('search')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-700"
                  >
                    전체보기
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {MOCK_POLICIES.slice(0, 4).map((policy) => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      isSaved={savedPolicyIds.includes(policy.id)}
                      onToggleSave={handleToggleSave}
                      onViewDetails={setSelectedPolicy}
                      isComparing={comparingPolicies.some((p) => p.id === policy.id)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar items */}
              <div className="lg:col-span-4 space-y-6">
                <RecentlyViewed policies={MOCK_POLICIES} onViewDetails={setSelectedPolicy} />
                <ChatbotAssistant />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: POLICY SEARCH (POLICY-01) */}
        {activeView === 'search' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-extrabold text-primary">
                YouthPick &gt; 통합 검색
              </span>
              <h2 className="text-lg font-black text-slate-800">실시간 정책 검색기</h2>
              <p className="text-xs text-slate-400">
                조건 필터와 지역 정보를 조합하여 나에게 딱 맞는 혜택 사업을 세밀하게 타겟팅해
                보세요.
              </p>
            </div>

            {/* Big Search Input */}
            <div className="flex flex-col sm:flex-row gap-2 max-w-3xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="예: '월세', '인턴', 'K-디지털', '서울' 등 키워드나 정책명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-5 pr-12 text-xs transition-colors focus:border-primary focus:outline-none shadow-sm"
                  id="search-main-input"
                />
                <Search className="absolute right-4.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => showToast(`검색 쿼리가 적용되었습니다: '${searchQuery}'`, 'info')}
                className="rounded-2xl bg-gradient-to-r from-primary to-brand-secondary px-6 py-3 text-xs font-bold text-white transition-all hover:brightness-105"
              >
                검색하기
              </button>
            </div>

            {/* Interactive Filters */}
            <FilterBar filters={filters} setFilters={setFilters} />

            {/* Results row info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-left">
              <div>
                <span className="text-xs text-slate-500 font-semibold">
                  총 <span className="text-primary font-bold">{filteredPolicies.length}건</span>의
                  청년 정책이 정밀 필터링되었습니다.
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-bold text-slate-400">보기 구분:</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({ region: '전체', status: '전체', category: '전체', age: '전체' })
                  }
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            </div>

            {/* Core Card Grid or Empty State */}
            {filteredPolicies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
                    {filteredPolicies.map((policy) => (
                      <PolicyCard
                        key={policy.id}
                        policy={policy}
                        isSaved={savedPolicyIds.includes(policy.id)}
                        onToggleSave={handleToggleSave}
                        onViewDetails={setSelectedPolicy}
                        isComparing={comparingPolicies.some((p) => p.id === policy.id)}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <CompareModule
                    comparingPolicies={comparingPolicies}
                    onClear={handleClearCompare}
                    onRemove={handleRemoveCompare}
                  />
                  <ChatbotAssistant />
                </div>
              </div>
            ) : (
              /* EMPTY STATE VARIANT (5.4) */
              <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 px-4 text-center space-y-4 max-w-2xl mx-auto">
                <span className="text-5xl block animate-bounce">🔍</span>
                <h3 className="text-sm font-extrabold text-slate-700">
                  일치하는 검색 결과가 전혀 없습니다
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  선택한 시·도 필터 조건이 맞지 않거나, 특정 카테고리에 너무 협소한 연령 조건이
                  지정되었을 수 있습니다.
                </p>
                <div className="flex justify-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ region: '전체', status: '전체', category: '전체', age: '전체' });
                      setSearchQuery('');
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    필터 설정 전체 초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ region: '전국', status: '전체', category: '전체', age: '전체' });
                      setSearchQuery('');
                    }}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-colors"
                  >
                    전국 공통 정책 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: USER CUSTOM RECOMMENDATIONS (REC-01) */}
        {activeView === 'recommend' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                  AI 종합 분석 스마트 팩트 매칭
                </span>
                <h2 className="text-lg font-black text-slate-800">
                  나만을 위한 1:1 맞춤 청년정책 추천
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  회원님의 맞춤 프로필 가중치를 기반으로 상위 일치하는 자격을 자동 순위화했습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileSetupStep(1);
                  setWizardProfile({ ...userProfile });
                  setActiveView('profile_setup');
                }}
                className="shrink-0 self-start sm:self-center inline-flex items-center space-x-1 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>프로필 및 키워드 다시 작성</span>
              </button>
            </div>

            {/* Profile Briefing Plate */}
            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400">
                  현재 대조 프로필 조건
                </span>
                <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
                  {userProfile.region} {userProfile.subRegion} · {userProfile.birthYear}년생 ·{' '}
                  {userProfile.employmentStatus} · {userProfile.educationStatus}
                </p>
                <div className="flex flex-wrap gap-1">
                  {userProfile.interests.map((it) => (
                    <span
                      key={it}
                      className="text-[9px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md font-bold"
                    >
                      #{it}
                    </span>
                  ))}
                  {userProfile.keywords.map((it) => (
                    <span
                      key={it}
                      className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold"
                    >
                      #{it}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200/80 pt-3 md:pt-0 md:pl-5 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 block">
                  통합 매칭 수
                </span>
                <span className="text-lg font-black text-slate-800">총 28건 추천</span>
              </div>
            </div>

            {/* Recommendation Cards Flow (REC-01 / Section 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                {recommendedPolicies.slice(0, 8).map(({ policy, score, reasons }) => (
                  <div
                    key={policy.id}
                    className="rounded-3xl border border-slate-100 bg-white p-5 text-left hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                  >
                    {/* Corner ribbon matching score */}
                    <div className="absolute right-0 top-0 bg-gradient-to-l from-primary to-brand-secondary text-white px-4.5 py-1.5 rounded-bl-3xl text-xs font-black shadow-sm">
                      유사도 {score}점
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {policy.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {policy.region}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-800 pr-16 leading-tight">
                        {policy.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed pr-2">
                      {policy.description}
                    </p>

                    {/* Reasons and Warning Section (REC-01 Section 7 requirement) */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
                      <div className="space-y-1.5">
                        <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                          추천 및 우대 조건 매칭
                        </span>
                        <div className="space-y-1 text-xs text-slate-600 font-semibold">
                          <p className="flex items-center text-emerald-600">
                            <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                            {reasons[0]}{' '}
                            <span className="text-[10px] text-slate-400 ml-1">(+25)</span>
                          </p>
                          <p className="flex items-center text-emerald-600">
                            <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                            {reasons[1]}{' '}
                            <span className="text-[10px] text-slate-400 ml-1">(+20)</span>
                          </p>
                          <p className="flex items-center text-emerald-600">
                            <Check className="h-3.5 w-3.5 mr-1 shrink-0" />
                            {reasons[2]}{' '}
                            <span className="text-[10px] text-slate-400 ml-1">(+15)</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-slate-200/60 pt-2">
                        <span className="block text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
                          자가진단 및 공식공고 대조 필요
                        </span>
                        <p className="text-[11px] text-slate-500 flex items-start">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0 mt-0.5" />
                          <span>
                            세부 건강보험 소득요건 및 기업 규모별 제한사항은 공식 페이지 상세조회가
                            필요합니다.
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedPolicy(policy)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        상세 자격조건 보기
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSave(policy.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                          savedPolicyIds.includes(policy.id)
                            ? 'bg-rose-50 border-rose-100 text-rose-500'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {savedPolicyIds.includes(policy.id) ? '관심 저장됨 ♥' : '관심 정책 담기'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartTracker(policy)}
                        className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all"
                      >
                        신청관리 시작
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 space-y-6">
                <CompareModule
                  comparingPolicies={comparingPolicies}
                  onClear={handleClearCompare}
                  onRemove={handleRemoveCompare}
                />
                <ChatbotAssistant />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: APPLICATION TRACKER (TRACKER-01 & TRACKER-02) */}
        {activeView === 'tracker' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Split layout between List and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* TRACKER-01: LEFT COLUMN (Tracker list with Tabs) */}
              <div className="lg:col-span-5 space-y-5 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-primary">
                    YouthPick &gt; 나의 보관함
                  </span>
                  <h2 className="text-lg font-black text-slate-800">신청 준비 일정 관리</h2>
                  <p className="text-xs text-slate-400">
                    관심 등록한 정책의 제출 기한, 구비 서류 체크리스트를 놓치지 않게 체계적으로
                    추적합니다.
                  </p>
                </div>

                {/* Tracker Status filter buttons (TRACKER-01 layout) */}
                <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
                  {['전체', '관심', '준비중', '신청완료', '결과대기', '종료'].map((tab) => {
                    const count =
                      tab === '전체'
                        ? trackers.length
                        : trackers.filter((t) => t.status === tab).length;
                    return (
                      <button
                        type="button"
                        key={tab}
                        onClick={() => setTrackerTab(tab)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
                          trackerTab === tab
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200/85'
                        }`}
                      >
                        {tab} {count}
                      </button>
                    );
                  })}
                </div>

                {/* Listing Tracker Cards */}
                <div className="space-y-3">
                  {trackers
                    .filter((t) => trackerTab === '전체' || t.status === trackerTab)
                    .map((track) => {
                      const policyRef = MOCK_POLICIES.find((p) => p.id === track.policyId);
                      if (!policyRef) return null;

                      // Calculate completion percentage
                      const totalItems = track.checklist.length;
                      const completedItems = track.checklist.filter((c) => c.completed).length;
                      const pct =
                        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                      const isSelected = selectedTrackerPolicyId === track.policyId;

                      return (
                        <button
                          type="button"
                          key={track.policyId}
                          onClick={() => setSelectedTrackerPolicyId(track.policyId)}
                          className={`w-full block rounded-2xl border p-4 transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'border-primary bg-primary/[0.01] shadow-sm ring-2 ring-primary/10'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                track.status === '준비중'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                  : track.status === '결과대기'
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : track.status === '신청완료'
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                      : 'bg-slate-50 text-slate-500 border border-slate-100'
                              }`}
                            >
                              {track.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">
                              목표: {track.targetDate}
                            </span>
                          </div>

                          <h4 className="text-xs font-extrabold text-slate-800 mt-2 line-clamp-1">
                            {policyRef.title}
                          </h4>

                          {/* Progress bar */}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[10px] font-extrabold text-slate-400">
                              <span>
                                체크리스트 {completedItems}/{totalItems} 완료
                              </span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                            <span>수정기록: 2026.06.23</span>
                            <span className="text-primary hover:underline flex items-center space-x-0.5">
                              <span>관리하기</span>
                              <ChevronRight className="h-3 w-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}

                  {trackers.filter((t) => trackerTab === '전체' || t.status === trackerTab)
                    .length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center text-slate-400 text-xs">
                      이 카테고리 상태에 배정된 신청 일감이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* TRACKER-02: RIGHT COLUMN (Selected Tracker detailed checks & memos) */}
              <div className="lg:col-span-7">
                {activeTrackerItem && activeTrackerPolicy ? (
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 text-left space-y-6 shadow-sm">
                    {/* Header bar */}
                    <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <span className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary">
                          {activeTrackerPolicy.category}
                        </span>
                        <h3 className="text-sm font-black text-slate-800 leading-tight pr-6">
                          {activeTrackerPolicy.title}
                        </h3>
                      </div>
                      <a
                        href={activeTrackerPolicy.link}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50"
                      >
                        공식 공고 ↗
                      </a>
                    </div>

                    {/* Interactive inputs: Status, Target Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="tracker-status-select"
                          className="block text-[10px] font-extrabold text-slate-400 uppercase"
                        >
                          신청 상태 변경
                        </label>
                        <select
                          id="tracker-status-select"
                          value={activeTrackerItem.status}
                          onChange={(e) =>
                            handleUpdateTrackerStatus(
                              activeTrackerItem.policyId,
                              e.target.value as TrackerItem['status'],
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-primary"
                        >
                          <option value="관심">관심</option>
                          <option value="준비중">준비중</option>
                          <option value="신청완료">신청완료</option>
                          <option value="결과대기">결과대기</option>
                          <option value="종료">종료</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="tracker-target-date"
                          className="block text-[10px] font-extrabold text-slate-400 uppercase"
                        >
                          목표 마감일 설정
                        </label>
                        <input
                          id="tracker-target-date"
                          type="date"
                          value={activeTrackerItem.targetDate}
                          onChange={(e) =>
                            handleUpdateTrackerDate(activeTrackerItem.policyId, e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Required documents brief (From wireframe Section 10) */}
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                      <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        정책 제출 서류 기본 안내
                      </h4>
                      <p className="text-xs text-slate-600 font-extrabold leading-relaxed">
                        • 신청서 및 자기소개서, 구직상태 자격 소명 확인서
                      </p>
                      <p className="text-[10px] text-slate-400">
                        * 주관 부처 마감 이전에 제출 서류 목록이 변동되었는지 공식 안내 고시를
                        반드시 교차 검토하세요.
                      </p>
                    </div>

                    {/* Interactive checklist area with deletion option */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-800 flex items-center">
                          <CheckSquare className="h-4 w-4 text-primary mr-1.5" />
                          <span>준비 작업 체크리스트</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAddChecklistItem(true)}
                          className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>체크항목 추가</span>
                        </button>
                      </div>

                      {/* Checklist overlay modal */}
                      {showAddChecklistItem && (
                        <div className="rounded-2xl border border-primary/20 bg-primary/[0.01] p-3 space-y-2.5">
                          <input
                            type="text"
                            placeholder="준비할 서류 또는 작업 내용을 적어보세요..."
                            value={newChecklistItemText}
                            onChange={(e) => setNewChecklistItemText(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary"
                          />
                          <div className="flex justify-end space-x-1">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddChecklistItem(false);
                                setNewChecklistItemText('');
                              }}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              onClick={handleAddChecklistItemAction}
                              className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white hover:brightness-105"
                            >
                              추가하기
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        {activeTrackerItem.checklist.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleChecklistItem(activeTrackerItem.policyId, item.id)
                              }
                              className="flex items-start space-x-2.5 text-left flex-1"
                            >
                              {item.completed ? (
                                <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 fill-primary/10" />
                              ) : (
                                <Square className="h-4.5 w-4.5 text-slate-300 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
                              >
                                {item.text}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteChecklistItem(activeTrackerItem.policyId, item.id)
                              }
                              className="text-slate-300 hover:text-rose-500 rounded p-1 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Memo textarea (Character monitoring limit 2000 chars) */}
                    <div className="space-y-2">
                      <label
                        htmlFor="tracker-memo"
                        className="block text-xs font-extrabold text-slate-800"
                      >
                        개인 업무 및 보완 기록 메모
                      </label>
                      <textarea
                        id="tracker-memo"
                        rows={4}
                        maxLength={2000}
                        placeholder="이곳에 이 정책 준비시 고려할 일정을 메모해 두세요. 예: 서류 제출시 담당 사무소 유선확인 필요 등"
                        value={tempMemoText}
                        onChange={(e) => setTempMemoText(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:outline-none focus:border-primary bg-slate-50/20"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tempMemoText.length} / 2000 자</span>
                        <button
                          type="button"
                          onClick={handleSaveMemo}
                          className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          메모 저장하기
                        </button>
                      </div>
                    </div>

                    {/* Dangerous tracker deletion option */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setShowDeleteTrackerConfirm(activeTrackerItem.policyId)}
                        className="text-xs text-rose-500 font-bold hover:underline flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>이 정책의 신청관리 기록에서 삭제</span>
                      </button>
                    </div>

                    {/* Tracker deletion check overlay */}
                    {showDeleteTrackerConfirm === activeTrackerItem.policyId && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-extrabold text-rose-900">
                              정말로 신청 일정을 삭제하시겠습니까?
                            </h4>
                            <p className="text-[11px] text-rose-700 leading-normal">
                              기록을 지우면 그동안 기입해둔 맞춤 일정, 서류 체크리스트 및 개인
                              메모가 영구적으로 파기됩니다.
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setShowDeleteTrackerConfirm(null)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTracker(activeTrackerItem.policyId)}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700"
                          >
                            삭제 확인
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-24 px-4 text-center space-y-3">
                    <span className="text-4xl">📋</span>
                    <h3 className="text-sm font-bold text-slate-700">
                      관리할 신청 일감을 선택해 주세요
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      왼쪽의 신청관리 목록에서 특정 정책을 선택하거나, [맞춤 추천] 또는 [정책 찾기]
                      목록에서 마음에 드는 항목의 **'신청관리 시작'**을 눌러보세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: MY PAGE (MY-01) */}
        {activeView === 'mypage' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                나의 맞춤 센터
              </span>
              <h2 className="text-lg font-black text-slate-800">마이페이지</h2>
            </div>

            {/* Account Card */}
            <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left flex items-center space-x-4 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-lg font-black text-white">
                {userName[0]}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-extrabold text-slate-800">{userName}님</h3>
                <p className="text-[11px] text-slate-400 flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
                  <span>Google 계정 연동 간편 로그인 사용 중</span>
                </p>
              </div>
            </div>

            {/* Activity Metrics Dashboard */}
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFilters({ region: '전체', status: '전체', category: '전체', age: '전체' });
                  navigateTo('search');
                }}
                className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
              >
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  관심 정책 저장
                </span>
                <span className="text-xl font-black text-slate-800 block mt-1">
                  {savedPolicyIds.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('tracker')}
                className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
              >
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  신청 준비중
                </span>
                <span className="text-xl font-black text-slate-800 block mt-1">
                  {trackers.filter((t) => t.status === '준비중').length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('tracker')}
                className="rounded-2xl border border-slate-100 bg-white p-4.5 text-center hover:border-primary/20 transition-all"
              >
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  결과 대기목록
                </span>
                <span className="text-xl font-black text-slate-800 block mt-1">
                  {trackers.filter((t) => t.status === '결과대기').length}
                </span>
              </button>
            </div>

            {/* Profile Brief (My Page Section 11 requirement) */}
            <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold text-slate-800">
                  개인 맞춤 조건 가중치 프로필
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setProfileSetupStep(1);
                    setWizardProfile({ ...userProfile });
                    setActiveView('profile_setup');
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  수정
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="grid grid-cols-4 gap-2">
                  <span className="text-slate-400 font-bold">기본 거주지</span>
                  <span className="col-span-3 font-extrabold text-slate-800">
                    {userProfile.region} {userProfile.subRegion}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="text-slate-400 font-bold">출생연도</span>
                  <span className="col-span-3 font-extrabold text-slate-800">
                    {userProfile.birthYear}년생
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="text-slate-400 font-bold">현재 취업상태</span>
                  <span className="col-span-3 font-extrabold text-slate-800">
                    {userProfile.employmentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="text-slate-400 font-bold">최종 학력수준</span>
                  <span className="col-span-3 font-extrabold text-slate-800">
                    {userProfile.educationStatus}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="text-slate-400 font-bold">관심 분야 목록</span>
                  <span className="col-span-3 flex flex-wrap gap-1 font-bold text-slate-700">
                    {userProfile.interests.map((it) => (
                      <span key={it} className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                        {it}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Policies List inside Saved Tab (FAVORITE-01 - includes [원본 누락] model variant) */}
            <div className="rounded-3xl bg-white border border-slate-100 p-6 text-left space-y-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                보관중인 관심 정책 목록 ({savedPolicyIds.length}건)
              </h4>
              <div className="space-y-3">
                {savedPolicyIds.map((id) => {
                  const policyRef = MOCK_POLICIES.find((p) => p.id === id);
                  if (!policyRef) return null;

                  return (
                    <div
                      key={id}
                      className={`rounded-2xl border p-4.5 space-y-3 transition-all ${
                        policyRef.isSourceMissing
                          ? 'border-amber-200 bg-amber-50/30'
                          : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                      }`}
                    >
                      {/* Title row */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            {policyRef.isSourceMissing ? (
                              <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white">
                                원본 누락
                              </span>
                            ) : (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold text-primary">
                                {policyRef.category}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold">
                              {policyRef.region}
                            </span>
                          </div>
                          <h5 className="text-xs font-extrabold text-slate-800">
                            {policyRef.title}
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleSave(policyRef.id)}
                          className="text-xs text-rose-500 font-bold hover:underline"
                        >
                          관심 해제
                        </button>
                      </div>

                      {/* Warning text for Source Missing policy (FAVORITE-01 Requirement) */}
                      {policyRef.isSourceMissing ? (
                        <div className="space-y-1">
                          <p className="text-[11px] text-amber-700 leading-relaxed font-bold">
                            ⚠️ 현재 해당 사업의 공공데이터 공식 원본 공고를 조회할 수 없습니다.
                          </p>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            기존에 작성해두셨던 체크리스트, 진행 단계 일정 및 개인 소명 기록 메모
                            등은 이 계정에 그대로 안전하게 계속 보호 유지됩니다.
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {policyRef.description}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100/60 text-xs font-bold">
                        {policyRef.isSourceMissing ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPolicy(policyRef);
                              showToast('만료전 백업된 최종 저장 정보를 대조합니다.', 'info');
                            }}
                            className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
                          >
                            과거 저장 정보 복원보기
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedPolicy(policyRef)}
                              className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50"
                            >
                              공고 내용 복사조회
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartTracker(policyRef)}
                              className="rounded-lg bg-primary text-white px-3.5 py-1.5 text-[10px] hover:brightness-105"
                            >
                              일정 스케줄러 등록
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger actions */}
            <div className="rounded-3xl border border-rose-100 bg-rose-50/20 p-5 text-left space-y-3.5">
              <h4 className="text-xs font-extrabold text-rose-800 flex items-center">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-600 mr-1.5" />
                <span>계정 보안 및 위험 설정 구역</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                수정하신 프로필 데이터 가중치는 즉시 휘발되며, 회원 탈퇴 시 모든 신청관리 대시보드가
                파기됩니다.
              </p>
              <div className="flex space-x-2 pt-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
                >
                  <LogOut className="h-3.5 w-3.5 text-slate-400" />
                  <span>로그아웃</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteAccountConfirm(true)}
                  className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100/50"
                >
                  회원 탈퇴 진행
                </button>
              </div>
            </div>

            {/* Delete Account Modal confirmation overlay */}
            {showDeleteAccountConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl text-left space-y-4">
                  <div className="flex items-center space-x-2 text-rose-600">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-base font-black">정말로 회원 탈퇴를 진행합니까?</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    탈퇴 완료 시 Google 간편인증 연동이 해제되며, 그동안 기획관리 중이던 **
                    {trackers.length}건의 신청 기한 타임라인 및 {savedPolicyIds.length}건의 관심
                    저장 목록**이 즉각적으로 복구 불가능하게 안전 소멸 처리됩니다.
                  </p>
                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowDeleteAccountConfirm(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600"
                    >
                      이전으로 복귀
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700"
                    >
                      확인, 탈퇴 승인
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: SOCIAL LOGIN (AUTH-01) */}
        {activeView === 'login' && (
          <div className="animate-in fade-in duration-300 max-w-md mx-auto py-8">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm text-center space-y-6">
              <div className="space-y-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                  <Sparkles
                    className="h-6 w-6 fill-current animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                </span>
                <h2 className="text-xl font-black text-slate-800">YouthPick 소셜 계정 연동</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  원하시는 소셜 채널 계정을 통해 간편하게 로그인하시면 관심 정책을 즉각 담아두고
                  신청 준비 체크리스트 관리를 바로 시작하실 수 있습니다.
                </p>
              </div>

              {/* Login Button Column (AUTH-01 layout requirement) */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('카카오')}
                  className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#FEE500] py-3 text-xs font-extrabold text-[#191919] hover:brightness-95 transition-all cursor-pointer"
                >
                  <span className="text-sm font-black">💬</span>
                  <span>카카오톡으로 3초만에 계속하기</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('네이버')}
                  className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#03C75A] py-3 text-xs font-extrabold text-white hover:brightness-95 transition-all cursor-pointer"
                >
                  <span className="text-sm font-black">N</span>
                  <span>네이버 아이디로 편리하게 로그인</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex w-full items-center justify-center space-x-3 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                >
                  <span className="text-sm font-black">G</span>
                  <span>Google 계정 연동으로 시작하기</span>
                </button>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-left leading-normal">
                <p className="flex items-start">
                  ✓ 로그인 진행 시 청년정책 매칭을 위한 개인정보 수집 이용약관 및 개인정보처리방침
                  조항에 동의한 것으로 자동 간주합니다.
                </p>
                <p className="flex items-start">
                  ✓ YouthPick은 사용자의 민감한 비공개 프로필 정보들을 엄격하게 비공개 보관하며
                  최소한의 정보 연동에만 활용합니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                }}
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>비회원 홈 화면으로 돌아가기</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 7: PROFILE SETTING WIZARD (PROFILE-01 ~ PROFILE-03) */}
        {activeView === 'profile_setup' && (
          <div className="animate-in fade-in duration-300 max-w-xl mx-auto py-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 text-left space-y-6 shadow-sm">
              {/* Wizard progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-primary font-black">맞춤 조건 분석 프로필 설정</span>
                  <span>{profileSetupStep} / 3 단계</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(profileSetupStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 1: 기본 조건 (PROFILE-01) */}
              {profileSetupStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800">
                      1. 기본 조건을 알려주세요
                    </h3>
                    <p className="text-xs text-slate-400">
                      전국 및 관내 거주 청년에게 제한 지급되는 수혜 나이 조건을 매칭 분석하는 기초
                      데이터입니다.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="wizard-birth-year"
                      className="block text-xs font-bold text-slate-500"
                    >
                      출생연도
                    </label>
                    <select
                      id="wizard-birth-year"
                      value={wizardProfile.birthYear}
                      onChange={(e) =>
                        setWizardProfile({
                          ...wizardProfile,
                          birthYear: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                    >
                      {Array.from({ length: 25 }, (_, i) => 1988 + i).map((year) => (
                        <option key={year} value={year}>
                          {year}년생 (만 {2026 - year}세)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="wizard-region"
                        className="block text-xs font-bold text-slate-500"
                      >
                        거주 광역시·도
                      </label>
                      <select
                        id="wizard-region"
                        value={wizardProfile.region}
                        onChange={(e) =>
                          setWizardProfile({ ...wizardProfile, region: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                      >
                        <option value="서울특별시">서울특별시</option>
                        <option value="경기도">경기도</option>
                        <option value="부산광역시">부산광역시</option>
                        <option value="인천광역시">인천광역시</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="wizard-sub-region"
                        className="block text-xs font-bold text-slate-500"
                      >
                        거주 시·군·구 (선택)
                      </label>
                      <select
                        id="wizard-sub-region"
                        value={wizardProfile.subRegion}
                        onChange={(e) =>
                          setWizardProfile({ ...wizardProfile, subRegion: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                      >
                        <option value="마포구">마포구</option>
                        <option value="분당구">분당구</option>
                        <option value="해운대구">해운대구</option>
                        <option value="남동구">남동구</option>
                        <option value="기타">기타 전체</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    ※ 시군구 조건이 맞지 않더라도 전국 및 광역시 통합 우대 조건은 누락 없이 분석
                    매치해 드립니다.
                  </p>
                </div>
              )}

              {/* STEP 2: 취업·학력 상태 (PROFILE-02) */}
              {profileSetupStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800">
                      2. 현재 라이프스타일 및 자격상태
                    </h3>
                    <p className="text-xs text-slate-400">
                      고용상태 및 졸업 학력 요건은 청년지원 제도의 가장 강력한 승인 잣대 조건입니다.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      현재 취업 고용 상태
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['미취업·구직', '재직', '자영업', '프리랜서', '창업·창업준비', '기타'].map(
                        (status) => {
                          const isSelected = wizardProfile.employmentStatus === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setWizardProfile({ ...wizardProfile, employmentStatus: status })
                              }
                              className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-primary border-primary text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {status}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      최종 학력 상태
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        '고교 재학',
                        '고교 졸업',
                        '대학 재학',
                        '대졸 예정',
                        '대학 졸업',
                        '석·박사',
                        '기타',
                      ].map((edu) => {
                        const isSelected = wizardProfile.educationStatus === edu;
                        return (
                          <button
                            key={edu}
                            type="button"
                            onClick={() =>
                              setWizardProfile({ ...wizardProfile, educationStatus: edu })
                            }
                            className={`rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary border-primary text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {edu}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: 관심 분야 & 키워드 (PROFILE-03) */}
              {profileSetupStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-800">
                      3. 관심 분야 및 검색 태그 키워드
                    </h3>
                    <p className="text-xs text-slate-400">
                      수천 개의 정책 중 매칭 우선순위를 높이기 위한 사용자 가중치 조절 장치입니다.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      관심 사업 카테고리 (최대 3개)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['일자리', '주거', '교육', '복지·문화', '참여·권리'].map((category) => {
                        const isSelected = wizardProfile.interests.includes(category);
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => handleToggleInterest(category)}
                            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="wizard-keyword-input"
                      className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider"
                    >
                      추가 타겟 키워드 (최대 5개)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="wizard-keyword-input"
                        type="text"
                        placeholder="예: 직무교육, 면접비, 보증금 등"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="rounded-xl bg-slate-800 text-white px-4 py-2 text-xs font-bold hover:bg-slate-700"
                      >
                        추가
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {wizardProfile.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center space-x-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs font-extrabold text-primary"
                        >
                          <span>#{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="text-primary hover:text-red-500 font-extrabold ml-1 shrink-0"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Action Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                {profileSetupStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleWizardPrev}
                    className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    이전 단계로
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('home');
                      showToast('설정 마법사가 일시적으로 보류되었습니다.', 'info');
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-4.5 py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    나중에 하기
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleWizardNext}
                  className="rounded-xl bg-gradient-to-r from-primary to-brand-secondary px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95"
                >
                  {profileSetupStep === 3 ? '맞춤 추천목록 확인' : '다음 단계로'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: ADMIN DASHBOARD (ADMIN-01) */}
        {activeView === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                  YouthPick 백엔드 콘솔
                </span>
                <h2 className="text-lg font-black text-slate-800">운영사 대시보드</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  실시간 공공 API 연동 품질 상태 모니터링 및 동기화 무결성을 검사합니다.
                </p>
              </div>

              {/* Manual sync command (ADMIN-01 request) */}
              <button
                type="button"
                disabled={isAdminSyncing}
                onClick={runAdminSync}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isAdminSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>실시간 파싱 및 무결성 정합 중...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>정기 공고 데이터 수동 강제 동기화</span>
                  </>
                )}
              </button>
            </div>

            {/* Quality Summary Cards (ADMIN-01) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  전국 활성 청년정책
                </span>
                <span className="text-xl font-black text-slate-800 block mt-1">3,241건</span>
                <span className="text-[9px] text-emerald-500 font-bold mt-1 block">
                  ✓ API 정상 수신 완료
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  원본 URL 파손 누락
                </span>
                <span className="text-xl font-black text-amber-600 block mt-1">12건</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1 block">
                  메모 유지/백업 카드 노출 중
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  신청기간 날짜 파싱오류
                </span>
                <span className="text-xl font-black text-rose-500 block mt-1">18건</span>
                <span className="text-[9px] text-rose-400 font-bold mt-1 block">
                  ⚠️ 수동 입력 보정 대기
                </span>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4.5 text-left shadow-sm">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  공공 DB 접속 실패 수
                </span>
                <span className="text-xl font-black text-slate-400 block mt-1">2건</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1 block">
                  전회차 크롤러 캐시 가동
                </span>
              </div>
            </div>

            {/* Sync history table (ADMIN-01) */}
            <div className="rounded-3xl bg-white border border-slate-100 p-5 text-left space-y-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800">
                최근 공공데이터 동기화 이력 로그
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-500">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3 text-left">일시</th>
                      <th className="py-2.5 px-3 text-left">수신 상태</th>
                      <th className="py-2.5 px-3 text-right">신규 등재</th>
                      <th className="py-2.5 px-3 text-right">기존 변경</th>
                      <th className="py-2.5 px-3 text-right">원본 누락</th>
                      <th className="py-2.5 px-3 text-right">경고/오류</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {syncHistory.map((log) => (
                      <tr key={log.date} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-semibold text-slate-700">{log.date}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-black ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700">
                          +{log.newCount}
                        </td>
                        <td className="py-3 px-3 text-right font-medium">{log.editCount}</td>
                        <td className="py-3 px-3 text-right text-amber-600 font-bold">
                          {log.missingCount}
                        </td>
                        <td className="py-3 px-3 text-right text-rose-500 font-bold">
                          {log.errorCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QA Section */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 text-left space-y-3 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-800">품질 경고 사후 피드백 통제</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                파싱 오류나 원본 URL 누락 발생 시, YouthPick 캐시엔진이 저장한 최종 공고본 정보를
                사용자들에게 대체 제공하여 기 구축해둔 마이페이지 체크리스트를 계속 유지하게
                설계되었습니다.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Banner Note Info */}
        <section className="mt-12 rounded-3xl bg-blue-50/50 border border-blue-100 p-4.5 flex items-start space-x-3 text-left">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">알림 및 안내사항</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              YouthPick의 청년복지 및 주거 일자리 지원 정보는 공공 API 데이터를 매 시간 대조하여
              최신 상태로 유지되나, 실제 거주 조건이나 주관기관의 접수 마감 변동 시점에 따른 간차가
              생길 수 있습니다. 최종 승인은 세부 상세보기 링크의 주관 기관 공식 창구를 반드시 방문
              검토하시기 권장합니다.
            </p>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Bar Navigation (Section 3 requirement) */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center space-y-0.5 ${activeView === 'home' ? 'text-primary font-black' : 'hover:text-slate-600'}`}
        >
          <HomeIcon className="h-4.5 w-4.5" />
          <span>홈</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('search')}
          className={`flex flex-col items-center space-y-0.5 ${activeView === 'search' ? 'text-primary font-black' : 'hover:text-slate-600'}`}
        >
          <Compass className="h-4.5 w-4.5" />
          <span>정책</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('recommend')}
          className={`flex flex-col items-center space-y-0.5 ${activeView === 'recommend' ? 'text-primary font-black' : 'hover:text-slate-600'}`}
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span>추천</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('tracker')}
          className={`flex flex-col items-center space-y-0.5 ${activeView === 'tracker' ? 'text-primary font-black' : 'hover:text-slate-600'}`}
        >
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>신청관리</span>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('mypage')}
          className={`flex flex-col items-center space-y-0.5 ${activeView === 'mypage' ? 'text-primary font-black' : 'hover:text-slate-600'}`}
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
            <span className="hover:text-slate-800 cursor-pointer font-bold text-primary">
              개인정보처리방침
            </span>
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
            isRecommendation={isLoggedIn} // If logged in, demonstrate recommended scoring match reasoning
            recommendationScore={
              selectedPolicy.id === 'p1'
                ? 94
                : selectedPolicy.id === 'p2'
                  ? 88
                  : selectedPolicy.id === 'p3'
                    ? 82
                    : 78
            }
            onStartTracker={handleStartTracker}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
