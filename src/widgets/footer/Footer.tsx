import youthPickLogo from '@/assets/images/youthpick-logo.png';
import { CURRENT_YEAR } from '@/shared/constants';

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6">
        <img src={youthPickLogo} alt="BOP 로고" className="h-6 w-auto opacity-70" />
        <p className="text-xs text-slate-400">
          BOP는 청년을 위한 정책 정보를 제공하는 서비스이며, 신청 및 접수는 각 주관 기관 공식 창구를
          통해 진행됩니다.
        </p>
        <p className="text-xs text-slate-300">&copy; {CURRENT_YEAR} BOP. All rights reserved.</p>
      </div>
    </footer>
  );
}
