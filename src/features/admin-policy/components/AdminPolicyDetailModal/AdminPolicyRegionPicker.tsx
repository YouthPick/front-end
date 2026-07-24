import type { Region } from '@/entities/region';
import { getRegionLabel } from '@/entities/region';
import { ErrorState, Skeleton } from '@/shared/ui';

interface AdminPolicyRegionPickerProps {
  regions: Region[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  selectedRegionCodes: string[];
  onToggleRegion: (regionCode: string) => void;
}

export function AdminPolicyRegionPicker({
  regions,
  isLoading,
  isError,
  onRetry,
  selectedRegionCodes,
  onToggleRegion,
}: AdminPolicyRegionPickerProps) {
  if (isLoading) {
    return (
      <div className="space-y-1.5">
        <Skeleton className="h-6" />
        <Skeleton className="h-6" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="지역 목록을 불러오지 못했습니다" onRetry={onRetry} />;
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto rounded-2xl border border-slate-100 p-2.5">
      {regions.map((region) => {
        const isChecked = selectedRegionCodes.includes(region.regionCode);
        return (
          <label
            key={region.regionCode}
            className="flex items-center space-x-1.5 rounded-lg px-1.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggleRegion(region.regionCode)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span>{getRegionLabel(region)}</span>
          </label>
        );
      })}
    </div>
  );
}
