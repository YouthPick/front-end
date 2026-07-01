# BOP Front-end Agent Rules

이 문서는 `front-end-proto`에서 작업하는 모든 에이전트와 개발자가 따라야 하는 프론트엔드 구현 규칙이다. 새 기능을 만들거나 기존 코드를 수정하기 전에 반드시 이 파일을 먼저 읽고, 이 규칙과 충돌하는 구현은 하지 않는다.

## 1. 작업 흐름

- 모든 작업은 GitHub Issue를 먼저 만들고, issue 번호가 포함된 브랜치에서 진행한다.
- 브랜치 형식은 `feat/{issue-number}-{short-name}`, `fix/{issue-number}-{short-name}`, `docs/{issue-number}-{short-name}`, `refac/{issue-number}-{short-name}`를 따른다.
- 구현 후에는 `pnpm run lint`, `pnpm run build`를 직접 실행하고 PR에 실제 결과를 적는다.
- 단순 설명이나 스텁으로 끝내지 않는다. 동작하는 코드와 검증 결과를 남긴다.
- 백엔드 API/기획/API 명세와 연결되는 변경은 docs 레포의 기획/API 문서를 먼저 확인하고 필요하면 문서도 갱신한다.

## 2. 기술 기준

- React 19를 사용한다.
- TypeScript를 사용한다.
- Vite를 사용한다.
- Tailwind CSS 4를 사용한다.
- package manager는 pnpm을 사용한다.
- 프론트는 Vite 정적 SPA로 빌드하고, production smoke는 Vite preview 서버(`pnpm start`)로 확인한다. 별도 Node 서버를 추가하지 않는다.

기본 검증 명령은 다음과 같다.

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run lint
corepack pnpm run build
```

Docker/Compose 관련 변경은 로컬에서 가능한 범위로 `docker compose config`, build, runtime smoke를 검증한다. 실행 환경에 Docker가 없으면 PR 검증 결과에 명시한다.

## 3. FSD 폴더 구조

패키지 구조는 Feature-Sliced Design(FSD)을 따른다. 새 코드는 `app`, `pages`, `widgets`, `features`, `entities`, `shared` 레이어 중 책임에 맞는 위치에 둔다.

현재 기준 구조는 다음과 같다.

```text
src
├── app
├── pages
├── widgets
├── features
├── entities
└── shared
```

각 레이어 책임은 다음과 같다.

- `app`: 앱 초기화, 전역 provider, 라우팅, 전역 스타일 연결 등 앱 조립 책임
- `pages`: 라우트/page 단위 화면 조립 책임
- `widgets`: 여러 feature/entity를 조합한 독립 UI 블록
- `features`: 사용자가 수행하는 행위, use case 단위 기능
- `entities`: 비즈니스 엔티티의 타입, API, model, UI
- `shared`: 도메인에 의존하지 않는 공통 UI, lib, api, config, types

레이어 의존 방향은 아래를 따른다.

```text
app → pages → widgets → features → entities → shared
```

하위 레이어가 상위 레이어를 import하지 않는다. 예를 들어 `entities`는 `features`, `widgets`, `pages`, `app`을 import하지 않는다.

## 4. Slice 내부 구조

각 slice는 필요한 디렉터리만 만든다.

```text
features/policy-filter
├── api
├── model
├── lib
├── ui
└── index.ts
```

역할은 다음과 같다.

- `api`: HTTP 요청 함수, API DTO, endpoint 호출
- `model`: 상태, custom hook, slice type, mock data
- `lib`: 순수 함수, mapper, formatter, 계산 로직
- `ui`: Presenter component, 시각적 컴포넌트
- `index.ts`: public API export

외부 slice에서 내부 파일을 깊게 import하지 않는다. 가능한 `@features/policy-filter`처럼 public API를 통해 import한다.

금지 예시:

```ts
import { FilterBar } from "@features/policy-filter/ui/FilterBar";
```

권장 예시:

```ts
import { FilterBar } from "@features/policy-filter";
```

## 5. Container / Presenter 패턴

화면 기능은 Container와 Presenter를 분리한다.

- Container는 상태, side effect, API 호출, event handler 조립을 담당한다.
- Presenter는 props를 받아 렌더링만 담당한다.
- Presenter 내부에서 API 호출, localStorage 접근, 복잡한 상태 전이를 직접 하지 않는다.
- 큰 컴포넌트 하나에 상태와 UI를 모두 넣지 않는다. 기존 큰 파일은 기능 변경 시 점진적으로 hook과 Presenter로 분리한다.

권장 구조:

```text
features/tracker-management
├── model
│   └── use-tracker-management.ts
├── ui
│   ├── TrackerDashboardContainer.tsx
│   └── TrackerDashboardPresenter.tsx
└── index.ts
```

Container 예시:

```tsx
export function TrackerDashboardContainer() {
  const trackerState = useTrackerManagement();

  return <TrackerDashboardPresenter {...trackerState} />;
}
```

Presenter 예시:

```tsx
interface TrackerDashboardPresenterProps {
  isLoading: boolean;
  onAddItem: () => void;
}

