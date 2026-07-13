import type { LoginHistoryDto } from '../api/loginHistory.dto';
import type { LoginHistory } from './loginHistory.types';

export function mapLoginHistoryDtoToLoginHistory(dto: LoginHistoryDto): LoginHistory {
  return {
    id: dto.id,
    userId: dto.userId,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
