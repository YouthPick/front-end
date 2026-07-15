// 서비스 내부 경로인지 확인한다. 외부 주소로의 open redirect를 막기 위해 "/"로 시작하고
// "//"나 "://"를 포함하지 않는 값만 허용한다.
export function isInternalPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('://')
  );
}

// ProtectedRoute가 넘긴 location.state.from을 안전하게 파싱한다.
export function getRedirectPath(state: unknown): string | null {
  if (typeof state !== 'object' || state === null) return null;
  const from = (state as Record<string, unknown>).from;
  return isInternalPath(from) ? from : null;
}
