# code-reviewer 메모리

code-reviewer 에이전트가 이 레포를 리뷰하며 축적하는 지속 메모. 리뷰에서 반복되는 패턴·합의된 판단·자주 놓치는 지점을 기록한다. 한 줄에 하나씩, 근거와 함께.

## 프로젝트 고정 사실

- 스택: React 19, TypeScript(strict 지향), Vite 6, Tailwind CSS 4, pnpm 11.9.0. 테스트 러너 미도입.
- 구조: Feature-Sliced Design. 의존 방향 `app → pages → widgets → features → entities → shared` (역방향 import 금지).
- 검증 명령: `corepack pnpm run lint`(= `tsc --noEmit`), `corepack pnpm run build`.
- 디자인 토큰은 `src/index.css`의 `@theme`/`:root`에 정의. 임의 hex/radius/shadow 금지.
- 에러 처리: HTTP status가 아니라 응답 body의 `code` 기준으로 사용자 메시지를 매핑한다.

## 반복 지적 패턴

<!-- 리뷰하며 반복 발견되는 항목을 여기에 추가. 예: -->
<!-- - Presenter에서 fetch/localStorage 직접 호출 → model hook으로 분리 필요. (근거: .claude/rules/component-pattern.md) -->
<!-- - list index key 사용 → stable id로 교체. (근거: .claude/rules/react.md) -->

## 합의된 판단 / 예외

<!-- 팀이 합의한 예외나 관례를 여기에 기록. 예: -->
<!-- - 초기 마이그레이션 중인 src/App.tsx 대형 파일은 기능 변경 시 점진 분리 허용. (근거: .claude/rules/component-pattern.md) -->
