---
description: 작업 흐름, 이슈 우선 워크플로우, Git 브랜치/커밋/PR, 완료 전 검증. 항상 적용.
---

# 작업 흐름 / Git / 검증

모든 작업에 항상 적용된다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. 작업 흐름

- 모든 작업은 GitHub Issue를 먼저 만들고, issue 번호가 포함된 브랜치에서 진행한다.
- `main` 직접 커밋 금지, 이슈 없이 임의 브랜치 작업 금지.
- 구현 후에는 검증 명령을 **직접 실행**하고 PR에 실제 결과를 적는다.
- 단순 설명이나 스텁으로 끝내지 않는다. 동작하는 코드와 검증 결과를 남긴다.
- 백엔드 API/기획/API 명세와 연결되는 변경은 docs 레포의 기획/API 문서를 먼저 확인하고 필요하면 문서도 갱신한다.

## 2. Git 컨벤션

브랜치 형식:

```text
feat/{issue-number}-{short-name}
fix/{issue-number}-{short-name}
docs/{issue-number}-{short-name}
refac/{issue-number}-{short-name}
```

허용 타입: `feat`, `fix`, `docs`, `refac`, `test`, `chore`.

커밋 형식:

```text
type: subject
```

PR 본문에는 변경 요약, 실제 검증 결과, 필요 시 스크린샷/로그, 연결 이슈(`Closes #issue-number`)를 포함한다. 관련 없는 변경을 한 PR에 섞지 않는다.

## 3. 검증 명령

완료를 주장하기 전에 아래를 실행해 통과를 확인한다.

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run lint    # biome check . && tsc --noEmit
corepack pnpm run build   # vite build
```

- 포맷/import/lint 자동 정리는 `corepack pnpm run format`(또는 `pnpm run check`)로 먼저 처리한다.
- `lint`(Biome + `tsc --noEmit`) 통과, `build` 성공이어야 한다.
- 결과(성공/실패, 주요 로그)를 PR 검증란에 실제로 적는다. 추측으로 적지 않는다.
- Docker/Compose 관련 변경은 가능한 범위로 `docker compose config`, build, runtime smoke를 검증한다. Docker가 없으면 PR 검증 결과에 명시한다.

## 4. PR 전 체크리스트

- [ ] GitHub Issue를 만들고 issue 번호 브랜치에서 작업했다.
- [ ] FSD 레이어 의존 방향을 지켰다. ([`architecture.md`](./architecture.md))
- [ ] Container/Presenter 역할을 분리하고 기능 로직을 custom hook으로 분리했다. ([`component-pattern.md`](./component-pattern.md))
- [ ] 디자인 시스템 토큰과 기존 UI 패턴을 따랐다. ([`design-system.md`](./design-system.md))
- [ ] `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않았다. ([`typescript.md`](./typescript.md))
- [ ] API DTO와 UI model을 분리하고, 에러는 백엔드 `code` 기준으로 매핑했다. ([`api-design.md`](./api-design.md))
- [ ] loading/error/empty/fallback 상태를 처리했다.
- [ ] 접근성 기본 요소를 확인했다. ([`react.md`](./react.md))
- [ ] `corepack pnpm run lint`, `corepack pnpm run build`를 실행했다.
