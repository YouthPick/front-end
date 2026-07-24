import { describe, expect, it } from 'vitest';

import { shouldRetryQuery } from './queryClient';

function axiosError(status?: number): unknown {
  return {
    isAxiosError: true,
    response: status === undefined ? undefined : { status },
  };
}

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404, 409])('does not retry HTTP %i responses', (status) => {
    expect(shouldRetryQuery(0, axiosError(status))).toBe(false);
  });

  it.each([500, 502, 503])('retries transient HTTP %i responses once', (status) => {
    expect(shouldRetryQuery(0, axiosError(status))).toBe(true);
    expect(shouldRetryQuery(1, axiosError(status))).toBe(false);
  });

  it('retries network and non-Axios errors once', () => {
    expect(shouldRetryQuery(0, axiosError())).toBe(true);
    expect(shouldRetryQuery(0, new Error('network unavailable'))).toBe(true);
  });
});
