import { EmptyState } from '@/shared/ui';

interface AdminComingSoonProps {
  title: string;
  description: string;
}

export function AdminComingSoon({ title, description }: AdminComingSoonProps) {
  return <EmptyState icon="🚧" title={title} description={description} />;
}
