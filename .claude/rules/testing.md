---
description: 테스트/검증 파일을 다루거나 상태 로직·순수 함수·hook을 검증할 때 참고한다.
globs:
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
  - "src/**/*.spec.ts"
  - "src/**/*.spec.tsx"
---

# 테스트 / 검증 규칙 (Front-end)

프론트 코드를 검증하거나 테스트를 추가할 때 이 문서를 따른다. 진입점은 [`AGENTS.md`](../../AGENTS.md), 실행 검증 명령은 [`workflow.md`](./workflow.md)를 함께 본다.

## 1. 기본 검증 (항상)

테스트 프레임워크와 무관하게, 코드 변경 후에는 아래를 직접 실행하고 결과를 남긴다.

```bash
corepack pnpm run lint   # biome check . && tsc --noEmit
corepack pnpm run build  # vite build
```

- `lint`는 Biome(포맷·import·lint) 검사 + `tsc --noEmit`(타입 검증)이다. 둘 다 통과해야 한다.
- 자동 정리가 필요하면 `corepack pnpm run format`을 먼저 실행한다.
- `build`가 성공해야 한다.
- 결과(성공/실패, 주요 로그)를 PR 검증란에 실제로 적는다. 추측으로 적지 않는다.

## 2. 무엇을 어떻게 테스트하나

우선순위는 "검증 비용 대비 회귀 위험"이다.

- **순수 함수 / mapper / formatter (`lib`)**: 단위 테스트 1순위. 입력 → 출력이 명확하므로 케이스를 촘촘히 덮는다. 특히 API DTO → UI model 매퍼는 필드 누락·null·빈 배열·잘못된 타입 케이스를 검증한다.
- **custom hook (`model`)**: 상태 전이, `isLoading`/`errorMessage`/`isFallback` 흐름을 검증한다. 성공 / 빈 응답 / 오류 / fallback 4가지 경로를 확인한다.
- **Presenter (`ui`)**: props → 렌더 결과. loading/error/empty/정상 상태별 렌더와 접근성 속성(role, aria-label, button type)을 확인한다.
- **Container**: 로직은 hook에 있으므로 Container 자체는 얇게 두고, 필요하면 hook 테스트로 대체한다.

## 3. 테스트 프레임워크 (아직 미도입)

현재 이 레포에는 테스트 러너가 설치돼 있지 않다. 테스트를 추가해야 하면 **Vitest + React Testing Library**를 우선 검토하되, 도입은 이슈로 분리하고 임의로 의존성을 늘리지 않는다.

도입 시 권장 컨벤션:

- 파일명: 대상과 같은 위치에 `*.test.ts` / `*.test.tsx`.
- 테스트 대상 slice의 public API(`index.ts`)를 통해 import한다. 내부 파일을 깊게 import하지 않는다.
- 네트워크는 실제로 호출하지 않는다. `api` 함수를 mock하거나 fetch를 stub한다.
- 접근성 쿼리(`getByRole`, `getByLabelText`)를 우선 사용하고 테스트용 selector 남발을 피한다.
- 브라우저 저장소(localStorage)를 쓰는 로직은 테스트에서 setup/teardown으로 초기화한다.

## 4. 작업 유형별 추가 확인

- **UI 변경**: 주요 화면을 수동 확인하거나 스크린샷을 첨부한다. loading/error/empty 상태도 눈으로 확인한다.
- **API 연동**: 성공 / 빈 상태 / 오류 상태 / fallback을 각각 확인한다. 오류는 백엔드 `code` 기준으로 사용자 메시지가 매핑되는지 본다.
- **상태 로직 변경**: hook 또는 순수 함수 단위 테스트 추가를 우선 고려한다.
- **접근성 영향 변경**: 키보드 포커스 이동과 스크린리더 라벨을 확인한다.

## 5. 금지

- 검증을 실행하지 않고 "통과했다"라고 적지 않는다.
- 실패한 검증을 숨기지 않는다. 실패는 그대로 보고한다.
- 테스트를 통과시키기 위해 프로덕션 코드의 타입을 `any`로 느슨하게 만들지 않는다.
