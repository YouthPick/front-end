import { Search, User, Sparkles, Menu, X, Settings } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
  onLoginClick: () => void;
  userName?: string;
}

export default function Header({ isLoggedIn, activeView, onNavigate, onLoginClick, userName = "민지" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "홈" },
    { id: "search", label: "정책 찾기" },
    { id: "recommend", label: "맞춤 추천" },
    { id: "tracker", label: "신청관리" },
    { id: "mypage", label: "마이페이지" },
    { id: "admin", label: "관리자" }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left Side: Logo and Desktop Menu */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div 
            onClick={() => handleItemClick("home")} 
            className="flex cursor-pointer items-center space-x-2 text-xl font-bold tracking-tight"
            id="header-logo"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4 fill-current animate-pulse" />
            </span>
            <span className="font-extrabold text-slate-800 bg-gradient-to-r from-primary to-brand-secondary bg-clip-text text-transparent">YouthPick</span>
          </div>

          {/* Desktop Navigation Menus */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-500">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`transition-all py-1.5 px-1 relative hover:text-primary ${
                  activeView === item.id 
                    ? "text-primary" 
                    : item.id === "admin" 
                    ? "text-slate-400 font-medium hover:text-slate-600" 
                    : ""
                }`}
                id={`nav-${item.id}`}
              >
                <span>{item.label}</span>
                {activeView === item.id && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Side: Search and Login Button */}
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <button 
              onClick={() => handleItemClick("mypage")}
              className="flex items-center space-x-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-100"
              id="header-profile-button"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white">
                {userName[0]}
              </span>
              <span className="max-w-[70px] truncate">{userName}님</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-primary to-brand-secondary px-4.5 py-2 text-xs font-bold text-white transition-all hover:brightness-105 active:scale-95 cursor-pointer shadow-sm shadow-primary/10" 
              id="login-button"
            >
              <User className="h-3.5 w-3.5" />
              <span>로그인</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5 text-slate-600" /> : <Menu className="h-4.5 w-4.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-inner animate-in slide-in-from-top duration-200">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex w-full items-center rounded-xl px-4 py-2.5 text-xs font-bold text-left transition-colors ${
                activeView === item.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

