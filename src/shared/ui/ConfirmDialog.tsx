import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const titleId = 'confirm-dialog-title';
  const descId = 'confirm-dialog-desc';

  const handleBackdropKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay — onKeyDown 핸들러로 키보드 동등 접근성을 제공한다
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      onKeyDown={handleBackdropKeyDown}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center space-x-2 text-rose-600">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          <h3 id={titleId} className="text-base font-black">
            {title}
          </h3>
        </div>
        <div id={descId} className="text-xs text-slate-500 leading-relaxed">
          {description}
        </div>
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelDisabled}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700 disabled:opacity-50 disabled:hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
