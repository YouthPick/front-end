// 서비스 내부 경로인지 확인한다. 외부 주소로의 open redirect를 막기 위해 "/"로 시작하고
// "//", "://", "\"(브라우저가 프로토콜-상대 경로로 해석할 수 있는 백슬래시)를
// 포함하지 않는 값만 허용한다.
export function isInternalPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('://') &&
    !value.includes('\\')
  );
}

// ProtectedRoute가 넘긴 location.state.from을 안전하게 파싱한다.
export function getRedirectPath(state: unknown): string | null {
  if (typeof state !== 'object' || state === null) return null;
  const from = (state as Record<string, unknown>).from;
  return isInternalPath(from) ? from : null;
}

// 마이페이지 "수정" 버튼처럼 명시적으로 프로필 수정을 의도하고 온보딩 페이지에 진입했는지 확인한다.
// URL 직접 입력·북마크 등 의도치 않은 진입과 구분하는 데 쓴다.
export function hasEditIntent(state: unknown): boolean {
  if (typeof state !== 'object' || state === null) return false;
  return (state as Record<string, unknown>).intent === 'edit';
}
