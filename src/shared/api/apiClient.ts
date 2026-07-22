import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getAccessToken, notifySessionExpired, setAccessToken } from './tokenStore';

// 배포 환경은 리버스 프록시가 /api를 백엔드로 전달한다고 가정한다.
// 로컬에서 백엔드를 별도 오리진(예: http://localhost:8080)으로 띄웠다면
// .env에 VITE_API_BASE_URL=http://localhost:8080/api 를 설정해 오버라이드한다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  // refresh token이 HttpOnly 쿠키로 오가야 하므로 쿠키 동봉이 필요하다.
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const REFRESH_TOKEN_PATH = '/v1/auth/token/refresh';

let refreshPromise: Promise<string> | null = null;

// apiClient 자체가 아닌 별도 axios 인스턴스로 호출해, 이 응답 인터셉터가 refresh 요청에는 재귀 적용되지 않게 한다.
// 동시에 여러 곳(예: 401 재시도, 앱 부팅 시 세션 복원)에서 호출돼도 refreshPromise로 단일 요청만
// 실제로 나가게 한다 — refresh token이 1회용으로 회전되는 백엔드에서 동시 요청 중 하나가 401로
// 실패하는 것을 방지한다.
export function requestNewAccessToken(): Promise<string> {
  const hasHint = localStorage.getItem('has_logged_in_hint') === 'true';
  if (!hasHint) {
    return Promise.reject(new Error('No login session hint'));
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ data: { accessToken: string } }>(`${API_BASE_URL}/v1/auth/token/refresh`, null, {
        withCredentials: true,
        timeout: 10_000,
      })
      .then((response) => {
        const token = response.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .catch((error) => {
        localStorage.removeItem('has_logged_in_hint');
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isRefreshRequest = originalRequest?.url?.includes(REFRESH_TOKEN_PATH) ?? false;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;
      try {
        const token = await requestNewAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${token}`);
        return apiClient(originalRequest);
      } catch {
        notifySessionExpired();
      }
    }

    return Promise.reject(error);
  },
);
