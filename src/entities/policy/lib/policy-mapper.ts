import type { Policy, PolicyCategory } from "../model/types";
import type { PolicyCardDto, PolicyDetailDto } from "../api/policy-api";

const KNOWN_CATEGORIES: PolicyCategory[] = ["일자리", "주거", "교육", "복지문화", "참여권리"];

function normalizeCategory(category: string): PolicyCategory {
  const normalized = category.replace(/・|·/g, "");
  return KNOWN_CATEGORIES.includes(normalized as PolicyCategory) ? normalized as PolicyCategory : "참여권리";
}

function logoTypeFor(category: PolicyCategory): Policy["logoType"] {
  switch (category) {
    case "일자리":
      return "job";
    case "주거":
      return "home";
    case "교육":
      return "education";
    case "복지문화":
      return "heart";
    case "참여권리":
      return "hand";
  }
}

function deadlineFromPeriod(applicationPeriod: string): string {
  if (!applicationPeriod || applicationPeriod === "미정") return "상시모집";
  const parts = applicationPeriod.split(/[~～-]/).map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? applicationPeriod;
}

export function mapPolicyCardDto(dto: PolicyCardDto): Policy {
  const category = normalizeCategory(dto.category || "참여권리");
  return {
    id: dto.policyId,
    title: dto.title,
    category,
    region: dto.region || "전국",
    tag: dto.applicationStatus === "마감임박" ? "마감임박" : "NEW",
    description: dto.summary || dto.supportContent || "정책 요약 정보가 없습니다.",
    target: "전체",
    deadline: "상세확인",
    logoType: logoTypeFor(category),
    details: [
      dto.supportContent ? `지원내용: ${dto.supportContent}` : "지원내용: 상세 화면에서 확인하세요.",
      dto.organizationName ? `운영기관: ${dto.organizationName}` : "운영기관: 미정",
      dto.applicationStatus ? `신청상태: ${dto.applicationStatus}` : "신청상태: 미정",
    ],
    link: "#",
  };
}

export function mapPolicyDetailDto(dto: PolicyDetailDto, fallback?: Policy): Policy {
  const category = normalizeCategory(dto.category || fallback?.category || "참여권리");
  return {
    id: dto.policyId,
    title: dto.title,
    category,
    region: dto.region || fallback?.region || "전국",
    tag: fallback?.tag ?? "NEW",
    description: dto.description || fallback?.description || "정책 설명 정보가 없습니다.",
    target: dto.eligibility || fallback?.target || "전체",
    deadline: deadlineFromPeriod(dto.applicationPeriod) || fallback?.deadline || "상세확인",
    logoType: logoTypeFor(category),
    details: [
      dto.supportContent && `지원내용: ${dto.supportContent}`,
      dto.eligibility && `자격조건: ${dto.eligibility}`,
      dto.businessPeriod && `사업기간: ${dto.businessPeriod}`,
      dto.applicationMethod && `신청방법: ${dto.applicationMethod}`,
      dto.organizationName && `운영기관: ${dto.organizationName}`,
    ].filter(Boolean) as string[],
    link: dto.referenceUrl || fallback?.link || "#",
  };
}
