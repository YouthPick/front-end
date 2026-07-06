# CLAUDE.md

Claude Code 또는 유사한 코딩 에이전트는 이 레포에서 작업할 때 반드시 [`rules.md`](./rules.md)를 먼저 읽고 그대로 따른다.

## Non-negotiable rules

- Follow `rules.md` before making code changes.
- Use the issue-first workflow: create GitHub Issue → create issue-numbered branch → commit → open PR → verify → merge.
- Keep the FSD structure: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- Do not break the dependency direction: `app → pages → widgets → features → entities → shared`, and never import feature → feature.
- Promote a domain model to `entities/{domain}` once two or more features share it; keep it feature-local otherwise.
- Use the Container/Presenter pattern for new or significantly changed features.
- Separate feature logic into custom hooks under `hooks`.
- Use TanStack Query for server state and Zustand only for client/UI/auth state.
- Presenters must render from props; they must not own API calls, storage side effects, or complex state transitions.
- Always follow the design system in `src/index.css` and existing UI patterns.
- Do not introduce arbitrary colors, spacing, radius, shadows, or fonts when tokens/patterns already exist.
- Use strict React and TypeScript conventions. Do not add `any`, unnecessary `as`, or `@ts-ignore`.
- Separate API DTOs from UI models and use mapper functions.
- Handle loading, error, empty, and fallback states.
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
corepack pnpm run lint
corepack pnpm run build
```

If a task changes Dockerfile, Compose, or runtime wiring, verify `docker compose config` and local build/smoke when Docker is available. If Docker is unavailable in the execution environment, state that explicitly in the PR verification result.