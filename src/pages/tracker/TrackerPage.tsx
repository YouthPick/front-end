import { TrackerContainer } from '@/features/policy-tracker';
import { useSeo } from '@/shared/hooks';

export function TrackerPage() {
  useSeo({ title: '신청 관리', noindex: true });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TrackerContainer />
    </div>
  );
}
