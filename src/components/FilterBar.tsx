import React from "react";
import { REGIONS, STATUSES, CATEGORIES, AGES } from "../data";
import { FilterState } from "../types";

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
        
        {/* Region Filter */}
        <div className="flex items-center px-4.5 py-3.5 transition-colors hover:bg-slate-50/40 relative">
          <div className="flex items-center space-x-2 w-full text-left">
            <span className="text-xs font-bold text-slate-400 shrink-0">지역</span>
            <span className="text-xs text-slate-300">|</span>
            <div className="relative flex-1">
              <select
                value={filters.region}
                onChange={(e) => handleChange("region", e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
                id="filter-region-select"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center px-4.5 py-3.5 transition-colors hover:bg-slate-50/40 relative">
          <div className="flex items-center space-x-2 w-full text-left">
            <span className="text-xs font-bold text-slate-400 shrink-0">생활·상태</span>
            <span className="text-xs text-slate-300">|</span>
            <div className="relative flex-1">
              <select
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
                id="filter-status-select"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center px-4.5 py-3.5 transition-colors hover:bg-slate-50/40 relative">
          <div className="flex items-center space-x-2 w-full text-left">
            <span className="text-xs font-bold text-slate-400 shrink-0">카테고리</span>
            <span className="text-xs text-slate-300">|</span>
            <div className="relative flex-1">
              <select
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
                id="filter-category-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Age Filter */}
        <div className="flex items-center px-4.5 py-3.5 transition-colors hover:bg-slate-50/40 relative">
          <div className="flex items-center space-x-2 w-full text-left">
            <span className="text-xs font-bold text-slate-400 shrink-0">연령</span>
            <span className="text-xs text-slate-300">|</span>
            <div className="relative flex-1">
              <select
                value={filters.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
                id="filter-age-select"
              >
                {AGES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
