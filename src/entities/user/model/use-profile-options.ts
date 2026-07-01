import { useEffect, useState } from "react";
import { fetchProfileOptions } from "../api/profile-options-api";
import type { ProfileOptions } from "./types";

const FALLBACK_PROFILE_OPTIONS: ProfileOptions = {
  regions: [
    "서울특별시",
    "부산광역시",
    "경기도",
    "인천광역시",
    "대구광역시",
    "대전광역시",
    "광주광역시",
    "세종특별자치시",
    "강원특별자치도",
    "제주특별자치도",
  ],
  employmentStatuses: ["미취업·구직", "재직 중", "창업 준비", "창업 중", "프리랜서"],
  educationLevels: ["고등학교 졸업 이하", "대학 재학", "대학 졸업", "대학원 재학", "대학원 졸업"],
  categories: ["일자리", "주거", "교육", "복지문화", "참여권리"],
  keywords: [
    "대출",
    "보조금",
    "바우처",
    "금리혜택",
    "교육지원",
    "맞춤형상담서비스",
    "인턴",
    "배달",
    "중소기업",
    "청년가장",
    "장기미취업청년",
    "공공임대주택",
    "신용회복",
    "육아",
    "출산",
    "해외진출",
    "주거지원",
  ],
  maxInterestCount: 3,
  maxKeywordCount: 5,
};

interface UseProfileOptionsResult {
  options: ProfileOptions;
  isLoading: boolean;
  isFallback: boolean;
  errorMessage: string | null;
}

export function useProfileOptions(): UseProfileOptionsResult {
  const [options, setOptions] = useState<ProfileOptions>(FALLBACK_PROFILE_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);

    fetchProfileOptions(abortController.signal)
      .then((result) => {
        setOptions(result);
        setIsFallback(false);
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setOptions(FALLBACK_PROFILE_OPTIONS);
        setIsFallback(true);
        setErrorMessage(error instanceof Error ? error.message : "프로필 선택지 API 호출에 실패했습니다.");
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, []);

  return {
    options,
    isLoading,
    isFallback,
    errorMessage,
  };
}
