import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'indigo',
}) {
  const variantStyles = {
    indigo: {
      bg: 'bg-indigo-50/80 text-indigo-600',
      border: 'hover:border-indigo-200',
    },
    violet: {
      bg: 'bg-violet-50/80 text-violet-600',
      border: 'hover:border-violet-200',
    },
    emerald: {
      bg: 'bg-emerald-50/80 text-emerald-600',
      border: 'hover:border-emerald-200',
    },
    amber: {
      bg: 'bg-amber-50/80 text-amber-600',
      border: 'hover:border-amber-200',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md ${style.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
