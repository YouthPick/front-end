import { ArrowLeft, Sparkles } from "lucide-react";

interface LoginPageProps {
  onSocialLogin: (provider: string) => void;
  onGuestHome: () => void;
}

export function LoginPage({ onSocialLogin, onGuestHome }: LoginPageProps) {
  return (
    <div className="animate-in fade-in duration-300 max-w-md mx-auto py-8">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm text-center space-y-6">
        <div className="space-y-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
            <Sparkles className="h-6 w-6 fill-current animate-spin" style={{ animationDuration: "6s" }} />
          </span>
          <h2 className="text-xl font-black text-slate-800">YouthPick 소셜 계정 연동</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            원하시는 소셜 채널 계정을 통해 간편하게 로그인하시면 관심 정책을 즉각 담아두고 신청 준비 체크리스트 관리를 바로 시작하실 수 있습니다.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => onSocialLogin("카카오")}
            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#FEE500] py-3 text-xs font-extrabold text-[#191919] hover:brightness-95 transition-all cursor-pointer"
          >
            <span className="text-sm font-black">💬</span>
            <span>카카오톡으로 3초만에 계속하기</span>
          </button>

          <button
            onClick={() => onSocialLogin("네이버")}
            className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#03C75A] py-3 text-xs font-extrabold text-white hover:brightness-95 transition-all cursor-pointer"
          >
            <span className="text-sm font-black">N</span>
            <span>네이버 아이디로 편리하게 로그인</span>
          </button>

          <button
            onClick={() => onSocialLogin("Google")}
            className="flex w-full items-center justify-center space-x-3 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <span className="text-sm font-black">G</span>
            <span>Google 계정 연동으로 시작하기</span>
          </button>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-left leading-normal">
          <p className="flex items-start">✓ 로그인 진행 시 청년정책 매칭을 위한 개인정보 수집 이용약관 및 개인정보처리방침 조항에 동의한 것으로 자동 간주합니다.</p>
          <p className="flex items-start">✓ YouthPick은 사용자의 민감한 비공개 프로필 정보들을 엄격하게 비공개 보관하며 최소한의 정보 연동에만 활용합니다.</p>
        </div>

        <button
          onClick={onGuestHome}
          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-600 font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>비회원 홈 화면으로 돌아가기</span>
        </button>
      </div>
    </div>
  );
}
