---
description: 디자인 시스템 토큰, 색/radius/shadow/spacing 규칙, 공통 UI 배치.
globs:
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "src/index.css"
---

# 디자인 시스템

디자인은 반드시 현재 디자인 시스템을 따른다. 임의 색상/radius/그림자/폰트를 남발하지 않는다. 진입점은 [`AGENTS.md`](../../AGENTS.md).

## 1. 토큰 위치

디자인 토큰은 [`src/index.css`](../../src/index.css)에 정의된다.

- Tailwind `@theme`: `--font-sans`, `--font-display`, `--color-primary`, `--color-primary-foreground`, `--color-primary-light`, `--color-brand-secondary`, `--color-secondary`, `--color-accent`, `--color-success`, `--color-border`.
- CSS variables: `--background`, `--surface`, `--foreground`, `--card`, `--muted`, `--destructive`, `--warning`, `--ring`, `--radius`.

## 2. 우선 사용 기준

- 브랜드 CTA: `bg-primary` + `text-primary-foreground`(대비 확보), `from-primary to-brand-secondary`. `text-primary`는 흰/밝은 배경 위 텍스트 색으로만 쓴다.
- 카드/패널: `rounded-2xl` 또는 `rounded-3xl`, `bg-white`, `border border-slate-100`, `shadow-sm`
- 보조 배경: `bg-slate-50`, `bg-primary/5`, `bg-primary-light`
- 상태 색상: success/warning/destructive 계열 토큰 또는 Tailwind semantic 색상을 일관되게 사용
- 폰트: `font-sans`, 필요한 display 영역만 `font-display`

## 3. 금지

- 기존 토큰과 무관한 hex 색상 직접 추가
- 같은 의미의 버튼/카드 스타일을 매번 새로 만드는 것
- contrast 확인 없이 흐린 텍스트/CTA 색상 추가
- 디자인 시스템과 다른 radius/shadow/spacing 임의 도입

## 4. 공통 UI 배치

새 공통 UI가 필요하면 `shared/ui`에 만들고, feature 내부에서만 쓰는 UI는 해당 slice의 `ui`에 둔다.
