import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
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
  );
}
