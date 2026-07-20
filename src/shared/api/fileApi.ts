import { MOCK_API_DELAY_MS } from '@/shared/constants';
import { delay } from '@/shared/utils';

export interface FileUploadResponse {
  url: string;
  filename: string;
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  await delay(MOCK_API_DELAY_MS);

  // 로컬 개발 환경 및 데모 목적의 Mocking을 위해
  // 페이지 새로고침 시에도 이미지가 깨지지 않고 유지될 수 있도록
  // File 객체를 Base64 Data URL로 변환하여 반환합니다.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve({
          url: reader.result,
          filename: file.name,
        });
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error('FileReader error'));
    };
    reader.readAsDataURL(file);
  });
}
