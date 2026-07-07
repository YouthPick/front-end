---
description: React 코딩 컨벤션, 접근성, 상태 관리 규칙.
globs:
  - "src/**/*.tsx"
---

# React 컨벤션 / 상태 관리

React 코드는 공식 권장 패턴과 커뮤니티 표준을 따른다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. 컴포넌트 컨벤션

- 함수 컴포넌트를 사용한다.
- component 이름은 PascalCase, hook 이름은 camelCase + `use` prefix.
- props type은 component 근처에 `interface {ComponentName}Props`로 둔다.
- props는 가능한 명시적으로 선언하고 `React.FC`는 기본으로 쓰지 않는다.
- list key는 stable id를 사용한다. 동적 list에서 **index key는 금지**한다.
- event handler 이름은 `handleX`, props callback 이름은 `onX`.
- 조건부 렌더링은 early return 또는 명확한 분기로 작성한다.

## 2. Effect / 메모이제이션

- `useEffect`는 외부 시스템 동기화에만 사용한다. 단순 계산은 render 또는 `useMemo`로 처리한다.
- effect에는 cleanup이 필요한지 확인한다.
- `useMemo`, `useCallback`은 성능 문제가 있거나 memoized child에 전달할 때만 사용한다.

## 3. 접근성

- semantic HTML을 사용한다.
- 버튼은 `type="button"`을 명시한다.
- 아이콘/비텍스트 컨트롤에는 `aria-label`을 붙이고 focus 가능 상태를 고려한다.
- `target="_blank"` 링크에는 `rel="noopener noreferrer"`를 붙인다.

## 4. 상태 관리

- 컴포넌트 내부에서만 쓰는 UI 상태는 `useState`로 관리한다.
- feature use case 상태는 `model`의 custom hook으로 분리한다. ([`component-pattern.md`](./component-pattern.md))
- 여러 slice가 공유하는 domain data는 `entities/*/model`에서 관리한다.
- derived state는 가능하면 원본 state에서 계산한다. 중복 state로 저장하지 않는다.
- localStorage 접근은 `lib` 또는 hook 내부로 캡슐화한다.
