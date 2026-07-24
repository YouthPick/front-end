import type { RegionDto } from '../api/region.dto';
import type { Region } from './region.types';

export function mapRegionDtoToRegion(dto: RegionDto): Region {
  return {
    regionCode: dto.regionCode,
    provinceName: dto.provinceName,
    districtName: dto.districtName,
  };
}

export function getRegionLabel(region: Region): string {
  return `${region.provinceName} ${region.districtName}`;
}
