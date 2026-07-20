import { apiClient } from '@/shared/api';

export interface FileUploadResponse {
  url: string;
  filename: string;
}

interface FileUploadResponseDto {
  fileId: string;
  originalFilename: string;
  contentType: string;
  size: number;
  downloadUrl: string;
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<{ data: FileUploadResponseDto }>('/v1/files', formData);
  return {
    url: response.data.data.downloadUrl,
    filename: response.data.data.originalFilename,
  };
}
