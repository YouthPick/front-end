# BOP Front-end Agent Rules

이 문서는 이 레포에서 작업하는 모든 에이전트와 개발자가 따라야 하는 프론트엔드 구현 규칙이다. 새 기능을 만들거나 기존 코드를 수정하기 전에 반드시 이 파일을 먼저 읽고, 이 규칙과 충돌하는 구현은 하지 않는다.

핵심 목표는 사용자가 현재 상태를 명확하게 이해할 수 있고, API 장애 상황에서도 서비스 흐름이 끊기지 않는 UI를 만드는 것이다.

## 1. 기술 스택

- Core: React 19, TypeScript, Vite
- Routing: React Router
- Server State: TanStack Query
- Client State: Zustand
- API Client: Axios
- Styling: Tailwind CSS 4, shadcn/ui
- Form: React Hook Form, Zod
- Notification: Sonner
- Code Quality: Biome
- Package Manager: pnpm

프론트는 Vite 정적 SPA로 빌드하고, production smoke는 Vite preview 서버(`pnpm start`)로 확인한다. 별도 Node 서버를 추가하지 않는다.

## 2. 작업 흐름

- 모든 작업은 GitHub Issue를 먼저 만들고, issue 번호가 포함된 브랜치에서 진행한다.
- 브랜치 형식은 `feat/{issue-number}-{short-name}`, `fix/{issue-number}-{short-name}`, `docs/{issue-number}-{short-name}`, `refac/{issue-number}-{short-name}`를 따른다.
- 커밋 형식은 `type: subject`이며, 허용 type은 `feat`, `fix`, `docs`, `refac`, `test`, `chore`이다.
- PR 본문에는 변경 요약, 테스트 결과, 필요한 경우 스크린샷/로그, 그리고 `Closes #issue-number`로 연결한 이슈를 포함한다.
- 구현 후에는 검증 명령을 직접 실행하고 PR에 실제 결과를 적는다.
- 단순 설명이나 스텁으로 끝내지 않는다. 동작하는 코드와 검증 결과를 남긴다.
- 백엔드 API/기획/API 명세와 연결되는 변경은 docs 레포의 기획/API 문서를 먼저 확인하고 필요하면 문서도 갱신한다.

## 3. FSD 폴더 구조

패키지 구조는 Feature-Sliced Design(FSD) 아키텍처를 따른다. `app`, `pages`, `widgets`, `features`, `entities`, `shared` 6개 레이어로 구성하고, 새 코드는 FSD 레이어 책임에 맞는 위치에 둔다.

```text
src
├── app
│   ├── router
│   ├── providers
│   └── store
├── pages
├── widgets
├── features
│   └── {feature}
│       ├── api          # HTTP 요청 함수, API DTO, endpoint 호출
│       ├── hooks        # custom hook (use 접두)
│       ├── components   # Container / Presenter component
│       ├── store        # feature 전용 Zustand store (필요할 때만)
│       ├── types        # feature 타입
│       └── index.ts     # public API export
├── entities
│   └── {domain}         # 여러 feature가 공유하는 도메인 (policy, user 등)
│       ├── api          # 도메인 DTO, 조회 함수
│       ├── model        # 도메인 타입, mapper, 공용 hook/store
│       ├── ui           # 도메인 표현 컴포넌트 (PolicyCard 등)
│       └── index.ts     # public API export
├── shared
│   ├── api              # axios instance, queryClient
│   ├── ui               # 공통 UI (Button, Modal, Input, Skeleton, EmptyState)
│   ├── hooks            # 공통 hook (useDebounce 등)
│   ├── utils            # date, format, storage 등 순수 함수
│   ├── constants
│   └── types
└── assets
```

레이어 의존 방향은 아래를 따르며, 하위 레이어가 상위 레이어를 import하지 않는다. 같은 레이어 안의 slice끼리도 서로 import하지 않는다(특히 feature → feature 금지).

```text
app → pages → widgets → features → entities → shared
```

각 레이어 책임:

- `app`: 앱 초기화, 전역 provider, 라우팅, 전역 store, 전역 스타일 연결 등 앱 조립 책임
- `pages`: 라우트/page 단위 화면 조립 책임. 화면 조립만 수행한다.
- `widgets`: 여러 feature/entity를 조합한 독립 UI 블록 (Header, Footer, PolicyList, SearchFilter 등)
- `features`: 사용자가 수행하는 행위, use case 단위 비즈니스 기능. API, hook, component를 관리한다.
- `entities`: 여러 feature가 공유하는 비즈니스 도메인의 타입, API, model, 표현 UI
- `shared`: 도메인에 의존하지 않는 공통 UI, hook, util, api, config, types

