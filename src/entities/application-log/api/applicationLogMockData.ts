import type { ApplicationLogDto, ApplicationLogLevel } from './applicationLog.dto';

const LOG_LEVEL_CYCLE: ApplicationLogLevel[] = ['INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
const REQUEST_URIS = [
  '/api/policies',
  '/api/policies/search',
  '/api/policy-applications',
  '/api/community/posts',
  '/api/auth/login',
];
const MOCK_LOG_COUNT = 120;
const MINUTE_MS = 60 * 1000;

function buildMockApplicationLogs(): ApplicationLogDto[] {
  return Array.from({ length: MOCK_LOG_COUNT }, (_, index) => {
    const logLevel = LOG_LEVEL_CYCLE[index % LOG_LEVEL_CYCLE.length];
    const isError = logLevel === 'ERROR';
    const createdAt = new Date(Date.now() - index * (MINUTE_MS * 7)).toISOString();

    return {
      id: `app-log-${index + 1}`,
      userId: index % 4 === 0 ? null : `user-${(index % 12) + 1}`,
      logLevel,
      message: isError
        ? '정책 동기화 처리 중 예외가 발생했습니다.'
        : `${REQUEST_METHODS[index % REQUEST_METHODS.length]} 요청을 처리했습니다.`,
      traceId: `trace-${(index + 1).toString().padStart(6, '0')}`,
      requestMethod: REQUEST_METHODS[index % REQUEST_METHODS.length],
      requestUri: REQUEST_URIS[index % REQUEST_URIS.length],
      userIp: `192.168.${index % 255}.${(index * 7) % 255}`,
      exceptionClass: isError ? 'java.lang.NullPointerException' : null,
      exceptionMessage: isError ? '정책 응답 필드가 비어 있습니다.' : null,
      stackTrace: isError
        ? 'at com.bop.policy.PolicySyncService.sync(PolicySyncService.java:42)\nat com.bop.policy.PolicySyncJob.run(PolicySyncJob.java:18)'
        : null,
      createdAt,
    };
  });
}

export const MOCK_APPLICATION_LOG_DTOS: ApplicationLogDto[] = buildMockApplicationLogs();
