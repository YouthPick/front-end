# AGENTS.md

이 레포에서 작업하는 모든 에이전트는 작업 전에 반드시 [`rules.md`](./rules.md)를 읽고 따른다. `rules.md`가 이 문서보다 상세하며, 충돌 시 `rules.md`를 우선한다.

## 필수 작업 규칙

1. `rules.md`를 현재 작업의 최우선 프론트엔드 구현 규칙으로 사용한다.
2. 모든 작업은 GitHub Issue 생성 → issue 번호 브랜치 생성 → 작업/커밋 → PR 생성 → 리뷰/검증 확인 → merge 흐름을 따른다.
3. 핵심 목표는 사용자가 현재 상태를 명확하게 이해하고, API 장애 상황에서도 서비스 흐름이 끊기지 않는 UI를 만드는 것이다.
4. 현재 스택은 React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Router, pnpm, Biome을 기준으로 한다.
5. 신규 도입/구조 개선은 TanStack Query(server state), Zustand(client state), 단일 API client, React Hook Form + Zod, Sonner, shadcn/ui 방향을 따른다.
6. 기존 `fetch`/기존 구조를 한 번에 전면 교체하지 않는다. TanStack Query, Zustand, Axios, shadcn/ui, form/notification 마이그레이션은 별도 이슈로 쪼갠다.
7. 목표 폴더 구조는 `app`, `pages`, `features`, `widgets`, `shared`, `assets` 중심이다. 신규 코드에서 `entities` 레이어를 확장하지 말고, 기존 `entities` 코드는 점진 이전한다.
8. `shared`에는 진짜 공통 코드만 둔다. 도메인 타입과 기능 로직은 해당 feature에 둔다.
9. API 호출은 `shared/api` 또는 `features/*/api`에서만 수행하고, 컴포넌트에서 직접 `fetch`/`axios`를 호출하지 않는다.
10. 서버 데이터는 TanStack Query를 우선 사용하고, Zustand에는 인증/사용자 선호/비교함/UI 상태 같은 클라이언트 상태만 둔다.
11. 모든 목록/상세 화면은 Loading, Empty, Error 상태를 고려한다. 챗봇/추천/관리자 등은 Degraded 또는 Stale 상태도 고려한다.
12. 디자인은 항상 `src/index.css`의 디자인 토큰과 기존 디자인 시스템을 따른다.
13. React/TypeScript 코드는 strict type-safety를 지향하고 `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않는다.
14. API DTO와 UI model을 분리하고 mapper를 둔다.
15. 접근성을 위해 semantic HTML, `button type="button"`, aria label, focus 상태, 안전한 외부 링크를 확인한다.
16. 변경 후 `pnpm run format:check`, `pnpm run lint`, `pnpm run build`를 실행하고 실제 결과를 PR에 적는다.

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
corepack pnpm run format:check
corepack pnpm run lint
corepack pnpm run build
```

Docker/Compose 관련 변경은 로컬에서 가능한 범위로 `docker compose config`와 build/smoke를 확인한다. 실행 환경에 Docker가 없으면 그 사실을 PR 검증 결과에 명시한다.
