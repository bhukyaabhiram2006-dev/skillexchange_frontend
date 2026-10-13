import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0, count, showNumber = true }) {
  return (
    <div className="inline-flex items-center gap-1 text-amber-500">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      {showNumber && (
        <span className="text-xs font-bold text-slate-800 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-slate-400 font-normal">({count})</span>
      )}
    </div>
  );
}
