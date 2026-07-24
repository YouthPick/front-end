import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 px-4 text-center space-y-4 max-w-2xl mx-auto">
      {icon && <span className="text-5xl block animate-bounce">{icon}</span>}
      <h3 className="text-sm font-extrabold text-slate-700">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
      {children && <div className="flex justify-center space-x-2 pt-1">{children}</div>}
    </div>
  );
}
