import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const MAX_RETRY_COUNT = 1;

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRY_COUNT) return false;

  if (!axios.isAxiosError(error)) return true;

  const status = error.response?.status;
  return status === undefined || status >= 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: shouldRetryQuery,
    },
  },
});
