---
description: 파일/이름 규칙, barrel export 컨벤션.
globs:
  - "src/**"
---

# 파일 / 이름 규칙

진입점은 [`AGENTS.md`](../../AGENTS.md).

- React component 파일은 PascalCase: `PolicyCard.tsx`
- hook 파일은 kebab-case를 우선 사용한다: `use-tracker-management.ts`
- type 파일은 `types.ts`
- mock data 파일은 `mock-*.ts`
- mapper 파일은 `*-mapper.ts`
- barrel export는 각 slice의 `index.ts`에서 public API만 노출한다. ([`architecture.md`](./architecture.md))
