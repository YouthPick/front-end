import type { Region } from '@/entities/region';

// 시·군·구를 선택하지 않으면(전체 관내) districtName === provinceName인 시·도 대표 코드를 쓴다.
export function resolveRegionCode(
  regions: Region[],
  province: string,
  district: string,
): string | null {
  const target = district === '' ? province : district;
  return (
    regions.find((region) => region.provinceName === province && region.districtName === target)
      ?.regionCode ?? null
  );
}
