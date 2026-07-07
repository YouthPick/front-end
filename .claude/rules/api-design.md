---
description: API 호출 함수, DTO, 매퍼, 에러코드 처리 등 프론트 API 레이어를 다룰 때 참고한다.
globs:
  - "src/**/api/**"
  - "src/**/*-mapper.ts"
  - "src/**/model/**"
---

# API 레이어 규칙 (Front-end)

프론트에서 백엔드 API와 연동하는 코드를 만들거나 수정할 때 따른다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. 레이어 배치

- API 호출 함수는 slice의 `api` 디렉터리에 둔다.
- API 응답 **DTO**는 UI **model**과 분리한다.
- DTO → model 변환은 `lib/*-mapper.ts`에 순수 함수로 둔다.
- 비동기 상태(`isLoading`, `errorMessage`, `isFallback` 등)는 `model`의 custom hook이 노출한다. Presenter는 그 상태를 props로 받아 렌더만 한다.

```text
features/policy-filter
├── api
│   └── policy-api.ts        # fetch, 요청/응답 DTO
├── lib
│   └── policy-mapper.ts     # DTO -> UI model (순수 함수)
├── model
│   └── use-policies.ts      # 상태/로딩/에러/fallback
└── ui
    └── PolicyListPresenter.tsx
```

## 2. DTO / model 분리

- DTO는 서버 응답 형태를 그대로 반영한다. snake_case 등 서버 컨벤션이 있으면 DTO에서만 허용하고, model은 프론트 컨벤션(camelCase)으로 정규화한다.
- model은 UI가 바로 쓰기 좋은 형태여야 한다(파생값 계산, null 정규화, enum narrowing 포함).
- `as`로 응답을 DTO 타입으로 단언하지 말고, 런타임 경계에서 최소한의 방어(필수 필드 확인)를 한 뒤 매퍼로 변환한다.

## 3. 에러코드 처리 (핵심)

HTTP status만 보지 않고 응답 body의 `code`를 기준으로 처리한다.

```ts
interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Array<{ field?: string; value?: unknown; reason?: string }>;
}
```

- API client는 실패 응답에서 `code`, `message`, `details`를 파싱해 보존한다.
- UI 문구는 서버 raw `message`를 그대로 뿌리지 말고 `code` → 사용자 친화 메시지 매핑을 우선 사용한다.
- 검증 오류 `C001`은 가능하면 `details[].reason`을 함께 보여주되, 여러 필드 오류는 대표 메시지 + 세부 항목으로 정리한다.
- 알 수 없는 `code`는 공통 fallback 메시지로 처리한다.
- HTTP status, exception text, stack trace, SQL, 내부 endpoint, secret 값을 사용자에게 노출하지 않는다.
- 새 백엔드 `ErrorCode`가 추가되면 프론트 code-message map 갱신 여부를 확인한다.

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

## 4. 상태 처리

- 성공 / 로딩 / 빈 응답 / 오류 / (필요 시) fallback을 모두 UI가 표현할 수 있게 hook에서 상태를 제공한다.
- mock fallback이 필요한 기능은 fallback 여부를 `isFallback`으로 노출한다.
- 비동기 상태는 discriminated union으로 표현하면 안전하다.

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

## 5. 보안

- API key 등 secret을 클라이언트 번들에 직접 노출하지 않는다. `import.meta.env`로 주입되는 값 중 브라우저에 노출돼도 되는 것만 사용한다.
- 브라우저 저장소(localStorage/sessionStorage)에 토큰·개인정보 등 민감정보를 저장하지 않는다.
- 외부에서 받은 데이터를 `dangerouslySetInnerHTML`로 직접 렌더하지 않는다.

## 6. 금지

```ts
// 서버 내부 message/exception을 그대로 노출 금지
showToast(error.message);

// status만 보고 모든 400을 같은 메시지로 처리 금지
if (response.status === 400) showToast("잘못된 요청입니다.");

// 응답을 검증 없이 단언 금지
const data = response as Policy[];
```
