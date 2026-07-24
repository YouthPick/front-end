import { ProfileSetupContainer } from '@/features/profile-setup';
import { useSeo } from '@/shared/hooks';

export function ProfileSetupPage() {
  useSeo({ title: '프로필 설정', noindex: true });

  return (
    <div className="animate-in fade-in duration-300 max-w-xl mx-auto py-6">
      <ProfileSetupContainer />
    </div>
  );
}
