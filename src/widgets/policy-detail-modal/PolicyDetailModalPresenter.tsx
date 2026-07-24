import type { LucideIcon } from 'lucide-react';
import {
  Ban,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  HelpCircle,
  Info,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

import { getPolicyCategoryBadgeClasses, type Policy } from '@/entities/policy';
import { PolicyChatContainer } from '@/features/policy-chat';

interface PolicyDetailField {
  key: string;
  label: string;
  icon: LucideIcon;
  value: string | null;
}

function getPolicyDetailFields(policy: Policy): PolicyDetailField[] {
  return [
    { key: 'support', label: '지원내용', icon: CheckCircle2, value: policy.supportContent },
    {
      key: 'qualification',
      label: '신청자격',
      icon: UserCheck,
      value: policy.additionalQualification,
    },
    { key: 'method', label: '신청방법', icon: ClipboardList, value: policy.applicationMethod },
    { key: 'documents', label: '제출서류', icon: FileText, value: policy.submissionDocuments },
    {
      key: 'screening',
      label: '심사(선발)방법',
      icon: ClipboardCheck,
      value: policy.screeningMethod,
    },
    {
      key: 'restriction',
      label: '참여제한사항',
      icon: Ban,
      value: policy.participationRestriction,
    },
  ];
}

interface PolicyDetailModalPresenterProps {
  policy: Policy;
  isSaved: boolean;
  onToggleSave: (policyId: string) => void;
  onStartTracker: (policy: Policy) => void;
  onClose: () => void;
}

export function PolicyDetailModalPresenter({
  policy,
  isSaved,
  onToggleSave,
  onStartTracker,
  onClose,
}: PolicyDetailModalPresenterProps) {
  const detailFields = getPolicyDetailFields(policy).filter(
    (field): field is PolicyDetailField & { value: string } => Boolean(field.value),
  );
  const hasAnyDetail = detailFields.length > 0 || policy.details.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex w-full max-w-lg flex-col rounded-3xl bg-white p-6 shadow-2xl lg:h-[82vh] lg:max-w-4xl xl:max-w-5xl"
        id="policy-detail-modal"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 pb-4">
          <div className="text-left space-y-1.5">
            <div className="flex items-center space-x-2">
              <span
                className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
              >
                {policy.category}
              </span>
              <span className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                {policy.region}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-slate-800">{policy.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="상세 정보 닫기"
            className="rounded-full p-1.5 transition-colors hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Content body: 상세 정보 컬럼 + 정책 채팅 컬럼(lg 이상에서 나란히, 그 아래는 세로로 쌓임) */}
        <div className="mt-4 min-h-0 lg:flex lg:flex-1 lg:gap-5">
          <div className="space-y-5 text-left max-h-[58vh] overflow-y-auto pr-1 lg:h-full lg:max-h-none lg:min-h-0 lg:min-w-0 lg:flex-1">
            {/* Intro description */}
            <div className="rounded-2xl bg-slate-50/50 border border-slate-100 p-4">
              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                {policy.description}
              </p>
            </div>

            {/* Quick info row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 rounded-2xl bg-primary/5 p-3 border border-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <span className="block text-[10px] text-slate-400">신청 마감</span>
                  <span className="text-xs font-bold text-slate-700">{policy.deadline}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-2xl bg-blue-50/50 p-3 border border-blue-50">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="block text-[10px] text-slate-400">지원 대상</span>
                  <span className="text-xs font-bold text-slate-700">{policy.target}</span>
                </div>
              </div>
            </div>

            {/* Field-by-field benefit/application info sections */}
            {hasAnyDetail ? (
              <div className="space-y-4">
                {detailFields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center">
                      <field.icon className="h-4 w-4 text-primary mr-1 shrink-0" />
                      <span>{field.label}</span>
                    </h3>
                    <p className="text-xs text-slate-600 pl-5 leading-relaxed">{field.value}</p>
                  </div>
                ))}

                {policy.details.length > 0 && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center">
                      <Info className="h-4 w-4 text-primary mr-1 shrink-0" />
                      <span>기타 안내사항</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 pl-5 leading-relaxed">
                      {policy.details.map((detail) => (
                        <li key={detail} className="flex items-start">
                          <span className="mr-1.5 text-primary">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                등록된 상세 혜택·신청요건 정보가 없습니다.
              </p>
            )}
          </div>

          {/* 정책 채팅: lg 이상에서는 오른쪽에 모달 높이만큼 길게, 그 아래에서는 상세 정보 다음에 표시 */}
          <div className="mt-5 lg:mt-0 lg:h-full lg:min-h-0 lg:w-96 lg:shrink-0">
            <PolicyChatContainer policyId={policy.id} />
          </div>
        </div>

        {/* Modal footer actions */}
        <div className="mt-6 flex shrink-0 items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onToggleSave(policy.id)}
            aria-pressed={isSaved}
            className={`flex items-center justify-center space-x-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
              isSaved
                ? 'bg-yellow-50 border-yellow-100 text-yellow-500 hover:bg-yellow-100/50'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-yellow-500'
            }`}
          >
            <Star className={`h-4.5 w-4.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>관심</span>
          </button>

          <button
            type="button"
            onClick={() => onStartTracker(policy)}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-teal-50 border border-teal-200 py-2.5 text-xs font-bold text-teal-600 hover:bg-teal-100 transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            <span>신청관리 시작</span>
          </button>

          {policy.link && (
            <a
              href={policy.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center space-x-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition-all hover:brightness-105"
            >
              <span>공식 공고 ↗</span>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
