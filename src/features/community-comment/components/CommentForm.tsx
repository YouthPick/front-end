interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  submitLabel: string;
  disabled?: boolean;
  onCancel?: () => void;
}

export function CommentForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
  disabled = false,
  onCancel,
}: CommentFormProps) {
  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-2xl border border-slate-200 bg-white p-3 text-xs transition-colors focus:border-primary focus:outline-none shadow-sm"
        aria-label={placeholder}
      />
      <div className="flex shrink-0 gap-1.5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-bold text-slate-500 hover:bg-slate-50"
          >
            취소
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || value.trim() === ''}
          className="rounded-xl bg-primary px-3.5 py-2.5 text-[11px] font-bold text-white transition-all hover:brightness-105 disabled:opacity-40 disabled:hover:brightness-100"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
