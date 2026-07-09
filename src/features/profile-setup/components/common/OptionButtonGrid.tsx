interface OptionButtonGridProps {
  label: string;
  options: string[];
  isSelected: (option: string) => boolean;
  onSelect: (value: string) => void;
}

// 단일 선택(라디오)·복수 선택(체크박스) 모두 isSelected/onSelect 콜백으로 위임해 재사용한다.
export function OptionButtonGrid({ label, options, isSelected, onSelect }: OptionButtonGridProps) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = isSelected(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              aria-pressed={selected}
              className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                selected
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
