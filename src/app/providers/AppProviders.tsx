import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { useAuthBootstrap } from '@/features/auth';
import { queryClient } from '@/shared/api';

interface AppProvidersProps {
  children: ReactNode;
}

function AuthBootstrap() {
  useAuthBootstrap();
  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      {children}
    </QueryClientProvider>
  );
}
