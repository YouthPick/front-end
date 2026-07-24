// 추천 목록이 어떤 기준으로 만들어졌는지 알리는 고지 문구. 홈 미리보기와 맞춤 정책 페이지가 같은 문장을
// 써야 해서 한 곳에 모아둔다. 예전에는 "세부 자격조건 연동 전이라 일부 부적격 정책이 포함될 수 있어요"를
// 양쪽에 복붙해뒀는데, 백엔드가 자격 필터를 적용한 뒤로는 사실과 달라 문구를 정정했다.
const MATCHED_MESSAGE =
  '프로필의 자격 조건(나이·지역·소득 등)을 충족하는 정책만 일치도 순으로 보여드려요.';

// fallback 목록은 자격 필터를 거치지 않은 최신 정책이라, 매칭 결과라고 단정하면 안 된다.
const FALLBACK_MESSAGE =
  '추천 엔진 응답이 지연돼 최신 정책을 대신 보여드리고 있어요. 자격 조건 매칭 결과가 아닙니다.';

interface RecommendationNoticeProps {
  // 추천 엔진 장애로 최신 정책 목록을 대신 보여주는 상태(규칙 10 Degraded).
  isFallback: boolean;
  // 호출부마다 글자 크기·여백이 달라 배치 클래스만 주입받는다. 색과 role은 상태에 따라 이 컴포넌트가 정한다.
  className?: string;
}

export function RecommendationNotice({ isFallback, className }: RecommendationNoticeProps) {
  const toneClass = isFallback ? 'font-bold text-amber-600' : 'text-slate-400';

  return (
    <p
      className={[className, toneClass].filter(Boolean).join(' ')}
      role={isFallback ? 'status' : undefined}
    >
      {isFallback ? FALLBACK_MESSAGE : MATCHED_MESSAGE}
    </p>
  );
}
