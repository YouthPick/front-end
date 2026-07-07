---
description: TypeScript strict 컨벤션. any/as/@ts-ignore 금지, DTO↔model 분리, union 상태.
globs:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript 컨벤션

strict한 타입 설계를 지향한다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 규칙

- `any`는 금지한다. 알 수 없는 값은 `unknown`을 쓰고 type guard로 좁힌다.
- `@ts-ignore`는 금지한다. 정말 필요하면 `@ts-expect-error`와 이유 주석을 남긴다.
- 타입 단언 `as`는 런타임 검증이 있거나 라이브러리 경계에서 불가피할 때만 쓴다.
- API 응답 DTO와 UI model을 분리하고, 변환은 `lib/*-mapper.ts`에 둔다. ([`api-design.md`](./api-design.md))
- type-only import는 `import type`을 사용한다.
- union state는 string union 또는 discriminated union을 쓴다.
- nullable 값은 명시적으로 처리한다.
- public API에 노출되는 함수/컴포넌트 props는 타입을 명확히 선언한다.

## 예시

```ts
// 권장: discriminated union으로 비동기 상태 표현
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

// 금지
const data = response as Policy[];
function parse(value: any) {}
```
