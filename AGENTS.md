# BOP Front-end — Agent Guide

모든 코딩 에이전트(그리고 새로 합류한 개발자)의 공통 진입점이다. **상세 규칙의 정본은 [`.claude/rules.md`](./.claude/rules.md)** (18개 섹션)이며, 코드를 만들거나 수정하기 전에 반드시 먼저 읽고 그대로 따른다. Claude Code는 `CLAUDE.md`의 `@AGENTS.md` · `@.claude/rules.md` import로 이 문서와 상세 규칙을 함께 자동 로드한다. AGENTS.md를 직접 읽는 다른 도구는 이 링크를 따라가 `.claude/rules.md`도 함께 읽는다.

## 프로젝트 개요

- 청년 정책 추천 서비스 **BOP** 프론트엔드 SPA
- Core: React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · pnpm 11.9.0
- Routing: React Router · Server state: TanStack Query · Client state: Zustand · API: Axios
- Code Quality: **Biome** (`biome.json`) — 포맷·import 정리·lint. 타입 검증은 `tsc --noEmit`.
- 구조: Feature-Sliced Design(FSD) — `app / pages / widgets / features / entities / shared`
- 빌드: Vite 정적 SPA. production smoke는 `pnpm build` 후 `pnpm start`(= `vite preview`)로 확인한다. 별도 Node 서버를 추가하지 않는다.
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

## Non-negotiable rules (요약)

> 세부·근거는 [`.claude/rules.md`](./.claude/rules.md)를 본다. 아래는 최소 요약이다.

- 기본 브랜치는 `dev`다(레포 default·통합 브랜치, PR base도 `dev`). `main`은 현재 미사용. `dev` 직접 커밋 금지, 이슈 없이 임의 브랜치 작업 금지. 브랜치는 `feat|fix|docs|refac/{issue-number}-{short-name}`.
- 들여쓰기 2칸 space · quote(JS single/JSX double) · 세미콜론 · trailing comma는 손으로 맞추지 않고 Biome(`biome.json`)가 강제한다. 저장 시 `format-on-save` 훅과 `pnpm run lint`(CI)가 자동 적용·검증한다.
- FSD 레이어 의존 방향을 지킨다: `app → pages → widgets → features → entities → shared`. 하위→상위 및 feature→feature import 금지. slice 외부에서는 `index.ts`(public API)로만 import한다.
- 새/큰 변경 기능은 Container/Presenter로 분리하고, 기능 로직은 `hooks`의 `use*` custom hook에 둔다. Presenter는 props로 렌더만 한다.
- 서버 상태는 TanStack Query, 클라이언트/UI/auth 상태는 Zustand로 관리한다. domain model은 2개 이상 feature가 공유할 때 `entities/{domain}`으로 승격한다.
- API 응답 DTO와 UI model을 분리하고 매퍼로 변환한다. 비즈니스 에러는 백엔드 `code` 기준으로 사용자 메시지를 매핑하고 raw exception/message를 노출하지 않는다.
- 디자인은 `src/index.css` 토큰과 기존 UI 패턴을 따른다. 임의 색/spacing/radius/shadow/폰트 도입 금지.
- `any`, 불필요한 `as`, `@ts-ignore` 금지.
- loading/error/empty/fallback 상태와 접근성(semantic HTML, `button type`, aria, 외부 링크 `rel`)을 처리한다.
- secret / API key / token을 코드·로그·응답·브라우저 저장소에 노출하지 않는다. `.env`는 커밋하지 않는다.
- 완료 전 검증(lint·build)을 실행하고 결과를 남긴다.

## 에이전트 하네스 (.claude/)

- **[`.claude/rules.md`](./.claude/rules.md)** — 정본 상세 규칙 (18개 섹션). 기술 스택 · 작업 흐름 · FSD 폴더 구조 · 컴포넌트/Container·Presenter · Custom Hook · 상태 관리 · API 연동 · HTTP 상태·에러코드 · 화면 상태 · 코드 포맷팅 · React/TypeScript 컨벤션 · 디자인 시스템 · 네이밍 · 반응형 · 테스트/검증 · PR 체크리스트. `CLAUDE.md`의 `@.claude/rules.md` import로 Claude Code 세션에 자동 로드된다.
- `.claude/commands/fix-issue.md` — `/fix-issue <이슈번호>`. 이슈 우선 워크플로우로 구현→검증→PR.
- `.claude/agents/code-reviewer.md` — 수정하지 않고 리뷰만 하는 전용 에이전트.
- `.claude/skills/security-review/` — 프론트 보안 점검 스킬.
- `.claude/workflows/pr-review.js` — 관점별 병렬 리뷰 → 적대적 검증 → 종합 워크플로우.
- `.claude/hooks/` — `block-secrets.sh`(파괴적 삭제·시크릿 노출 차단), `format-on-save.sh`(Biome로 저장 파일 포맷·정리). `settings.json`에 연결됨.
- `.claude/output-styles/teaching.md` — 설명을 덧붙이는 말투.
- `CLAUDE.local.md`, `.claude/settings.local.json` — 개인/로컬 전용(gitignore).
