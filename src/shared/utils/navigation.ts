// ProtectedRoute가 넘긴 location.state.from을 안전하게 파싱한다.
export function getRedirectPath(state: unknown): string | null {
  if (typeof state !== "object" || state === null) return null;
  const from = (state as Record<string, unknown>).from;
  return typeof from === "string" ? from : null;
}
