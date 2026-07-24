#!/usr/bin/env bash
# PostToolUse(Edit|Write) 훅: 방금 저장한 파일을 Biome로 포맷 + 정리한다.
# Biome가 설치돼 있을 때만 동작하고, 없으면 조용히 통과한다.
set -euo pipefail

input=$(cat)

# stdin JSON에서 tool_input.file_path 추출 (node는 이 레포에 항상 존재)
file_path=$(printf '%s' "$input" | node -e '
let d="";
process.stdin.on("data", c => d += c);
process.stdin.on("end", () => {
  try { process.stdout.write(JSON.parse(d).tool_input?.file_path || ""); }
  catch { process.stdout.write(""); }
});
' 2>/dev/null || true)

[ -z "$file_path" ] && exit 0

# Biome가 지원하는 확장자만 (md/yaml 등은 제외)
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.css|*.json|*.jsonc) ;;
  *) exit 0 ;;
esac

[ -f "$file_path" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}"

# 로컬에 설치된 Biome 바이너리가 있을 때만 실행 (없으면 no-op).
# node_modules의 바이너리를 직접 호출한다(pnpm exec의 워크스페이스 파일 생성 부작용 회피).
# check --write: 포맷 + import 정리 + 안전한 lint 자동수정. 저장 파일 하나만 대상으로 한다.
if [ -x "node_modules/.bin/biome" ]; then
  node_modules/.bin/biome check --write --no-errors-on-unmatched "$file_path" >/dev/null 2>&1 || true
fi

exit 0
