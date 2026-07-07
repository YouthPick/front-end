---
description: FSD 레이어 구조, slice 내부 구조, 레이어 의존 방향, public API import.
globs:
  - "src/**"
---

# 아키텍처 (FSD)

패키지 구조는 Feature-Sliced Design(FSD)을 따른다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. 레이어 구조

새 코드는 `app`, `pages`, `widgets`, `features`, `entities`, `shared` 중 책임에 맞는 위치에 둔다.

```text
src
├── app       # 앱 초기화, 전역 provider, 라우팅, 전역 스타일 연결
├── pages     # 라우트/page 단위 화면 조립
├── widgets   # 여러 feature/entity를 조합한 독립 UI 블록
├── features  # 사용자가 수행하는 행위, use case 단위 기능
├── entities  # 비즈니스 엔티티의 타입, API, model, UI
└── shared    # 도메인 비의존 공통 UI, lib, api, config, types
```

## 2. 의존 방향 (불변)

```text
app → pages → widgets → features → entities → shared
```

하위 레이어가 상위 레이어를 import하지 않는다. 예: `entities`는 `features`, `widgets`, `pages`, `app`을 import하지 않는다.

## 3. Slice 내부 구조

각 slice는 필요한 디렉터리만 만든다.

```text
features/policy-filter
├── api      # HTTP 요청 함수, API DTO, endpoint 호출
├── model    # 상태, custom hook, slice type, mock data
├── lib      # 순수 함수, mapper, formatter, 계산 로직
├── ui       # Presenter component, 시각적 컴포넌트
└── index.ts # public API export
```

## 4. Public API import

외부 slice에서 내부 파일을 깊게 import하지 않는다. 가능한 `index.ts`(public API)를 통해 import한다.

```ts
// 금지
import { FilterBar } from "@features/policy-filter/ui/FilterBar";

// 권장
import { FilterBar } from "@features/policy-filter";
```

> 화면 기능의 Container/Presenter 분리와 custom hook 규칙은 [`component-pattern.md`](./component-pattern.md)를 본다.
