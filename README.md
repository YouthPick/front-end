# BOP (YouthPick) Front-end

청년을 위한 정책 추천 서비스 **BOP**의 프론트엔드 SPA다. 정책 검색/추천, 신청 관리(트래커), 커뮤니티, 마이페이지, 관리자 화면을 제공한다.

[![CI](https://github.com/YouthPick/front-end/actions/workflows/ci.yml/badge.svg)](https://github.com/YouthPick/front-end/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Core | React 19, TypeScript, Vite 6, pnpm 11.9.0 |
| Routing | React Router |
| Server State | TanStack Query |
| Client State | Zustand |
| API Client | Axios, STOMP(WebSocket, 실시간 챗봇/알림용) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 에디터 | Tiptap (커뮤니티 글쓰기) |
| Code Quality | Biome (format/lint), `tsc --noEmit` (타입 검증) |
| Test | Vitest, Testing Library |

## 프로젝트 구조

Feature-Sliced Design(FSD) 아키텍처를 따른다. 레이어 의존 방향은 `app → pages → widgets → features → entities → shared`이며, 하위 레이어가 상위 레이어를 import하지 않는다.

```text
src
├── app        # 앱 초기화, 전역 provider, 라우팅, 전역 store
├── pages      # 라우트 단위 화면 조립 (home, search, recommend, tracker, community, my, admin* 등)
├── widgets    # 여러 feature/entity를 조합한 독립 UI 블록 (header, footer, policy-card-grid 등)
├── features   # 사용자 행위 단위 비즈니스 기능 (api / hooks / components)
├── entities   # feature 간 공유 도메인 모델 (policy, user, region 등)
└── shared     # 도메인 비의존 공통 UI/hook/util/api
```

상세 컨벤션(Container/Presenter, custom hook, 상태 관리, API 연동, 디자인 시스템 등)은 [`AGENTS.md`](./AGENTS.md)와 [`.claude/rules.md`](./.claude/rules.md)를 참고한다.

## 시작하기

### 사전 요구사항

- Node.js 22 (`.nvmrc` 기준)
- pnpm 11.9.0 (Corepack으로 활성화)

```bash
corepack prepare pnpm@11.9.0 --activate
```

### 1. 의존성 설치

```bash
corepack pnpm install --frozen-lockfile
```

### 2. 환경변수 설정

`.env`에 아래 값을 설정한다. (백엔드 API 주소)

```bash
VITE_API_BASE_URL=http://localhost:8080
```

개발 서버(`vite dev`)는 `/api` 요청을 `http://localhost:8080`으로 프록시하므로(WebSocket 포함), 백엔드가 기본 포트(8080)로 떠 있으면 이 값이 없어도 대부분 동작한다.

### 3. 개발 서버 실행

```bash
corepack pnpm run dev
```

기본 포트는 `5173`이다. (Vite 기본값)

### 4. 빌드 / 프리뷰

```bash
corepack pnpm run build     # vite build → dist/
corepack pnpm run start     # vite preview (production build 로컬 확인)
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `pnpm run dev` | 개발 서버 실행 |
| `pnpm run build` | 프로덕션 빌드 (`dist/`) |
| `pnpm run start` | 빌드 결과 프리뷰 (`vite preview`) |
| `pnpm run lint` | `biome check .` + `tsc --noEmit` |
| `pnpm run format` | Biome로 포맷 자동 적용 |
| `pnpm run check` | Biome check + 자동 수정 |
| `pnpm run typecheck` | `tsc --noEmit`만 실행 |
| `pnpm run test` | Vitest 실행 |
| `pnpm run clean` | `dist/` 삭제 |

## 완료 전 검증

```bash
corepack pnpm run lint
corepack pnpm run build
```

UI 변경은 주요 화면을 수동으로 확인하거나 스크린샷을 남긴다. 상세 체크리스트는 [`AGENTS.md`의 PR 체크리스트](./AGENTS.md)를 참고한다.

## 문서

| 문서 | 내용 |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | 모든 에이전트/개발자 공통 진입점 |
| [`.claude/rules.md`](./.claude/rules.md) | 상세 규칙 정본(18개 섹션) — FSD, 상태 관리, API 연동, 디자인 시스템, PR 체크리스트 등 |

## 작업 흐름

```text
GitHub Issue 생성 → 브랜치 생성 → 작업/커밋 → PR 생성 → 리뷰/검증 확인 → merge
```

- 기본 브랜치는 `dev`다. `main`은 현재 미사용.
- 브랜치: `feat|fix|docs|refac/{issue-number}-{short-name}`
- 커밋: `type: subject` (`feat`/`fix`/`docs`/`refac`/`test`/`chore`)
- `dev` 직접 커밋 금지, 이슈 없이 임의 브랜치 작업 금지.

## 관련 저장소

- Back-end: [YouthPick/back-end](https://github.com/YouthPick/back-end)
