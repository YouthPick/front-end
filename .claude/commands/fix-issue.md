---
description: GitHub Issue 번호를 받아 이슈 우선 워크플로우로 구현한다.
argument-hint: <issue-number>
allowed-tools: Bash(gh issue *), Bash(gh pr *), Bash(git *), Bash(corepack pnpm *), Read, Edit, Write, Grep, Glob
---

# /fix-issue

이 레포의 이슈 우선 워크플로우로 이슈 하나를 끝까지 처리한다. 반드시 [`AGENTS.md`](../../AGENTS.md)와 정본 상세 규칙 [`rules.md`](../../rules.md)를 먼저 따른다.

## 대상 이슈

`#$1`

## 절차

1. **이슈 파악**: `gh issue view $1`로 배경/작업 범위/검증 항목을 읽는다. 요구가 모호하면 진행 전에 질문한다.
2. **브랜치 생성**: 기본 브랜치 `dev` 최신화 후 이슈 번호 브랜치를 만든다. 타입은 작업 성격에 맞춘다.
   ```bash
   git switch dev && git pull
   git switch -c feat/$1-<short-name>   # 브랜치 타입: feat|fix|docs|refac
   ```
3. **탐색**: 관련 slice와 FSD 레이어를 파악한다. 기존 패턴/디자인 토큰/유사 구현을 먼저 읽는다.
4. **구현**:
   - FSD 의존 방향(`app → pages → widgets → features → entities → shared`)을 지킨다.
   - 새/큰 변경 기능은 Container/Presenter로 분리하고 로직은 `hooks`의 `use*` custom hook에 둔다.
   - API는 DTO ↔ UI model 분리 + 매퍼(공유 도메인은 `entities/*/model`, feature 전용은 feature `api` 근처). 에러는 `code` 기반 매핑.
   - 디자인은 `src/index.css` 토큰과 기존 UI 패턴을 따른다. 임의 색/여백/radius 금지.
   - `any`, 불필요한 `as`, `@ts-ignore` 금지.
   - loading/error/empty/fallback 상태와 접근성(semantic HTML, button type, aria, 외부 링크 rel)을 처리한다.
5. **검증** (실제 실행하고 결과를 기록):
   ```bash
   corepack pnpm run lint       # biome check . && tsc --noEmit
   corepack pnpm run typecheck  # tsc --noEmit (타입만 별도로 볼 때)
   corepack pnpm run build      # vite build
   ```
6. **커밋**: `type: subject` 형식. 관련 없는 변경을 섞지 않는다.
7. **PR**: `.github/PULL_REQUEST_TEMPLATE.md`를 채워 연다. 변경 요약 · 실제 검증 결과 · (UI면) 스크린샷 · `Closes #$1`을 포함한다.
   ```bash
   gh pr create --fill --base dev
   ```
8. **보고**: 무엇을 바꿨고, 검증 결과가 무엇이며, 남은 확인 사항이 있으면 명시한다.

## 하지 말 것

- 이슈/브랜치 없이 바로 구현하지 않는다.
- 검증을 실행하지 않고 "완료"라고 하지 않는다.
- 요청 범위를 넘는 대규모 리팩터링을 임의로 하지 않는다.
