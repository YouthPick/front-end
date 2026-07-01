# BOP Front-end Agent Rules

이 문서는 `YouthPick/front-end`에서 작업하는 모든 에이전트와 개발자가 따라야 하는 프론트엔드 구현 규칙이다. 새 기능을 만들거나 기존 코드를 수정하기 전에 반드시 이 파일을 먼저 읽고, 이 규칙과 충돌하는 구현은 하지 않는다.

핵심 목표는 사용자가 현재 상태를 명확하게 이해할 수 있고, API 장애 상황에서도 서비스 흐름이 끊기지 않는 UI를 만드는 것이다.

## 1. 작업 흐름

- 모든 작업은 GitHub Issue를 먼저 만들고, issue 번호가 포함된 브랜치에서 진행한다.
- 브랜치 형식은 `feat/{issue-number}-{short-name}`, `fix/{issue-number}-{short-name}`, `docs/{issue-number}-{short-name}`, `refac/{issue-number}-{short-name}`를 따른다.
- 구현 후에는 `pnpm run format:check`, `pnpm run lint`, `pnpm run build`를 직접 실행하고 PR에 실제 결과를 적는다.
- 단순 설명이나 스텁으로 끝내지 않는다. 동작하는 코드와 검증 결과를 남긴다.
- 백엔드 API/기획/API 명세와 연결되는 변경은 docs 레포의 기획/API 문서를 먼저 확인하고 필요하면 문서도 갱신한다.

## 2. 기술 스택

### 현재 기준

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- TanStack Router
- pnpm
- Biome

### 목표 기준 / 신규 도입 기준

새 기능 또는 구조 개선에서 의존성을 추가하거나 교체할 때는 아래 방향을 우선한다.

- Server State: TanStack Query
- Client State: Zustand
- API Client: Axios 또는 팀에서 합의한 단일 API client
- Styling: Tailwind CSS, shadcn/ui 도입 시 기존 디자인 토큰과 충돌하지 않게 적용
- Form: React Hook Form + Zod
- Notification: Sonner
- Code Quality: Biome

현재 구현이 `fetch` 기반 `shared/api` 또는 기존 구조를 사용하는 경우, 기능 변경 없이 한 번에 전면 교체하지 않는다. TanStack Query, Zustand, Axios, shadcn/ui, React Hook Form, Zod, Sonner 도입은 별도 이슈로 쪼개고, 기존 public hook/API return shape를 최대한 보존한다.

