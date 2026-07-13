import type { ApplicationLogDto } from '../api/applicationLog.dto';
import type { ApplicationLog } from './applicationLog.types';

export function mapApplicationLogDtoToApplicationLog(dto: ApplicationLogDto): ApplicationLog {
  return {
    id: dto.id,
    userId: dto.userId,
    logLevel: dto.logLevel,
    message: dto.message,
    traceId: dto.traceId,
    requestMethod: dto.requestMethod,
    requestUri: dto.requestUri,
    userIp: dto.userIp,
    exceptionClass: dto.exceptionClass,
    exceptionMessage: dto.exceptionMessage,
    stackTrace: dto.stackTrace,
    createdAt: dto.createdAt,
  };
}