slice 내부 세그먼트는 팀 컨벤션을 따른다. `features`는 `api / hooks / components / store / types`, `entities`는 FSD 관례대로 `api / model / ui`를 사용한다.

### entities 승격 규칙 (실용 적용)

빈 entity slice를 미리 만들지 않는다. 도메인 코드는 다음 기준으로 배치한다.

- 도메인 모델(타입 · 표현 UI · mapper)이 **한 feature 안에서만** 쓰이면 그 feature 안에 둔다.
- 동일 도메인 모델을 **2개 이상 feature가 공유하게 되면** `entities/{domain}`으로 승격한다.
- 이 프로젝트에서 `Policy`는 `policy-search`, `policy-read`, `compare`, `bookmark`, `recommendation`, `admin`이 공유하므로 `entities/policy`에 둔다. `User`, `BoardPost` 등도 교차 사용되면 같은 기준으로 승격한다.
- feature가 다른 feature의 코드를 직접 import해야 할 상황이 오면, 그건 해당 코드를 `entities`(또는 `shared`)로 올리라는 신호다. feature → feature import로 회피하지 않는다.

외부 slice에서 내부 파일을 깊게 import하지 않는다. 가능한 slice의 public API(`index.ts`)를 통해 import한다.

금지 예시:

```ts
import { FilterBar } from "@features/policy-filter/components/FilterBar";
```

권장 예시:

```ts
import { FilterBar } from "@features/policy-filter";
```

## 4. 컴포넌트 작성 원칙

### 페이지는 조립만 담당

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

### 비즈니스 로직은 feature 내부

기능 로직은 `features/*/hooks`의 custom hook에 둔다.

```text
features/policy-search/hooks/usePolicySearch.ts
```

### 공통 UI는 shared/ui

`Button`, `Modal`, `Input`, `EmptyState`, `Skeleton` 등 도메인 비의존 UI는 `shared/ui`에 둔다. feature 내부에서만 쓰는 UI는 해당 feature의 `components`에 둔다.

### Props 이름은 역할이 드러나게 작성

```tsx
// 좋은 예
<PolicyCard policy={policy} />

// 나쁜 예
<PolicyCard item={policy} />
```

## 5. Container / Presenter 패턴

화면 기능은 Container와 Presenter를 분리한다.

- Container는 상태, side effect, API 호출, event handler 조립을 담당한다.
- Presenter는 props를 받아 렌더링만 담당한다.
- Presenter 내부에서 API 호출, localStorage 접근, 복잡한 상태 전이를 직접 하지 않는다.
- 큰 컴포넌트 하나에 상태와 UI를 모두 넣지 않는다. 기존 큰 파일은 기능 변경 시 점진적으로 hook과 Presenter로 분리한다.

권장 구조:

```text
features/policy-search
├── hooks
│   └── usePolicySearch.ts
├── components
│   ├── PolicySearchContainer.tsx
│   └── PolicySearchPresenter.tsx
└── index.ts
```

Container 예시:

```tsx
export function PolicySearchContainer() {
  const searchState = usePolicySearch();

  return <PolicySearchPresenter {...searchState} />;
}
```

Presenter 예시:

```tsx
interface PolicySearchPresenterProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export function PolicySearchPresenter({ isLoading, onSubmit }: PolicySearchPresenterProps) {
  return (
    <section aria-label="정책 검색">
      <button type="button" onClick={onSubmit} disabled={isLoading}>
        검색
      </button>
    </section>
  );
}
```

### 컴포넌트 조직 규칙

`components` 안을 뎁스 상관없이 flat하게 다 넣지 않는다. **폴더는 렌더 깊이가 아니라 "재사용 범위(누가 쓰는가)"로 나눈다.** 하나의 큰 flat을 만드는 대신, 경계로 쪼갠 작은 flat 여러 개로 구성한다.

배치 규칙 (재사용 범위 순):

