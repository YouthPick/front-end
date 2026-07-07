export const meta = {
  name: 'pr-review',
  description:
    '현재 브랜치 변경사항을 관점별로 병렬 리뷰하고, 각 발견을 적대적으로 검증한 뒤 종합한다.',
  whenToUse:
    'PR 전 또는 변경 검토 시. main 대비 diff를 FSD/Container-Presenter/TS/디자인/접근성/보안 관점으로 나눠 리뷰한다.',
  phases: [
    { title: 'Review', detail: '관점별 병렬 리뷰' },
    { title: 'Verify', detail: '발견마다 적대적 검증' },
    { title: 'Synthesize', detail: '심각도순 종합 보고' },
  ],
};

// 리뷰 관점 (.claude/rules/* 기반)
const DIMENSIONS = [
  {
    key: 'fsd',
    prompt:
      'FSD 구조 관점에서만 리뷰하라. 의존 방향(app→pages→widgets→features→entities→shared) 위반, public API(index.ts) 우회한 깊은 import, 레이어 오배치를 찾아라.',
  },
  {
    key: 'container-presenter',
    prompt:
      'Container/Presenter 관점에서만 리뷰하라. Presenter가 API 호출/localStorage/복잡한 상태전이를 직접 하는지, 기능 로직이 model의 use* custom hook으로 분리됐는지 확인하라.',
  },
  {
    key: 'typescript',
    prompt:
      'TypeScript 관점에서만 리뷰하라. any / 불필요한 as / @ts-ignore, API DTO와 UI model 분리 및 lib 매퍼 여부, nullable·union 처리 안전성을 확인하라.',
  },
  {
    key: 'react',
    prompt:
      'React 관점에서만 리뷰하라. 함수형 컴포넌트/PascalCase/Props 인터페이스, list의 index key 사용, useEffect 오남용과 cleanup 누락, handleX/onX 컨벤션을 확인하라.',
  },
  {
    key: 'design-system',
    prompt:
      '디자인 시스템 관점에서만 리뷰하라. src/index.css 토큰 대신 임의 hex/radius/shadow/spacing을 도입했는지, 같은 의미의 버튼/카드 스타일을 중복 생성했는지 확인하라.',
  },
  {
    key: 'a11y-error',
    prompt:
      '접근성/상태처리/에러 관점에서만 리뷰하라. loading/error/empty/fallback 처리, semantic HTML/button type/aria/포커스, target=_blank의 rel, 에러의 code 기반 매핑(raw message 노출 금지)을 확인하라.',
  },
  {
    key: 'security',
    prompt:
      '보안 관점에서만 리뷰하라. 번들 내 시크릿 노출, dangerouslySetInnerHTML/innerHTML/eval, localStorage 민감정보, 평문 http, 정보 과다 로깅을 확인하라.',
  },
];

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['file', 'line', 'severity', 'summary', 'suggestion'],
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          severity: { type: 'string', enum: ['Blocking', 'High', 'Medium', 'Nit'] },
          summary: { type: 'string' },
          suggestion: { type: 'string' },
        },
      },
    },
  },
};

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['isReal', 'reason'],
  properties: {
    isReal: { type: 'boolean' },
    reason: { type: 'string' },
  },
};

const DIFF_CMD = 'git diff main...HEAD 2>/dev/null || git diff';

log('main 대비 변경사항을 관점별로 리뷰합니다.');

const reviewed = await pipeline(
  DIMENSIONS,
  (d) =>
    agent(
      `이 레포(React19+TS+Vite+Tailwind, FSD)의 변경사항을 리뷰한다. 기준은 AGENTS.md와 .claude/rules/ 문서다.\n` +
        `먼저 \`${DIFF_CMD}\`로 변경 파일과 diff를 확보하고, 필요하면 주변 파일도 읽어라.\n` +
        `아래 관점만 담당한다. 다른 관점은 무시한다.\n관점: ${d.prompt}\n` +
        `확신이 낮은 항목은 넣지 말고, 실제 문제만 findings로 반환하라. 없으면 빈 배열.`,
      { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA },
    ),
  (review, d) =>
    parallel(
      (review?.findings ?? []).map(
        (f) => () =>
          agent(
            `다음 리뷰 발견이 실제 문제인지 적대적으로 검증하라. 기본값은 "반증"이며, 근거가 확실할 때만 isReal=true.\n` +
              `파일: ${f.file}:${f.line}\n요약: ${f.summary}\n제안: ${f.suggestion}\n` +
              `해당 파일을 직접 읽고 .claude/rules/ 기준으로 판단하라.`,
            { label: `verify:${d.key}:${f.file}`, phase: 'Verify', schema: VERDICT_SCHEMA },
          ).then((v) => ({ ...f, dimension: d.key, verdict: v })),
      ),
    ),
);

const confirmed = reviewed
  .flat()
  .filter(Boolean)
  .filter((f) => f.verdict?.isReal);

const order = { Blocking: 0, High: 1, Medium: 2, Nit: 3 };
confirmed.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));

phase('Synthesize');
log(`검증 통과 ${confirmed.length}건. 종합합니다.`);

const report = await agent(
  `아래는 관점별 리뷰 후 적대적 검증을 통과한 발견 목록(JSON)이다. 이 레포 규칙(AGENTS.md · .claude/rules/) 기준으로 한국어 리뷰 리포트를 작성하라.\n` +
    `- 심각도(Blocking/High/Medium/Nit)순으로 정리\n- 각 항목: 파일:라인 · 문제 · 왜 · 권장 수정\n- 중복은 병합\n- 마지막에 잘된 점 1~2줄과 머지 가능 여부 의견\n\n` +
    JSON.stringify(confirmed, null, 2),
  { phase: 'Synthesize' },
);

return report
