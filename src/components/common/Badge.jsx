import React from 'react';

export default function Badge({
  children,
  variant = 'indigo',
  size = 'sm',
  className = '',
}) {
  const variantClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    violet: 'bg-violet-50 text-violet-700 border-violet-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/60',
    gradient: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-xs',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantClasses[variant] || variantClasses.indigo} ${sizeClasses[size] || sizeClasses.sm} transition-colors ${className}`}
    >
      {children}
    </span>
  );
}