- **한 부모에서만 쓰는 자식**은 그 부모와 같은 블록 폴더에 colocate한다.
- **같은 feature 내 여러 컴포넌트가 공유**하면 `components/common`에 둔다.
- **여러 feature가 공유**하면 feature 밖으로 승격한다. 도메인 표현 UI는 `entities/{domain}/ui`, 여러 feature를 조합한 큰 블록은 `widgets`, 도메인 무관 범용 UI는 `shared/ui`로 올린다. "다른 feature의 컴포넌트를 import하고 싶다"는 순간이 곧 승격 신호다.

폴더/파일 판단 기준:

- 자식 컴포넌트가 있는 **블록만 폴더**로 묶는다. 자식 없는 단일 컴포넌트는 `.tsx` 파일 하나로 둔다.
- 폴더 이름은 대표(조립) 컴포넌트 이름과 같게 하고, 폴더 안의 대표 컴포넌트가 자식들을 조립한다.
- 처음부터 폴더를 만들지 않는다. 자식이 분리되어 관련 컴포넌트가 생기는 순간 파일 → 폴더로 승격한다.
- 블록 폴더 안은 flat을 유지하고, 대개 **한 단계**만 내려간다. 자식이 또 여러 자식을 가지면 그 자식이 자기 블록 폴더가 되는 것이지, 폴더를 깊게 중첩하지 않는다.
- Container는 feature 최상위에만 둔다. 중첩 자식은 모두 props를 받는 Presenter로 작성한다.
- 각 블록 폴더는 `index.ts`로 대표 컴포넌트만 노출하고, 외부에서 폴더 내부 파일을 깊게 import하지 않는다.

권장 구조:

```text
features/policy-search/components
├── PolicySearchContainer.tsx     # 진입점 Container (feature당 1~소수)
├── PolicySearchPresenter.tsx      # 최상위 Presenter (하위 블록 조립)
├── PolicyFilter/                  # 자식이 있는 블록 → 폴더
│   ├── PolicyFilter.tsx            #   대표(조립) 컴포넌트
│   ├── PolicyFilterChip.tsx        #   PolicyFilter 전용 자식
│   └── index.ts                    #   export { PolicyFilter }
├── PolicyResultList/
│   ├── PolicyResultList.tsx
│   ├── PolicyResultItem.tsx
│   └── index.ts
└── common/                        # feature 내 2곳 이상 공유하는 단일 조각
    └── EmptyResult.tsx
```

## 6. Custom Hook 규칙

- hook 이름은 반드시 `use`로 시작한다.
- hook은 feature의 `hooks` 디렉터리에 둔다.
- hook은 화면 상태, derived state, event handler, API loading/error 상태를 캡슐화한다.
- hook 내부 effect는 cleanup이 필요한지 확인하고 명확히 작성한다.
- hook return 값은 Presenter가 바로 사용할 수 있는 형태로 구성한다.
- 비동기 요청 hook은 `isLoading`, `errorMessage`, `isFallback`처럼 UI가 상태를 명확히 표현할 수 있는 값을 제공한다.

금지:

```tsx
// Presenter에서 직접 fetch/localStorage/window side effect 수행 금지
function PolicyCard() {
  useEffect(() => {
    axios.get("/api/policies");
  }, []);
}
```

권장:

```tsx
function PolicyListContainer() {
  const { policies, isLoading, errorMessage, reload } = usePolicies();
  return <PolicyListPresenter policies={policies} isLoading={isLoading} errorMessage={errorMessage} onReload={reload} />;
}
```

## 7. 상태 관리 규칙

서버 상태는 TanStack Query, 클라이언트 상태는 Zustand로 관리한다.

### TanStack Query (서버 상태)

정책 검색, 정책 상세, 게시판, 댓글, 관리자 데이터, 추천 정책, 챗봇 응답, 읽음 처리 등 **서버에서 오는 모든 데이터**는 TanStack Query를 우선 사용한다.

```tsx
const { data, isLoading, isError } = useQuery(...);
const mutation = useMutation(...);
```

### Zustand (클라이언트 상태)

Zustand는 아래 용도에만 사용한다.

- 인증 상태: `user`, `isAuthenticated`, `role`
- 사용자 선호 정보: `categories`, `region`, `employmentStatus`
- 정책 비교함: `policyIds`
- UI 상태: `theme`, `sidebarOpen`, `modalOpen`

