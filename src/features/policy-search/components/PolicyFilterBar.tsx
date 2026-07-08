import { POLICY_CATEGORIES } from "@/entities/policy";

import { AGES, REGION_FILTER_OPTIONS, STATUSES } from "../policySearchOptions";
import type { PolicySearchFilterKey, PolicySearchFilters } from "../types/policySearch.types";

interface PolicyFilterBarProps {
  filters: PolicySearchFilters;
  onFilterChange: (key: PolicySearchFilterKey, value: string) => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

const CATEGORY_OPTIONS = ["전체", ...POLICY_CATEGORIES];

function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex items-center px-4.5 py-3.5 transition-colors hover:bg-slate-50/40 relative">
      <div className="flex items-center space-x-2 w-full text-left">
        <span className="text-xs font-bold text-slate-400 shrink-0">{label}</span>
        <span className="text-xs text-slate-300">|</span>
        <div className="relative flex-1">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
            id={id}
            aria-label={`${label} 필터`}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PolicyFilterBar({ filters, onFilterChange }: PolicyFilterBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
        <FilterSelect
          id="filter-region-select"
          label="지역"
          value={filters.region}
          options={REGION_FILTER_OPTIONS}
          onChange={(value) => onFilterChange("region", value)}
        />
        <FilterSelect
          id="filter-status-select"
          label="생활·상태"
          value={filters.status}
          options={STATUSES}
          onChange={(value) => onFilterChange("status", value)}
        />
        <FilterSelect
          id="filter-category-select"
          label="카테고리"
          value={filters.category}
          options={CATEGORY_OPTIONS}
          onChange={(value) => onFilterChange("category", value)}
        />
        <FilterSelect
          id="filter-age-select"
          label="연령"
          value={filters.age}
          options={AGES}
          onChange={(value) => onFilterChange("age", value)}
        />
      </div>
    </div>
  );
}
