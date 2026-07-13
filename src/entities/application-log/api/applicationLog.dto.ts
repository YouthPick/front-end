export type ApplicationLogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface ApplicationLogDto {
  id: string;
  userId: string | null;
  logLevel: ApplicationLogLevel;
  message: string;
  traceId: string;
  requestMethod: string;
  requestUri: string;
  userIp: string;
  exceptionClass: string | null;
  exceptionMessage: string | null;
  stackTrace: string | null;
  createdAt: string;
}
