import type { AdminUserDto, AdminUserProfileDto } from './adminUser.dto';

const PROVIDERS = ['카카오', '네이버', 'Google'];
const EMPLOYMENT_STATUSES = ['재직중', '구직중', '재학중', '프리랜서'];
const EDUCATION_LEVELS = ['고졸', '대학 재학', '대학 졸업', '대학원 졸업'];
const CATEGORY_POOL = ['일자리', '주거', '교육', '복지문화', '참여권리'];
const KEYWORD_POOL = ['월세지원', '취업', '창업', '자기계발', '전세대출'];
const REGION_LABELS = [
  '서울특별시 강남구',
  '경기도 수원시',
  '부산광역시 해운대구',
  '대전광역시 유성구',
];
const MARRIAGE_STATUSES = ['미혼', '기혼'];
const MAJORS = ['컴퓨터공학', '경영학', '해당없음'];
const MOCK_USER_COUNT = 28;
const DAY_MS = 24 * 60 * 60 * 1000;

function pick<T>(pool: readonly T[], index: number): T {
  return pool[index % pool.length];
}

function buildMockAdminUsers(): AdminUserDto[] {
  return Array.from({ length: MOCK_USER_COUNT }, (_, index) => {
    const createdAt = new Date(Date.now() - index * (DAY_MS * 3)).toISOString();
    // 3명 중 1명꼴로 탈퇴(soft delete) 처리된 계정을 섞어 상태 필터 테스트가 가능하게 한다.
    const isDeleted = index % 9 === 4;

    return {
      id: `user-${index + 1}`,
      provider: pick(PROVIDERS, index),
      providerSubject: `provider-subject-${index + 1}`,
      role: index === 0 ? 'admin' : 'member',
      createdAt,
      deletedAt: isDeleted ? new Date(Date.now() - index * DAY_MS).toISOString() : null,
    };
  });
}

function buildMockAdminUserProfiles(): AdminUserProfileDto[] {
  // 전체 사용자 중 마지막 몇 명은 온보딩 프로필을 아직 작성하지 않은 상태로 남겨 빈 상태를 재현한다.
  const profiledUserCount = MOCK_USER_COUNT - 6;

  return Array.from({ length: profiledUserCount }, (_, index) => ({
    userId: `user-${index + 1}`,
    birthYear: 1992 + (index % 12),
    employmentStatus: pick(EMPLOYMENT_STATUSES, index),
    educationLevel: pick(EDUCATION_LEVELS, index),
    categories: [pick(CATEGORY_POOL, index), pick(CATEGORY_POOL, index + 1)],
    keywords: [pick(KEYWORD_POOL, index), pick(KEYWORD_POOL, index + 2)],
    status: 'ONBOARDED',
    regionLabel: pick(REGION_LABELS, index),
    marriageStatus: pick(MARRIAGE_STATUSES, index),
    major: pick(MAJORS, index),
    specializedCondition: index % 5 === 0 ? '한부모가정' : '해당없음',
    annualIncome: index % 4 === 0 ? null : 2000 + index * 100,
  }));
}

export const MOCK_ADMIN_USER_DTOS: AdminUserDto[] = buildMockAdminUsers();
export const MOCK_ADMIN_USER_PROFILE_DTOS: AdminUserProfileDto[] = buildMockAdminUserProfiles();