다음은 **Zustand에 저장 금지**한다 (서버 데이터이므로 TanStack Query로 관리):
`policyList`, `policyDetail`, `boardList`, `commentList`, `searchResult`, 관리자 `users`/`logs`/`policies`.

### 기타

- 컴포넌트 내부에서만 쓰는 UI 상태는 `useState`로 관리한다.
- feature use case 상태는 custom hook으로 분리한다.
- derived state는 원본 state에서 계산한다. 중복 state로 저장하지 않는다.
- localStorage 접근은 `shared/utils/storage` 또는 hook 내부로 캡슐화한다.

## 8. API 연동 규칙

- API 호출 함수는 `shared/api` 또는 feature의 `api` 디렉터리에만 둔다. 컴포넌트에서 직접 axios를 호출하지 않는다.
- API 응답 DTO는 UI model과 분리한다.
- DTO → UI model 변환은 mapper 함수로 처리한다. 공유 도메인이면 `entities/{domain}/model`, feature 전용이면 feature `api` 근처에 둔다.
- API 실패, timeout, 서버 장애, 빈 응답 상태를 UI가 표현할 수 있게 hook에서 상태를 제공한다.
- mock fallback이 필요한 기능은 fallback 여부를 `isFallback` 등으로 노출한다.
- API key 같은 secret은 클라이언트 번들에 직접 노출하지 않는다.
- 브라우저 저장소에는 민감정보를 저장하지 않는다.

나쁜 예:

```tsx
useEffect(() => {
  axios.get(...);
}, []);
```

좋은 예:

```tsx
const policies = await getPolicies();
```

## 9. HTTP 상태 코드 & 에러코드 처리

HTTP status는 **화면 흐름 분기**에 사용하고, 사용자에게 보여줄 **메시지**는 응답 body의 `code`를 기준으로 매핑한다. status만 보고 모든 오류를 같은 메시지로 처리하지 않는다.

### 9.1 HTTP status 기준 흐름 처리

| 상태 코드 | 의미 | 프론트 처리 |
| --- | --- | --- |
| 401 | 인증 만료 / 비로그인 | 로그인 페이지 이동 또는 로그인 모달 표시 |
| 403 | 권한 없음 | 접근 불가 화면 표시 |
| 404 | 데이터 없음 | Empty UI 또는 "존재하지 않는 데이터" 안내 |
| 409 | 데이터 충돌 | 최신 데이터 재조회 |
| 429 | 요청 과다 | 잠시 후 다시 시도 안내 |
| 500 | 서버 오류 | 에러 페이지 또는 재시도 버튼 표시 |

### 9.2 에러코드(body `code`) 기준 메시지 처리

백엔드는 검증/비즈니스 오류를 `C001` 같은 `ErrorCode`로 내려준다. 프론트는 이 코드를 사용자 메시지로 매핑한다.

표준 에러 응답:

```ts
interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Array<{
    field?: string;
    value?: unknown;
    reason?: string;
  }>;
}
```

처리 규칙:

- API client는 실패 응답에서 `code`, `message`, `details`를 파싱해 caller가 사용할 수 있게 보존한다.
- UI 문구는 서버 raw message를 그대로 뿌리지 말고 `code` → 사용자 친화 메시지 매핑을 우선 사용한다.
- 검증 오류 `C001`은 가능하면 `details[].reason`을 함께 보여주되, 여러 field 오류는 대표 메시지 + 세부 항목 형태로 정리한다.
- 알 수 없는 `code`는 공통 fallback 메시지로 처리한다.
- HTTP status, exception text, stack trace, SQL, 내부 endpoint, secret 값은 사용자에게 직접 노출하지 않는다.
- 새 백엔드 `ErrorCode`가 추가되면 프론트의 code-message map 갱신 여부를 확인한다.

권장 예시:

```ts
const ERROR_MESSAGE_BY_CODE: Record<string, string> = {
  C001: "입력값을 다시 확인해 주세요.",
  A001: "로그인이 필요한 기능입니다.",
  P001: "정책 정보를 찾을 수 없습니다.",
};

function getUserMessage(error: ApiErrorResponse): string {
  return ERROR_MESSAGE_BY_CODE[error.code]
    ?? "요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}
```

금지 예시:

```ts
// 서버 내부 message/exception을 그대로 노출하지 않는다.
showToast(error.message);

// status만 보고 모든 400을 같은 메시지로 처리하지 않는다.
if (response.status === 400) showToast("잘못된 요청입니다.");
```

