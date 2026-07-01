# CLAUDE.md

Claude Code 또는 유사한 코딩 에이전트는 이 레포에서 작업할 때 반드시 [`rules.md`](./rules.md)를 먼저 읽고 그대로 따른다. `rules.md`가 이 문서보다 상세하며, 충돌 시 `rules.md`를 우선한다.

## Non-negotiable rules

- Follow `rules.md` before making code changes.
- Use the issue-first workflow: create GitHub Issue → create issue-numbered branch → commit → open PR → verify → merge.
- The current baseline stack is React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Router, pnpm, and Biome.
- The target direction for new architecture work is TanStack Query for server state, Zustand for client state, one shared API client, React Hook Form + Zod, Sonner, and shadcn/ui where appropriate.
- Do not rewrite the whole app just to introduce a guideline dependency. Split TanStack Query, Zustand, API client, shadcn/ui, form, and notification migrations into separate issues.
- The target folder structure is centered on `app`, `pages`, `features`, `widgets`, `shared`, and `assets`.
- Do not expand the `entities` layer for new work. Migrate existing `entities` code gradually into `features/*` or `shared/*` when a scoped refactor issue requires it.
- Keep `shared` truly shared. Domain models such as policy, user profile, tracker, board, comment, and admin data belong in their feature area.
- API calls must live in `shared/api` or `features/*/api`; components must not call `fetch` or `axios` directly.
- Prefer TanStack Query for server data. Use Zustand only for client state such as auth, preferences, comparison list, and UI state.
- Do not copy policy lists, policy details, board lists, comments, search results, or admin server data into Zustand by default.
- Every list/detail screen must handle Loading, Empty, and Error states. Chatbot, recommendation, and admin surfaces must consider Degraded or Stale states when relevant.
- Follow the design system in `src/index.css` and existing UI patterns.
- Do not introduce arbitrary colors, spacing, radius, shadows, or fonts when tokens/patterns already exist.
- Use strict React and TypeScript conventions. Do not add `any`, unnecessary `as`, or `@ts-ignore`.
- Separate API DTOs from UI models and use mapper functions.
- Check basic accessibility: semantic HTML, button type, aria labels, focus behavior, and safe external links.
- Run verification before claiming completion.

## Git workflow convention

Branch naming:

```text
feat/{issue-number}-{short-name}
fix/{issue-number}-{short-name}
docs/{issue-number}-{short-name}
refac/{issue-number}-{short-name}
```

Commit format:

```text
type: subject
```

Allowed types: `feat`, `fix`, `docs`, `refac`, `test`, `chore`.

PR body must include change summary, test results, screenshots/logs when relevant, and linked issue using `Closes #issue-number`.

## Required verification

```bash
corepack prepare pnpm@11.9.0 --activate
corepack pnpm install --frozen-lockfile
corepack pnpm run format:check
corepack pnpm run lint
corepack pnpm run build
```

If a task changes Dockerfile, Compose, or runtime wiring, verify `docker compose config` and local build/smoke when Docker is available. If Docker is unavailable in the execution environment, state that explicitly in the PR verification result.