export function TrackerDashboardPresenter({ isLoading, onAddItem }: TrackerDashboardPresenterProps) {
  return (
    <section aria-label="신청 관리">
      <button type="button" onClick={onAddItem} disabled={isLoading}>
        항목 추가
      </button>
    </section>
  );
}
```

## 6. Custom Hook 규칙

기능 로직은 custom hook으로 분리한다.

- hook 이름은 반드시 `use`로 시작한다.
- hook은 `model` 디렉터리에 둔다.
- hook은 화면 상태, derived state, event handler, API loading/error 상태를 캡슐화한다.
- hook 내부에서 사용하는 effect는 cleanup을 명확히 작성한다.
- hook return 값은 Presenter가 바로 사용할 수 있는 형태로 구성한다.
- 비동기 요청 hook은 `isLoading`, `errorMessage`, `isFallback`처럼 UI가 상태를 명확히 표현할 수 있는 값을 제공한다.

금지:

```tsx
// Presenter에서 직접 fetch/localStorage/window side effect 수행 금지
function PolicyCard() {
  useEffect(() => {
    fetch("/api/policies");
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

## 7. 디자인 시스템 규칙

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

새 공통 UI가 필요하면 `shared/ui`에 만들고, feature 내부에서만 쓰는 UI는 해당 slice의 `ui`에 둔다.

## 8. React 코딩 컨벤션

React 코드는 공식 React 권장 패턴과 커뮤니티 표준을 따른다.

- 함수 컴포넌트를 사용한다.
- component 이름은 PascalCase를 사용한다.
- hook 이름은 camelCase + `use` prefix를 사용한다.
- props type은 component 근처에 `interface {ComponentName}Props`로 둔다.
- props는 가능한 명시적으로 선언하고, `React.FC`는 기본으로 사용하지 않는다.
- list key는 stable id를 사용한다. 동적 list에서 index key는 금지한다.
- event handler 이름은 `handleX`, props callback 이름은 `onX`를 사용한다.
- 조건부 렌더링은 early return 또는 명확한 분기로 작성한다.
- `useEffect`는 외부 시스템 동기화에만 사용한다. 단순 계산은 render 또는 `useMemo`로 처리한다.
- effect에는 cleanup이 필요한지 확인한다.
- `useMemo`, `useCallback`은 성능 문제가 있거나 memoized child에 전달할 때만 사용한다.
- 접근성을 위해 semantic HTML, `button type="button"`, `aria-label`, focus 가능 상태를 고려한다.
- `target="_blank"` 링크에는 `rel="noopener noreferrer"`를 붙인다.

## 9. TypeScript 코딩 컨벤션

TypeScript는 strict한 타입 설계를 지향한다.

- `any`는 금지한다. 알 수 없는 값은 `unknown`을 사용하고 type guard로 좁힌다.
- `@ts-ignore`는 금지한다. 정말 필요한 경우 `@ts-expect-error`와 이유를 주석으로 남긴다.
- API 응답 DTO와 UI model을 분리한다.
- API DTO → UI model 변환은 `lib/*-mapper.ts`에 둔다.
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

금지:

```ts
const data = response as Policy[];
function parse(value: any) {}
```

## 10. API 연동 규칙

- API 호출 함수는 slice의 `api` 디렉터리에 둔다.
- API 응답 DTO는 UI model과 분리한다.
- mapper는 `lib`에 둔다.
- API 실패, timeout, 서버 장애, 빈 응답 상태를 UI가 표현할 수 있게 hook에서 상태를 제공한다.
- mock fallback이 필요한 기능은 fallback 여부를 `isFallback` 등으로 노출한다.
- API key 같은 secret은 클라이언트 번들에 직접 노출하지 않는다.
- 브라우저 저장소에는 민감정보를 저장하지 않는다.

### 10.1 API 에러코드 처리 규칙

백엔드 검증 오류와 비즈니스 오류는 HTTP status만 보지 않고, 응답 body의 `code`를 기준으로 처리한다. 백엔드는 검증 오류를 `C001` 같은 `ErrorCode`로 내려주며, 프론트는 이 코드를 사용자 메시지로 매핑한다.

표준 에러 응답 예시는 다음과 같다.

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

프론트 처리 규칙:

- API client는 실패 응답에서 `code`, `message`, `details`를 파싱해 hook 또는 caller가 사용할 수 있게 보존한다.
- UI에 표시할 문구는 서버 raw message를 그대로 뿌리지 말고, `code` → 사용자 친화 메시지 매핑을 우선 사용한다.
- 검증 오류 `C001`은 가능한 경우 `details[].reason`을 함께 보여주되, 여러 field 오류는 대표 메시지 + 세부 항목 형태로 정리한다.
- 알 수 없는 `code`는 공통 fallback 메시지(예: `요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.`)로 처리한다.
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

## 11. 상태 관리 규칙

- 컴포넌트 내부에서만 쓰는 UI 상태는 `useState`로 관리한다.
- feature use case 상태는 custom hook으로 분리한다.
- 여러 slice가 공유하는 domain data는 `entities/*/model`에서 관리한다.
- derived state는 가능하면 원본 state에서 계산한다. 중복 state로 저장하지 않는다.
- localStorage 접근은 `lib` 또는 hook 내부로 캡슐화한다.

## 12. 파일/이름 규칙

- React component 파일은 PascalCase: `PolicyCard.tsx`
- hook 파일은 kebab-case 또는 camelCase 중 기존 slice 관례를 따른다. 현재는 `use-tracker-management.ts`처럼 kebab-case를 우선 사용한다.
- type 파일은 `types.ts`
- mock data 파일은 `mock-*.ts`
- mapper 파일은 `*-mapper.ts`
- barrel export는 각 slice의 `index.ts`에서 public API만 노출한다.

## 13. 테스트/검증 규칙

현재 기본 검증은 다음이다.

```bash
pnpm run lint
pnpm run build
```

작업 유형별로 추가 확인한다.

- UI 변경: 주요 화면 수동 확인 또는 screenshot 첨부
- API 연동: 성공/빈 상태/오류 상태 확인
- 상태 로직 변경: hook 또는 순수 함수 단위 테스트 추가를 우선 고려
- Docker 변경: `docker compose config`와 가능한 build/smoke 확인

## 14. PR 전 체크리스트

- [ ] GitHub Issue를 만들고 issue 번호 브랜치에서 작업했다.
- [ ] FSD 레이어 의존 방향을 지켰다.
- [ ] Container/Presenter 역할을 분리했다.
- [ ] 기능 로직을 custom hook으로 분리했다.
- [ ] 디자인 시스템 토큰과 기존 UI 패턴을 따랐다.
- [ ] `any`, 불필요한 `as`, `@ts-ignore`를 추가하지 않았다.
- [ ] API DTO와 UI model을 분리했다.
- [ ] API 오류는 백엔드 `code` 기준으로 사용자 메시지를 매핑하고, raw exception/message를 그대로 노출하지 않는다.
- [ ] 새 백엔드 에러코드가 있다면 프론트 code-message map 갱신 필요 여부를 확인했다.
- [ ] loading/error/empty 상태를 처리했다.
- [ ] 접근성 기본 요소를 확인했다.
- [ ] `pnpm run lint`를 실행했다.
- [ ] `pnpm run build`를 실행했다.
