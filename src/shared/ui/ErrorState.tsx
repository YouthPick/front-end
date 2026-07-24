interface ErrorStateProps {
  title: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, retryLabel = '다시 시도', onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-rose-50/30 py-16 px-4 text-center space-y-3">
      <h3 className="text-sm font-extrabold text-rose-700">{title}</h3>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
