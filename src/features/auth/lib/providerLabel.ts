const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오',
  naver: '네이버',
  google: 'Google',
};

export function getProviderLabel(providerId: string): string {
  return PROVIDER_LABEL[providerId] ?? providerId;
}
