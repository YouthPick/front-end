import React from "react";
import { Heart, Briefcase, Home, GraduationCap, Flame, ThumbsUp, Sparkles, CheckSquare, Square } from "lucide-react";
import { Policy } from "../types";

interface PolicyCardProps {
  key?: string | number;
  policy: Policy;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (policy: Policy) => void;
  isComparing: boolean;
  onToggleCompare: (policy: Policy) => void;
}

export default function PolicyCard({
  policy,
  isSaved,
  onToggleSave,
  onViewDetails,
  isComparing,
  onToggleCompare
}: PolicyCardProps) {
  // Select color styles depending on the category
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "일자리":
        return { bg: "bg-primary/10 text-primary border-primary/20", labelBg: "bg-primary text-white" };
      case "주거":
        return { bg: "bg-blue-50 text-blue-600 border-blue-100", labelBg: "bg-blue-600 text-white" };
      case "교육":
        return { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", labelBg: "bg-indigo-600 text-white" };
      case "복지·문화":
        return { bg: "bg-rose-50 text-rose-600 border-rose-100", labelBg: "bg-rose-600 text-white" };
      default:
        return { bg: "bg-amber-50 text-amber-600 border-amber-100", labelBg: "bg-amber-600 text-white" };
    }
  };

  const getTagStyles = (tag: string) => {
    if (tag === "HIGH") {
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    }
    return "bg-sky-50 text-sky-600 border-sky-100";
  };

  const IconMap = {
    job: Briefcase,
    home: Home,
    education: GraduationCap,
    heart: Heart,
    hand: ThumbsUp
  };

  const LogoIcon = IconMap[policy.logoType] || Briefcase;
  const colors = getCategoryStyles(policy.category);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="space-y-3.5">
        
        {/* Top Badges and subtle compare checkbox */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${colors.bg} border`}>
              {policy.category}
            </span>
            <span className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400">
              {policy.region}
            </span>
            {policy.tag && (
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getTagStyles(policy.tag)}`}>
                {policy.tag}
              </span>
            )}
          </div>

          {/* Elegant compare action badge */}
          <button
            onClick={() => onToggleCompare(policy)}
            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-bold border transition-colors ${
              isComparing 
                ? "bg-primary/10 border-primary/30 text-primary" 
                : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
            }`}
            id={`compare-toggle-${policy.id}`}
          >
            <span>비교</span>
            {isComparing ? (
              <CheckSquare className="h-3 w-3" />
            ) : (
              <Square className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Policy Body */}
        <div className="text-left space-y-1">
          <h3 className="line-clamp-1 text-sm font-bold text-slate-800" title={policy.title}>
            {policy.title}
          </h3>
          <p className="line-clamp-2 h-7.5 text-[11px] leading-relaxed text-slate-400 font-medium">
            {policy.description}
          </p>
        </div>

        {/* Support single line metadata matching screenshot */}
        <div className="text-left border-t border-slate-100/75 pt-3 text-[10px] font-bold text-slate-400">
          <span>지원 대상 {policy.target}</span>
          <span className="mx-2 text-slate-200">|</span>
          <span>마감 <span className="text-primary font-extrabold">{policy.deadline}</span></span>
        </div>
      </div>

      {/* Card Action Buttons (자세히 보기, 찜하기 with Heart icon) */}
      <div className="mt-4.5 flex items-center gap-2 border-t border-slate-100/75 pt-3.5">
        <button
          onClick={() => onViewDetails(policy)}
          className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          id={`view-details-${policy.id}`}
        >
          자세히 보기
        </button>

        {/* Save Toggle matching the screenshot text label "찜하기" */}
        <button
          onClick={() => onToggleSave(policy.id)}
          className={`flex-1 flex items-center justify-center space-x-1 rounded-xl border py-2.5 text-xs font-bold transition-colors ${
            isSaved
              ? "bg-rose-50 border-rose-100 text-rose-500"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          }`}
          id={`save-toggle-${policy.id}`}
        >
          <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
          <span>찜하기</span>
        </button>
      </div>
    </div>
  );
}
