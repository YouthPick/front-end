import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // apiClient의 baseURL('/api')을 로컬 백엔드로 전달한다. 배포 환경의 리버스 프록시와 같은 역할.
      // ws: true가 없으면 Vite가 WebSocket Upgrade 요청은 프록시하지 않아 정책 채팅(STOMP)이
      // 연결에 계속 실패하고 재연결을 반복한다 — 문자열 축약형 대신 객체 형태로 명시한다.
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
        },
      },
      // 내부 네트워크의 다른 PC에서 접속할 수 있도록 모든 인터페이스에 바인딩한다.
      host: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    test: {
      environment: 'jsdom',
    },
  };
});