기본 검증 명령은 다음과 같다.

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run format:check
corepack pnpm run lint
corepack pnpm run build
```

Docker/Compose 관련 변경은 로컬에서 가능한 범위로 `docker compose config`, build, runtime smoke를 검증한다. 실행 환경에 Docker가 없으면 PR 검증 결과에 명시한다.

## 3. 폴더 구조

최종 목표 구조는 아래를 기준으로 한다. 필요한 디렉터리만 만들고, 구현되지 않은 빈 폴더를 `.gitkeep`으로 유지하지 않는다.

```text
src
├── app
│   ├── router
│   ├── providers
│   └── store
├── pages
│   ├── HomePage
│   ├── SearchPage
│   ├── PolicyDetailPage
│   ├── ComparePage
│   ├── BookmarkPage
│   ├── BoardPage
│   ├── ChatbotPage
│   ├── MyPage
│   ├── AdminPage
│   └── OnboardingPage
├── features
│   ├── auth
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   ├── store
│   │   └── types
│   ├── onboarding
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   └── types
│   ├── policy-search
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   └── types
│   ├── recommendation
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   └── types
│   ├── compare
│   │   ├── api
│   │   ├── hooks
│   │   ├── store
│   │   ├── components
│   │   └── types
│   ├── bookmark
│   │   ├── api
│   │   ├── hooks
│   │   ├── store
│   │   ├── components
│   │   └── types
│   ├── policy-read
│   │   ├── api
│   │   └── hooks
│   ├── chatbot
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   └── types
│   ├── board
│   │   ├── api
│   │   ├── hooks
│   │   ├── components
│   │   └── types
│   ├── comment
│   │   ├── api
│   │   ├── hooks
│   │   └── components
│   └── admin
│       ├── api
│       ├── hooks
│       ├── components
│       └── types
├── widgets
│   ├── header
│   ├── footer
│   ├── sidebar
│   ├── search-filter
│   ├── policy-list
│   └── recommendation-section
├── shared
│   ├── api
│   │   ├── axios.ts
│   │   └── queryClient.ts
│   ├── ui
│   │   ├── Button
│   │   ├── Modal
│   │   ├── Input
│   │   ├── Skeleton
│   │   └── EmptyState
│   ├── hooks
│   │   ├── useDebounce
│   │   ├── useIntersectionObserver
│   │   └── useModal
│   ├── utils
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── storage.ts
│   ├── constants
│   └── types
└── assets
```

### 레이어 역할

- `app`: 애플리케이션 전역 설정, 라우터, provider, QueryClient, 전역 store 등록, 전역 스타일 연결
- `pages`: 라우트 단위 화면 조립. 페이지는 화면 조립 역할만 수행한다.
- `features`: 비즈니스 기능 단위. 기능별 API, hook, component, store, type을 관리한다.
- `widgets`: 페이지를 구성하는 큰 UI 조각. 예: Header, Footer, PolicyList, SearchFilter
- `shared`: 도메인에 의존하지 않는 공통 모듈. 예: Button, Modal, Input, API client, utils
- `assets`: 이미지, 아이콘, 정적 자산

### 구조 변경 규칙

- `entities` 레이어는 신규 목표 구조에 포함하지 않는다. 기존 `entities` 코드는 기능 변경 또는 리팩터링 이슈에서 `features/*` 또는 `shared/*`로 점진 이전한다.
- `shared`에는 진짜 공통 코드만 둔다. `Policy`, `UserProfile`, `TrackerItem`처럼 특정 도메인에 가까운 타입은 해당 feature에 둔다.
- API 호출은 `shared/api` 또는 `features/*/api`에서만 수행한다.
- 외부 slice에서 내부 파일을 깊게 import하지 않는다. 가능한 해당 feature의 public API를 통해 import한다.

## 4. 컴포넌트 작성 원칙

- 페이지 컴포넌트는 화면 조립에 집중한다.
- 비즈니스 로직은 feature 내부 hook으로 분리한다.
- 공통 UI는 `shared/ui`에 둔다.
- feature 내부에서만 쓰는 UI는 해당 feature의 `components` 또는 기존 slice 관례의 `ui`에 둔다.
- props 이름은 역할이 드러나게 작성한다.
- 한 컴포넌트가 API 호출, 상태 관리, UI 렌더링을 모두 과하게 들고 있지 않게 한다.
- 함수 컴포넌트를 사용하고, `React.FC`는 기본으로 사용하지 않는다.
- list key는 stable id를 사용한다. 동적 list에서 index key는 금지한다.
- event handler 이름은 `handleX`, props callback 이름은 `onX`를 사용한다.
- 조건부 렌더링은 early return 또는 명확한 분기로 작성한다.
- `useEffect`는 외부 시스템 동기화에만 사용한다. 단순 계산은 render 또는 `useMemo`로 처리한다.
- 접근성을 위해 semantic HTML, `button type="button"`, `aria-label`, focus 가능 상태를 고려한다.
- `target="_blank"` 링크에는 `rel="noopener noreferrer"`를 붙인다.

좋은 예:

```tsx
function SearchPage() {
  return (
    <>
      <SearchFilter />
      <PolicyList />
    </>
  );
}
```

나쁜 예:

```tsx
function PolicyCard() {
  useEffect(() => {
    fetch("/api/policies");
  }, []);
}
```

## 5. 상태 관리 원칙

### Server State

서버 데이터는 TanStack Query를 우선 사용한다.

사용 대상:

- 정책 검색
- 정책 상세 조회
- 게시판
- 댓글
- 관리자 데이터
- 추천 정책
- 챗봇 응답
- 읽음 처리 상태

Query 예시:

```tsx
const { data, isLoading, isError } = useQuery(...);
```

Mutation 예시:

```tsx
const mutation = useMutation(...);
```

### Client State / Zustand

Zustand는 여러 화면에서 공유되는 클라이언트 상태만 둔다.

사용한다:

- 인증 상태: `user`, `isAuthenticated`, `role`
- 사용자 선호 정보: `categories`, `region`, `employmentStatus`
- 정책 비교함: `policyIds`
- UI 상태: `theme`, `sidebarOpen`, `modalOpen`

사용하지 않는다:

- 정책 목록: `policyList`
- 정책 상세: `policyDetail`
- 게시글 목록: `boardList`
- 댓글 목록: `commentList`
- 검색 결과: `searchResult`
- 관리자 서버 데이터: `users`, `logs`, `policies`

서버 데이터 전체를 무조건 Zustand에 복사하지 않는다. store는 상태와 action을 함께 정의한다.

```tsx
import { create } from "zustand";

