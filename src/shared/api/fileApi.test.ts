import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiClientMock = vi.hoisted(() => ({ post: vi.fn() }));

vi.mock('@/shared/api', () => ({ apiClient: apiClientMock }));

import { uploadFile } from './fileApi';

describe('파일 업로드 API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('이미지를 multipart/form-data로 실제 파일 API에 업로드한다', async () => {
    const file = new File(['image-bytes'], 'youth.png', { type: 'image/png' });
    apiClientMock.post.mockResolvedValue({
      data: {
        data: {
          fileId: '2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21',
          originalFilename: 'youth.png',
          contentType: 'image/png',
          size: 11,
          downloadUrl: '/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21',
        },
      },
    });

    await expect(uploadFile(file)).resolves.toEqual({
      url: '/api/v1/files/2e5c2c2f-22c7-43a9-8d2c-8902a29b2b21',
      filename: 'youth.png',
    });

    expect(apiClientMock.post).toHaveBeenCalledWith('/v1/files', expect.any(FormData));
    const formData = apiClientMock.post.mock.calls[0][1] as FormData;
    expect(formData.get('file')).toBe(file);
  });
});
