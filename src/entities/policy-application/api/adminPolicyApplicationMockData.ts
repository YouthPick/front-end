import type {
  AdminPolicyApplicationDto,
  ApplicationChecklistItemDto,
} from './adminPolicyApplication.dto';

const POLICIES = [
  { policyId: 'p1', policyName: '청년 디지털 일자리 지원 사업' },
  { policyId: 'p2', policyName: '청년 월세 한시 특별지원' },
  { policyId: 'p3', policyName: 'K-디지털 트레이닝 (국비지원)' },
  { policyId: 'p4', policyName: '청년내일채움공제' },
  { policyId: 'p6', policyName: '국민내일배움카드' },
  { policyId: 'p7', policyName: '서울시 청년수당' },
];

const STATUS_CYCLE: AdminPolicyApplicationDto['status'][] = [
  'INTERESTED',
  'PREPARING',
  'SUBMITTED',
  'CLOSED',
];

const MOCK_APPLICATION_COUNT = 24;
const DAY_MS = 24 * 60 * 60 * 1000;

function buildMockApplications(): AdminPolicyApplicationDto[] {
  return Array.from({ length: MOCK_APPLICATION_COUNT }, (_, index) => {
    const policy = POLICIES[index % POLICIES.length];
    const deadline = new Date(Date.now() + (index - 10) * (DAY_MS * 3));

    return {
      id: `application-${index + 1}`,
      userId: `user-${(index % 12) + 1}`,
      policyId: policy.policyId,
      policyName: policy.policyName,
      status: STATUS_CYCLE[index % STATUS_CYCLE.length],
      memo: index % 3 === 0 ? '서류 준비 진행 중, 마감 전 재확인 필요' : '',
      deadline: deadline.toISOString().slice(0, 10),
      createdAt: new Date(Date.now() - index * (DAY_MS * 2)).toISOString(),
    };
  });
}

// 상태별로 체크리스트 진행 정도를 다르게 흉내낸다: 관심(0개) < 준비중(일부) < 신청완료/종료(전체).
const CHECKED_COUNT_BY_STATUS: Record<AdminPolicyApplicationDto['status'], number> = {
  INTERESTED: 0,
  PREPARING: 2,
  SUBMITTED: 4,
  CLOSED: 4,
};

function buildMockChecklists(
  applications: AdminPolicyApplicationDto[],
): Record<string, ApplicationChecklistItemDto[]> {
  const checklistByApplicationId: Record<string, ApplicationChecklistItemDto[]> = {};

  for (const application of applications) {
    const itemTexts = [
      '기본 제출 서류 취합',
      '자격요건 확인',
      '지원서 작성 및 제출',
      '결과 발표 확인',
    ];
    const checkedCount = CHECKED_COUNT_BY_STATUS[application.status];

    checklistByApplicationId[application.id] = itemTexts.map((description, itemIndex) => ({
      id: `${application.id}-checklist-${itemIndex + 1}`,
      policyApplicationId: application.id,
      description,
      checked: itemIndex < checkedCount,
      createdAt: application.createdAt,
    }));
  }

  return checklistByApplicationId;
}

export const MOCK_ADMIN_POLICY_APPLICATION_DTOS: AdminPolicyApplicationDto[] =
  buildMockApplications();
export const MOCK_APPLICATION_CHECKLIST_BY_APPLICATION_ID: Record<
  string,
  ApplicationChecklistItemDto[]
> = buildMockChecklists(MOCK_ADMIN_POLICY_APPLICATION_DTOS);