type CompareStore = {
  policyIds: string[];
  addPolicy: (policyId: string) => void;
  removePolicy: (policyId: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareStore>((set) => ({
  policyIds: [],
  addPolicy: (policyId) =>
    set((state) => {
      if (state.policyIds.includes(policyId)) return state;
      if (state.policyIds.length >= 3) return state;
      return { policyIds: [...state.policyIds, policyId] };
    }),
  removePolicy: (policyId) =>
    set((state) => ({
      policyIds: state.policyIds.filter((id) => id !== policyId),
    })),
  clear: () => set({ policyIds: [] }),
}));
```

## 6. API 연동 규칙

- API client는 `shared/api`에 모은다.
- API 호출은 `shared/api` 또는 `features/*/api`에서만 수행한다.
- 컴포넌트에서 직접 `fetch`/`axios`를 호출하지 않는다.
- API 응답 DTO와 UI model을 분리한다.
- API DTO → UI model 변환은 mapper로 분리한다.
- API key 같은 secret은 클라이언트 번들에 직접 노출하지 않는다.
- 브라우저 저장소에는 민감정보를 저장하지 않는다.

HTTP 상태 코드는 다음 기준으로 처리한다.

| 상태 코드 | 의미 | 프론트 처리 |
| --- | --- | --- |
| 401 | 인증 만료 / 비로그인 | 로그인 페이지 이동 또는 로그인 모달 표시 |
| 403 | 권한 없음 | 접근 불가 화면 표시 |
| 404 | 데이터 없음 | Empty UI 또는 “존재하지 않는 데이터” 안내 |
| 409 | 데이터 충돌 | 최신 데이터 재조회 |
| 429 | 요청 과다 | 잠시 후 다시 시도 안내 |
| 500 | 서버 오류 | 에러 페이지 또는 재시도 버튼 표시 |

백엔드 검증 오류와 비즈니스 오류는 HTTP status만 보지 않고, 응답 body의 `code`를 기준으로 처리한다. UI에 표시할 문구는 서버 raw message를 그대로 뿌리지 말고, `code` → 사용자 친화 메시지 매핑을 우선 사용한다.

## 7. 화면 상태 규칙

모든 목록 및 상세 화면은 아래 상태를 반드시 고려한다.

| 상태 | 설명 | UI 예시 |
| --- | --- | --- |
| Loading | 데이터 조회 중 | Skeleton, Spinner |
| Empty | 요청은 성공했지만 보여줄 데이터 없음 | “조회된 정책이 없습니다.” |
| Error | 요청 실패 또는 복구 불가 오류 | 에러 메시지 + 재시도 버튼 |
| Degraded | 검색엔진/추천/챗봇 장애 등으로 대체 결과를 보여주는 상태 | 추천 기능 비활성화, 기본 검색 결과 제공 |
| Stale | 오래된 데이터 또는 업데이트 후 재확인이 필요한 상태 | 새로고침 배너, 데이터 갱신 안내 |

체크 포인트:

- 목록 화면: Loading, Empty, Error 필수
- 상세 화면: Loading, Error 필수
- 챗봇: Degraded 상태 고려. 응답 실패 시 정책 검색 기능만 제공할 수 있어야 한다.
- 추천 정책: Degraded 상태 고려. 추천 엔진 장애 시 최신 정책 목록을 제공할 수 있어야 한다.
- 관리자 페이지: Stale 상태 고려. 정책 데이터 갱신 시 새로고침 안내를 제공한다.

## 8. 디자인 시스템 규칙

디자인은 반드시 현재 디자인 시스템을 따른다. 임의 색상, 임의 radius, 임의 그림자, 임의 폰트를 남발하지 않는다.

현재 디자인 토큰은 `src/index.css`에 정의되어 있다.

- Tailwind `@theme`
  - `--font-sans`
  - `--font-display`
  - `--color-primary`
  - `--color-primary-foreground`
  - `--color-primary-light`
  - `--color-brand-secondary`
  - `--color-secondary`
  - `--color-accent`
  - `--color-success`
  - `--color-border`
- CSS variables
  - `--background`
  - `--surface`
  - `--foreground`
  - `--card`
  - `--muted`
  - `--destructive`
  - `--warning`
  - `--ring`
  - `--radius`

우선 사용 기준:

- 브랜드 CTA: `bg-primary`, `text-primary`, `from-primary to-brand-secondary`
- 카드/패널: `rounded-2xl` 또는 `rounded-3xl`, `bg-white`, `border border-slate-100`, `shadow-sm`
- 보조 배경: `bg-slate-50`, `bg-primary/5`, `bg-primary-light`
- 상태 색상: success/warning/destructive 계열 토큰 또는 Tailwind semantic 색상을 일관되게 사용
- 폰트: `font-sans`, 필요한 display 영역만 `font-display`

금지:

- 기존 토큰과 무관한 hex 색상 직접 추가
- 같은 의미의 버튼/카드 스타일을 매번 새로 만드는 것
- contrast 확인 없이 흐린 텍스트/CTA 색상 추가
- 디자인 시스템과 다른 radius/shadow/spacing을 임의 도입

## 9. TypeScript 규칙

- `any`는 금지한다. 알 수 없는 값은 `unknown`을 사용하고 type guard로 좁힌다.
- `@ts-ignore`는 금지한다. 정말 필요한 경우 `@ts-expect-error`와 이유를 주석으로 남긴다.
- type-only import는 `import type`을 사용한다.
- union state는 string union 또는 discriminated union을 사용한다.
- nullable 값은 명시적으로 처리한다.
- public API에 노출되는 함수/컴포넌트 props는 타입을 명확히 선언한다.
- 타입 단언 `as`는 런타임 검증이 있거나 라이브러리 경계에서 불가피할 때만 사용한다.

권장:

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

## 10. 네이밍 규칙

| 종류 | 형식 | 예시 |
| --- | --- | --- |
| Component | PascalCase.tsx | PolicyCard.tsx |
| Hook | camelCase.ts 또는 기존 파일 관례 | usePolicySearch.ts |
| Store | camelCase.ts | authStore.ts |
| API | camelCase.ts | policyApi.ts |
| Utils | camelCase.ts | formatDate.ts |
| Types | camelCase.ts 또는 `types.ts` | policy.types.ts |
| Constants | camelCase.ts | policy.constants.ts |

- Component 이름은 PascalCase를 사용한다.
- Component 이름은 `[도메인][역할]`이 드러나게 작성한다. 예: `PolicyCard`, `PolicyList`, `CommentForm`
- Hook 이름은 `use + 기능명`을 사용한다. 예: `useLogin`, `usePolicySearch`
- Store 이름은 `[기능]Store`를 사용한다. 예: `authStore`, `compareStore`
- Type/Interface 이름은 PascalCase 명사 형태를 사용한다. 예: `Policy`, `User`, `BoardPost`
- Zustand store type은 PascalCase `[기능]Store`를 사용한다. 예: `AuthStore`, `CompareStore`
- Constants는 UPPER_SNAKE_CASE를 사용한다. 예: `MAX_COMPARE_COUNT`, `DEFAULT_PAGE_SIZE`

금지:

```text
card.tsx
list.tsx
data.ts
temp.ts
util.ts
test2.ts
```

권장:

```text
PolicyCard.tsx
PolicyList.tsx
formatPolicyDate.ts
policyApi.ts
```

## 11. 반응형 기준

필수 확인 해상도:

```text
390px
768px
1440px
```

최소 390px 모바일 환경에서 깨지지 않아야 한다.

## 12. PR 전 체크리스트

- [ ] GitHub Issue를 만들고 issue 번호 브랜치에서 작업했다.
- [ ] API 명세서의 성공/실패 케이스를 반영했다.
- [ ] Loading 상태를 구현했다.
- [ ] Empty 상태를 구현했다.
- [ ] Error 상태를 구현했다.
- [ ] Degraded/Stale 상태가 필요한 화면인지 확인했다.
- [ ] 모바일 390px에서 확인했다.
- [ ] 비로그인 사용자의 흐름을 확인했다.
- [ ] 권한 필요 화면에서 비로그인/권한 없음 흐름을 확인했다.
- [ ] Zustand 사용 범위가 과하지 않은지 확인했다.
- [ ] TanStack Query를 우선적으로 사용했거나, 미도입 사유를 남겼다.
- [ ] 컴포넌트 이름과 props가 역할을 드러낸다.
- [ ] API 호출이 컴포넌트 내부에 직접 들어가지 않았다.
- [ ] 공통 UI는 `shared/ui`, 기능 UI는 해당 feature에 위치한다.
- [ ] 디자인 시스템 토큰과 기존 UI 패턴을 따랐다.
- [ ] `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않았다.
- [ ] 접근성 기본 요소를 확인했다.
- [ ] `pnpm run format:check`를 실행했다.
- [ ] `pnpm run lint`를 실행했다.
- [ ] `pnpm run build`를 실행했다.

## 13. 팀 공통 원칙

1. 서버 데이터는 TanStack Query를 우선 사용한다.
2. Zustand는 UI 상태 및 사용자 상태만 저장한다.
3. API 호출은 컴포넌트 내부에서 직접 수행하지 않는다.
4. 모든 화면은 Loading / Empty / Error 상태를 가진다.
5. 기능은 feature 단위로 분리한다.
6. 공통 UI는 `shared/ui`에 위치한다.
7. 사용자는 항상 현재 상태를 이해할 수 있어야 한다.
8. 장애 상황에서도 서비스 흐름이 끊기지 않아야 한다.
9. 구현보다 일관성을 우선한다.
10. 기존 구조와 목표 구조가 충돌하면 한 번에 갈아엎지 말고 이슈를 나누어 점진 이전한다.
