import { ArrowLeft, Sparkles } from 'lucide-react';

import type { UserRole } from '@/entities/user';

// 소셜 채널 공식 브랜드 컬러/규격 — 디자인 토큰 대상이 아닌 각 사 브랜드 가이드 고정값.
// 카카오: https://developers.kakao.com/docs/latest/ko/kakaologin/design-guide
// 구글: https://developers.google.com/identity/branding-guidelines
const KAKAO_BRAND_CLASSES = 'bg-[#FEE500] text-black/85';
const NAVER_BRAND_CLASSES = 'bg-[#03C75A] text-white';
const GOOGLE_BRAND_CLASSES = 'bg-white text-[#1F1F1F] border border-[#747775]';

function KakaoSymbol() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        fill="#000000"
        d="M12 4C6.477 4 2 7.523 2 11.86c0 2.783 1.826 5.234 4.583 6.646-.2.75-.727 2.725-.833 3.148-.13.523.19.516.402.375.166-.11 2.646-1.797 3.72-2.53.7.103 1.42.157 2.128.157 5.523 0 10-3.523 10-7.796C22 7.523 17.523 4 12 4Z"
      />
    </svg>
  );
}

function NaverSymbol() {
  return (
    <span
      className="flex h-4 w-4 shrink-0 items-center justify-center text-[13px] font-black leading-none text-white"
      aria-hidden="true"
    >
      N
    </span>
  );
}

function GoogleSymbol() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

interface SocialLoginPanelProps {
  onSocialLogin: (provider: string, role?: UserRole) => void;
  onBackToHome: () => void;
}

export function SocialLoginPanel({ onSocialLogin, onBackToHome }: SocialLoginPanelProps) {
  return (
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
          원하시는 소셜 채널 계정을 통해 간편하게 로그인하시면 관심 정책을 즉각 담아두고 신청 준비
          체크리스트 관리를 바로 시작하실 수 있습니다.
        </p>
      </div>

      {/* Login button column */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => onSocialLogin('카카오')}
          className={`flex w-full items-center justify-center space-x-3 rounded-xl py-3 text-sm font-extrabold hover:brightness-95 transition-all cursor-pointer ${KAKAO_BRAND_CLASSES}`}
        >
          <KakaoSymbol />
          <span>카카오 아이디로 로그인</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin('네이버')}
          className={`flex w-full items-center justify-center space-x-3 rounded-xl py-3 text-sm font-extrabold hover:brightness-95 transition-all cursor-pointer ${NAVER_BRAND_CLASSES}`}
        >
          <NaverSymbol />
          <span>네이버 아이디로 로그인</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin('Google')}
          className={`flex w-full items-center justify-center space-x-3 rounded-xl py-3 text-sm font-extrabold hover:bg-black/5 transition-all cursor-pointer ${GOOGLE_BRAND_CLASSES}`}
        >
          <GoogleSymbol />
          <span>Google 아이디로 로그인</span>
        </button>
      </div>

      <div className="space-y-1.5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-left leading-normal">
        <p className="flex items-start">
          ✓ 로그인 진행 시 청년정책 매칭을 위한 개인정보 수집 이용약관 및 개인정보처리방침 조항에
          동의한 것으로 자동 간주합니다.
        </p>
        <p className="flex items-start">
          ✓ YouthPick은 사용자의 민감한 비공개 프로필 정보들을 엄격하게 비공개 보관하며 최소한의
          정보 연동에만 활용합니다.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>비회원 홈 화면으로 돌아가기</span>
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin('데모', 'admin')}
          className="text-xs text-slate-400 hover:text-slate-600 font-bold underline underline-offset-2"
        >
          관리자 데모 로그인
        </button>
      </div>
    </div>
  );
}
