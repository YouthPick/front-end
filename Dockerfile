# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# 배포 도메인이 무엇이든(로컬/스테이징/프로덕션) 항상 "같은 origin"의 /api로 호출하게 상대경로로 고정한다.
# nginx.conf가 /api를 backend 컨테이너로 프록시하므로 별도 도메인 하드코딩이 필요 없다.
# (front-end/.env의 절대경로 값은 로컬 vite dev 전용 — 여기선 무시하고 빌드타임에 고정값으로 덮어쓴다.)
ENV VITE_API_BASE_URL=/api
RUN pnpm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
