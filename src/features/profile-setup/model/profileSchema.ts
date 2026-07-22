import { z } from 'zod';
import { CURRENT_YEAR } from '@/shared/constants';

const MIN_ELIGIBLE_AGE = 14;
const MAX_ELIGIBLE_AGE = 38;

export const profileSchema = z.object({
  birthYear: z
    .any()
    .refine((val) => typeof val === 'number' && Number.isInteger(val), {
      message: '출생연도를 선택해 주세요.',
    })
    .refine(
      (year) => {
        const age = CURRENT_YEAR - Number(year);
        return age >= MIN_ELIGIBLE_AGE && age <= MAX_ELIGIBLE_AGE;
      },
      {
        message: `출생연도는 만 ${MIN_ELIGIBLE_AGE}세 이상 만 ${MAX_ELIGIBLE_AGE}세 이하만 가능합니다.`,
      },
    ),
  region: z.any().refine((val) => typeof val === 'string' && val.trim() !== '', {
    message: '거주 광역시·도를 선택해 주세요.',
  }),
  subRegion: z.string().optional(),
  employmentStatus: z.any().refine((val) => typeof val === 'string' && val.trim() !== '', {
    message: '현재 취업 고용 상태를 선택해 주세요.',
  }),
  educationStatus: z.any().refine((val) => typeof val === 'string' && val.trim() !== '', {
    message: '최종 학력 상태를 선택해 주세요.',
  }),
  maritalStatus: z.string().optional(),
  major: z.string().optional(),
  specialConditions: z.array(z.string()).default([]),
  annualIncome: z
    .any()
    .refine((val) => val === undefined || val === null || (typeof val === 'number' && val >= 0), {
      message: '연소득은 음수일 수 없습니다.',
    })
    .nullable()
    .optional(),
  incomeUnknown: z.boolean().default(false),
  interests: z.array(z.string()).max(3, '관심 분야는 최대 3개까지 선택할 수 있습니다.').default([]),
  keywords: z
    .array(z.string())
    .max(5, '관심 키워드는 최대 5개까지 선택할 수 있습니다.')
    .default([]),
});

export type ProfileSchemaInput = z.infer<typeof profileSchema>;
