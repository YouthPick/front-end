import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

export interface FileUploadResponse {
  url: string;
  filename: string;
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  await delay(MOCK_API_DELAY_MS);

  // 로컬 개발 환경 및 데모 목적의 Mocking을 위해
  // 브라우저에서 즉시 접근할 수 있는 Blob URL을 반환하여
  // 실제 업로드된 것처럼 동작하도록 합니다.
  const objectUrl = URL.createObjectURL(file);

  return {
    url: objectUrl,
    filename: file.name,
  };
}
