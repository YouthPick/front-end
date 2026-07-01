# AGENTS.md

이 레포에서 작업하는 모든 에이전트는 작업 전에 반드시 [`rules.md`](./rules.md)를 읽고 따른다.

## 필수 작업 규칙

1. `rules.md`를 현재 작업의 최우선 프론트엔드 구현 규칙으로 사용한다.
2. 모든 작업은 GitHub Issue 생성 → issue 번호 브랜치 생성 → 작업/커밋 → PR 생성 → 리뷰/검증 확인 → merge 흐름을 따른다.
3. 패키지 구조는 FSD를 유지한다: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
4. 새 기능은 Container/Presenter 패턴을 사용하고, 기능 로직은 custom hook으로 분리한다.
5. 디자인은 항상 `src/index.css`의 디자인 토큰과 기존 디자인 시스템을 따른다.
6. React/TypeScript 코드는 strict type-safety를 지향하고 `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않는다.
7. API DTO와 UI model을 분리하고 mapper를 둔다.
8. loading/error/empty 상태와 접근성 기본 요소를 확인한다.
9. 변경 후 `pnpm run lint`, `pnpm run build`를 실행하고 실제 결과를 PR에 적는다.

## Git 작업 컨벤션

브랜치 형식:

```text
feat/{issue-number}-{short-name}
fix/{issue-number}-{short-name}
docs/{issue-number}-{short-name}
refac/{issue-number}-{short-name}
```

커밋 형식:

```text
type: subject
```

사용 타입:

- `feat`: 사용자에게 보이는 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `refac`: 기능 변경 없는 구조 개선
- `test`: 테스트 추가/수정
- `chore`: 설정, 빌드, 패키지 등 기타 작업

PR 본문에는 변경 내용, 테스트 결과, 필요한 스크린샷/로그, 연결 이슈(`Closes #이슈번호`)를 적는다.

## 검증 명령

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run lint
corepack pnpm run build
```

Docker/Compose 관련 변경은 로컬에서 가능한 범위로 `docker compose config`와 build/smoke를 확인한다. 실행 환경에 Docker가 없으면 그 사실을 PR 검증 결과에 명시한다.
