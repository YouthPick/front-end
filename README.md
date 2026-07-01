# front-end-proto

BOP YouthPick 프론트엔드 프로토타입입니다. Vite React 기반 정적 SPA입니다. 정책 검색/상세 API는 Spring Boot 백엔드(`back-end-proto`)를 호출하고, 챗봇 API는 FastAPI 챗봇 서비스(`chatbot`)를 직접 호출합니다.

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm

## 로컬 실행

### 1. 의존성 설치

```bash
corepack enable
pnpm install --frozen-lockfile
```

### 2. 환경 변수

`.env.example`을 참고해 Spring Boot 백엔드와 FastAPI 챗봇 API base URL을 설정합니다.

운영/통합 Docker 환경에서는 infra Nginx가 같은 도메인에서 `/api/**`, `/chat`, `/chat/stream`을 프록시하므로 기본값을 비워 둡니다.

```bash
VITE_API_BASE_URL=""
VITE_CHATBOT_API_BASE_URL=""
```

프론트만 단독으로 로컬 실행하면서 백엔드/챗봇에 직접 붙을 때만 아래처럼 override합니다.

```bash
VITE_API_BASE_URL="http://localhost:8080"
VITE_CHATBOT_API_BASE_URL="http://localhost:8000"
```

### 3. 개발 서버 실행

```bash
pnpm run dev
```

기본 포트는 `5173`입니다.

```bash
curl http://localhost:5173/
```

## Production 빌드/실행

```bash
pnpm run lint
pnpm run build
pnpm start
```

`pnpm start`는 Vite preview 서버를 `4000` 포트로 실행합니다.

확인:

```bash
curl http://localhost:4000/
```

## Docker Compose 실행

```bash
docker compose up -d --build
```

실행 서비스:

- `frontend`: YouthPick frontend Vite preview server

확인:

```bash
curl http://localhost:4000/
```

종료:

```bash
docker compose down -v
```

## CI

GitHub Actions에서 아래를 검증합니다.

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run build`
- `docker compose config`
- `docker compose build frontend`
- `docker compose up -d frontend`
- `curl http://localhost:4000/`

## PR 전 확인

- [ ] `pnpm run lint` 통과
- [ ] `pnpm run build` 통과
- [ ] preview server가 `/`에 HTTP 200 응답
- [ ] Docker Compose build/smoke 통과
