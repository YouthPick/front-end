// 자유 검색어가 주어진 필드 중 하나에라도 포함되는지 확인한다(대소문자 무시).
// query가 비어있으면(공백 트림 후) 항상 true를 반환한다.
export function matchesTextQuery(fields: string[], query: string | undefined): boolean {
  const normalizedQuery = query?.trim().toLowerCase() ?? '';
  if (normalizedQuery === '') return true;

  return fields.some((field) => field.toLowerCase().includes(normalizedQuery));
}
