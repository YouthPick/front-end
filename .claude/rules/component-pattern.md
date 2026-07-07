---
description: Container/Presenter 분리, model의 custom hook 규칙. 화면 기능을 만들거나 크게 바꿀 때.
globs:
  - "src/**/ui/**"
  - "src/**/model/**"
---

# Container / Presenter · Custom Hook

화면 기능은 Container와 Presenter를 분리하고, 로직은 `model`의 custom hook에 둔다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. Container / Presenter

- Container는 상태, side effect, API 호출, event handler 조립을 담당한다.
- Presenter는 props를 받아 렌더링만 담당한다.
- Presenter 내부에서 API 호출, localStorage 접근, 복잡한 상태 전이를 직접 하지 않는다.
- 큰 컴포넌트 하나에 상태와 UI를 모두 넣지 않는다. 기존 큰 파일은 기능 변경 시 점진적으로 hook과 Presenter로 분리한다.

```text
features/tracker-management
├── model
│   └── use-tracker-management.ts
├── ui
│   ├── TrackerDashboardContainer.tsx
│   └── TrackerDashboardPresenter.tsx
└── index.ts
```

```tsx
export function TrackerDashboardContainer() {
  const trackerState = useTrackerManagement();
  return <TrackerDashboardPresenter {...trackerState} />;
}

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

## 2. Custom Hook 규칙

기능 로직은 custom hook으로 분리한다.

- hook 이름은 반드시 `use`로 시작하고 `model` 디렉터리에 둔다.
- hook은 화면 상태, derived state, event handler, API loading/error 상태를 캡슐화한다.
- effect는 cleanup이 필요한지 명확히 확인한다.
- hook return 값은 Presenter가 바로 사용할 수 있는 형태로 구성한다.
- 비동기 요청 hook은 `isLoading`, `errorMessage`, `isFallback`처럼 UI가 상태를 명확히 표현할 수 있는 값을 제공한다.

```tsx
// 금지: Presenter에서 직접 fetch/localStorage/window side effect
function PolicyCard() {
  useEffect(() => {
    fetch("/api/policies");
  }, []);
}

// 권장: Container가 hook을 쓰고 Presenter는 props만 받음
function PolicyListContainer() {
  const { policies, isLoading, errorMessage, reload } = usePolicies();
  return (
    <PolicyListPresenter
      policies={policies}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onReload={reload}
    />
  );
}
```

> 상태 관리 세부는 [`react.md`](./react.md), API 상태/에러는 [`api-design.md`](./api-design.md)를 본다.
