# BOP Front-end — Agent Guide

모든 코딩 에이전트(그리고 새로 합류한 개발자)의 공통 진입점이다. 상세 규칙은 [`.claude/rules/`](./.claude/rules)에 주제별로 나뉘어 있다. Claude Code는 `CLAUDE.md`의 `@AGENTS.md` import로 이 문서를 로드하고, 다른 에이전트는 아래 규칙 문서 맵을 보고 작업 관련 파일을 먼저 읽는다.

## 프로젝트 개요

- 청년 정책 추천 서비스 **BOP** 프론트엔드 SPA
- React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · pnpm 11.9.0
- 포매터/린터: **Biome** (`biome.json`). 포맷·import 정리·lint를 한 도구로 처리. 타입 검증은 `tsc --noEmit`가 담당.
- 구조: Feature-Sliced Design(FSD) — `app / pages / widgets / features / entities / shared`
- 빌드: Vite 정적 SPA. production smoke는 Vite preview 서버(`pnpm start`)로 확인하고 별도 Node 서버를 추가하지 않는다.
- 백엔드 API 연동: 에러는 HTTP status가 아니라 응답 body의 `code` 기반으로 사용자 메시지를 매핑한다.
- 디자인 토큰은 `src/index.css`에 정의된 것만 사용한다.

## 검증 명령

완료를 주장하기 전에 실행해 통과를 확인하고, PR에 실제 결과를 적는다.

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run format  # biome format --write . (자동 정리, 선택)
corepack pnpm run lint     # biome check . && tsc --noEmit
corepack pnpm run build    # vite build
```

로컬 인프라가 필요한 변경은 `docker compose config`와 가능한 build/smoke를 확인하고, Docker가 없으면 PR 검증 결과에 명시한다.

## Non-negotiable rules (요약)

- `main` 직접 커밋 금지, 이슈 없이 임의 브랜치 작업 금지. 브랜치는 `feat|fix|docs|refac/{issue-number}-{short-name}`.
- FSD 레이어 의존 방향을 지킨다: `app → pages → widgets → features → entities → shared`. 하위→상위 import 금지.
- slice 외부에서는 내부 파일을 깊게 import하지 않고 `index.ts`(public API)를 통한다.
- 새/큰 변경 기능은 Container/Presenter로 분리하고, 기능 로직은 `model`의 `use*` custom hook에 둔다. Presenter는 props로 렌더만 하고 API/스토리지/복잡한 상태 전이를 소유하지 않는다.
- API 응답 DTO와 UI model을 분리하고 변환은 `lib/*-mapper.ts`에 둔다. 비즈니스 에러는 백엔드 `code` 기준으로 사용자 메시지를 매핑하고 raw exception/message를 노출하지 않는다.
- 디자인은 `src/index.css` 토큰과 기존 UI 패턴을 따른다. 임의 색/spacing/radius/shadow/폰트 도입 금지.
- `any`, 불필요한 `as`, `@ts-ignore` 금지.
- loading/error/empty/fallback 상태와 접근성(semantic HTML, `button type`, aria, 외부 링크 `rel`)을 처리한다.
- secret / API key / token을 코드·로그·응답·브라우저 저장소에 노출하지 않는다. `.env`는 커밋하지 않는다.
- 완료 전 검증(lint·build)을 실행하고 결과를 남긴다.

## 규칙 문서 맵

| 문서 | 내용 | 적용 범위 |
|------|------|-----------|
| [`.claude/rules/workflow.md`](./.claude/rules/workflow.md) | 작업 흐름, 이슈 우선, Git 브랜치/커밋/PR, 완료 전 검증 | 항상 |
| [`.claude/rules/architecture.md`](./.claude/rules/architecture.md) | FSD 레이어, slice 내부 구조, 의존 방향, public API | `src` |
| [`.claude/rules/component-pattern.md`](./.claude/rules/component-pattern.md) | Container/Presenter, `model`의 custom hook | `src/**/ui`, `src/**/model` |
| [`.claude/rules/react.md`](./.claude/rules/react.md) | React 컨벤션, 접근성, 상태 관리 | `src/**/*.tsx` |
| [`.claude/rules/typescript.md`](./.claude/rules/typescript.md) | TS strict 컨벤션, DTO↔model, union 상태 | `src/**/*.ts(x)` |
| [`.claude/rules/api-design.md`](./.claude/rules/api-design.md) | API 레이어, DTO/매퍼, `code` 기반 에러 처리 | `src/**/api`, `*-mapper.ts` |
| [`.claude/rules/design-system.md`](./.claude/rules/design-system.md) | 디자인 토큰, 색/radius/shadow, 공통 UI 배치 | `src`, `index.css` |
| [`.claude/rules/naming.md`](./.claude/rules/naming.md) | 파일/이름 규칙, barrel export | `src` |
| [`.claude/rules/testing.md`](./.claude/rules/testing.md) | 테스트 작성/실행, 유형별 확인 | `src`, 테스트 |

## 에이전트 하네스 (.claude/)

- `.claude/commands/fix-issue.md` — `/fix-issue <이슈번호>`. 이슈 우선 워크플로우로 구현→검증→PR.
- `.claude/agents/code-reviewer.md` — 수정하지 않고 리뷰만 하는 전용 에이전트.
- `.claude/skills/security-review/` — 프론트 보안 점검 스킬.
- `.claude/workflows/pr-review.js` — 관점별 병렬 리뷰 → 적대적 검증 → 종합 워크플로우.
- `.claude/hooks/` — `block-secrets.sh`(파괴적 삭제·시크릿 노출 차단), `format-on-save.sh`(prettier 있을 때 포맷). `settings.json`에 연결됨.
- `.claude/output-styles/teaching.md` — 설명을 덧붙이는 말투.
- `CLAUDE.local.md`, `.claude/settings.local.json` — 개인/로컬 전용(gitignore).
