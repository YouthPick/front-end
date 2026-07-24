import type { ApplicationLogLevel } from '../api/applicationLog.dto';

export interface ApplicationLog {
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