## 10. 화면 상태 규칙

모든 목록 및 상세 화면은 아래 상태를 반드시 고려한다.

| 상태 | 설명 | UI 예시 |
| --- | --- | --- |
| Loading | 데이터 조회 중 | Skeleton, Spinner |
| Empty | 데이터 없음 | "조회된 정책이 없습니다." |
| Error | 복구 불가 오류 | 에러 메시지 + 재시도 버튼 |
| Degraded | 일부 기능 장애 | 추천 비활성화, 기본 검색 결과 제공 |
| Stale | 최신 상태 재확인 필요 | 새로고침 배너, 데이터 갱신 안내 |

체크 포인트:

- 목록 화면: Loading / Empty / Error 필수
- 상세 화면: Loading / Error 필수
- 챗봇: Degraded 고려 (챗봇 응답 실패 → 정책 검색 기능만 제공)
- 추천 정책: Degraded 고려 (추천 엔진 장애 → 최신 정책 목록 제공)
- 관리자 페이지: Stale 고려 (정책 데이터 갱신됨 → 새로고침 안내)

## 11. React 코딩 컨벤션

- 함수 컴포넌트를 사용한다.
- component 이름은 PascalCase, hook 이름은 `use` + camelCase를 사용한다.
- props type은 component 근처에 `interface {ComponentName}Props`로 둔다.
- props는 명시적으로 선언하고, `React.FC`는 기본으로 사용하지 않는다.
- list key는 stable id를 사용한다. 동적 list에서 index key는 금지한다.
- event handler 이름은 `handleX`, props callback 이름은 `onX`를 사용한다.
- 조건부 렌더링은 early return 또는 명확한 분기로 작성한다.
- `useEffect`는 외부 시스템 동기화에만 사용한다. 단순 계산은 render 또는 `useMemo`로 처리한다.
- `useMemo`, `useCallback`은 성능 문제가 있거나 memoized child에 전달할 때만 사용한다.
- 접근성을 위해 semantic HTML, `button type="button"`, `aria-label`, focus 가능 상태를 고려한다.
- `target="_blank"` 링크에는 `rel="noopener noreferrer"`를 붙인다.

## 12. TypeScript 코딩 컨벤션

- `any`는 금지한다. 알 수 없는 값은 `unknown`을 사용하고 type guard로 좁힌다.
- `@ts-ignore`는 금지한다. 정말 필요하면 `@ts-expect-error`와 이유 주석을 남긴다.
- API 응답 DTO와 UI model을 분리하고, 변환은 mapper 함수로 처리한다.
- type-only import는 `import type`을 사용한다.
- union state는 string union 또는 discriminated union을 사용한다.
- nullable 값은 명시적으로 처리한다.
- public API로 노출되는 함수/컴포넌트 props는 타입을 명확히 선언한다.
- 타입 단언 `as`는 런타임 검증이 있거나 라이브러리 경계에서 불가피할 때만 사용한다.

권장:

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

금지:

```ts
const data = response as Policy[];
function parse(value: any) {}
```

## 13. 디자인 시스템 규칙

디자인은 반드시 현재 디자인 시스템을 따른다. 임의 색상, 임의 radius, 임의 그림자, 임의 폰트를 남발하지 않는다. 공통 UI는 shadcn/ui와 `shared/ui`를 우선 활용한다.

현재 디자인 토큰은 `src/index.css`에 정의되어 있다.

- Tailwind `@theme`: `--font-sans`, `--font-display`, `--color-primary`, `--color-primary-foreground`, `--color-primary-light`, `--color-brand-secondary`, `--color-secondary`, `--color-accent`, `--color-success`, `--color-border`
- CSS variables: `--background`, `--surface`, `--foreground`, `--card`, `--muted`, `--destructive`, `--warning`, `--ring`, `--radius`

우선 사용 기준:

- 브랜드 CTA: `bg-primary`, `text-primary`, `from-primary to-brand-secondary`
- 카드/패널: `rounded-2xl` 또는 `rounded-3xl`, `bg-white`, `border border-slate-100`, `shadow-sm`
- 보조 배경: `bg-slate-50`, `bg-primary/5`, `bg-primary-light`
- 상태 색상: success/warning/destructive 계열 토큰을 일관되게 사용
- 폰트: `font-sans`, 필요한 display 영역만 `font-display`

