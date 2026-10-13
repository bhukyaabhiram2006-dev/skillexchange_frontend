import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

export default function FilterPanel({
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  selectedFormat,
  onSelectFormat,
  onResetFilters,
  hasActiveFilters,
}) {
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const formats = ['All', '1-on-1 Mentoring', 'Project Collab', 'Study Group', 'Async Review'];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
          Difficulty Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {levels.map((lvl) => {
            const isActive = (selectedLevel || 'All') === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl === 'All' ? '' : lvl)}
                className={`text-xs py-2 px-3 rounded-lg font-medium border text-center transition-all ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Format */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5">
          Exchange Format
        </label>
        <div className="space-y-1.5">
          {formats.map((fmt) => {
            const isActive = (selectedFormat || 'All') === fmt;
            return (
              <button
                key={fmt}
                onClick={() => onSelectFormat(fmt === 'All' ? '' : fmt)}
                className={`w-full text-left text-xs py-2 px-3 rounded-lg font-medium border transition-all ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {fmt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
