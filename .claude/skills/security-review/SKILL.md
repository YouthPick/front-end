---
name: security-review
description: 프론트엔드(React/TS) 변경사항의 보안 점검. XSS, 번들 내 시크릿 노출, dangerouslySetInnerHTML, 브라우저 저장소 민감정보, 외부 링크, 의존성 위험을 점검할 때 사용한다.
---

# Front-end Security Review

이 스킬은 이 레포(React 19 + TypeScript + Vite)에서 프론트 변경사항의 보안 위험을 점검한다. 상세 항목은 [`checklist.md`](./checklist.md)를 사용한다.

## 사용 시점

- PR 전 변경 파일에 대한 보안 점검을 요청받았을 때
- 폼 입력, 외부 데이터 렌더, 인증/토큰 처리, 링크, 파일 업로드 등을 건드렸을 때
- 새 의존성을 추가했을 때

## 절차

1. **범위 파악**: `git diff origin/dev...HEAD --name-only`로 변경 파일을 추린다. 없으면 스테이징/워킹 변경을 본다.
2. **정적 점검**: 아래 패턴을 변경 파일 중심으로 검색한다.
   - `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, `new Function(`
   - `import.meta.env`, `process.env`, 하드코딩된 키/토큰(`sk-`, `AIza`, `Bearer `, `api_key` 등)
   - `localStorage`, `sessionStorage`, `document.cookie`
   - `target="_blank"` 후 `rel` 누락
   - `http://` 평문 엔드포인트, CORS/credentials 설정
3. **체크리스트 대조**: [`checklist.md`](./checklist.md)의 각 항목을 변경사항에 대입한다.
4. **보고**: 발견마다 `파일:라인 · 위험 · 근거 · 권장 수정`을 심각도(Critical/High/Medium/Low) 순으로 정리한다. 확실치 않은 것은 추정임을 명시한다.

## 원칙

- 이 레포는 클라이언트 정적 SPA다. 브라우저 번들에 담기는 값은 모두 공개된다고 가정한다.
- 서버 raw 에러/스택/내부 endpoint를 사용자에게 노출하는 코드는 보안+UX 이슈로 함께 지적한다.
- 수정 자체보다 "왜 위험한지"와 "구체적 대안"을 명확히 전달한다. 코드를 임의로 대규모 리팩터링하지 않는다.
- 오탐을 줄인다: 실제 익스플로잇 경로가 그려지지 않으면 확신 수준을 낮춰 보고한다.