금지:

- 기존 토큰과 무관한 hex 색상 직접 추가
- 같은 의미의 버튼/카드 스타일을 매번 새로 만드는 것
- contrast 확인 없이 흐린 텍스트/CTA 색상 추가
- 디자인 시스템과 다른 radius/shadow/spacing을 임의 도입

## 14. 네이밍 규칙

| 종류 | 형식 | 예시 |
| --- | --- | --- |
| Component | PascalCase.tsx, `[도메인][역할]` | `PolicyCard.tsx`, `PolicyList.tsx`, `CommentForm.tsx` |
| Hook | camelCase.ts, `use` + 기능명 | `usePolicySearch.ts`, `useBookmark.ts` |
| Store | camelCase.ts, `[기능]Store` | `authStore.ts`, `compareStore.ts` |
| API | camelCase.ts, `[기능]Api` | `policyApi.ts`, `boardApi.ts` |
| Mapper | camelCase.ts, `[기능]Mapper` | `policyMapper.ts` |
| Utils | camelCase.ts | `formatDate.ts` |
| Types | camelCase.ts, `[기능].types` | `policy.types.ts` |
| Constants | camelCase.ts (값은 UPPER_SNAKE_CASE) | `MAX_COMPARE_COUNT`, `DEFAULT_PAGE_SIZE` |

- Type / Interface 이름은 PascalCase 명사: `type Policy`, `interface BoardPost`
- Zustand store type은 PascalCase `[기능]Store`: `type AuthStore`, `type CompareStore`
- Enum은 PascalCase: `enum UserRole`, `enum PolicyCategory`
- barrel export는 각 slice의 `index.ts`에서 public API만 노출한다.

금지: `card.tsx`, `list.tsx`, `data.ts`, `temp.ts`, `util.ts`, `test2.ts`

## 15. 반응형 기준

필수 확인 해상도: `390px`, `768px`, `1440px`. 최소 390px 모바일 환경에서 깨지지 않아야 한다.

## 16. 테스트 / 검증 규칙

기본 검증 명령:

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run lint
corepack pnpm run build
```

작업 유형별 추가 확인:

- UI 변경: 주요 화면 수동 확인 또는 screenshot 첨부
- API 연동: 성공 / 빈 상태 / 오류 상태 확인
- 상태 로직 변경: hook 또는 순수 함수 단위 테스트 추가 우선 고려
- Docker/Compose 관련 변경: `docker compose config`, build, runtime smoke를 로컬 가능 범위로 검증. Docker가 없으면 PR 검증 결과에 명시한다.

## 17. PR 전 체크리스트

- [ ] GitHub Issue를 만들고 issue 번호 브랜치에서 작업했다.
- [ ] 레이어 의존 방향(`app → pages → widgets → features → entities → shared`)을 지켰고, feature → feature import를 만들지 않았다.
- [ ] 2개 이상 feature가 공유하는 도메인 모델은 `entities`로 승격했다.
- [ ] Container/Presenter 역할을 분리했다.
- [ ] 기능 로직을 custom hook으로 분리했다.
- [ ] 서버 데이터는 TanStack Query, 클라이언트 상태만 Zustand로 관리했다.
- [ ] API 호출을 컴포넌트 내부에서 직접 수행하지 않았다.
- [ ] API DTO와 UI model을 분리하고 mapper로 변환했다.
- [ ] API 오류는 body `code` 기준으로 사용자 메시지를 매핑하고, raw exception/message를 그대로 노출하지 않았다.
- [ ] 새 백엔드 에러코드가 있다면 프론트 code-message map 갱신 필요 여부를 확인했다.
- [ ] Loading / Empty / Error 상태를 구현했다. (챗봇·추천은 Degraded, 관리자는 Stale 고려)
- [ ] 디자인 시스템 토큰과 기존 UI 패턴을 따랐다.
- [ ] 모바일 390px에서 확인했다.
- [ ] 비로그인 사용자의 흐름을 확인했다.
- [ ] `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않았다.
- [ ] 접근성 기본 요소(semantic HTML, button type, aria-label, focus, 안전한 외부 링크)를 확인했다.
- [ ] `pnpm run lint`를 실행했다.
- [ ] `pnpm run build`를 실행했다.
