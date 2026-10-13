import React, { useState } from 'react';
import { Flame, Star, Sparkles, Info } from 'lucide-react';

export default function MatchScoreBadge({ match, showExplanation = false, className = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!match || typeof match.score !== 'number') return null;

  const { score, label, isMutual, explanation } = match;

  let Icon = Sparkles;
  let bgStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  if (isMutual || score >= 90) {
    Icon = Flame;
    bgStyle = 'bg-violet-100 text-violet-800 border-violet-200';
  } else if (score >= 75) {
    Icon = Star;
    bgStyle = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (score >= 60) {
    Icon = Sparkles;
    bgStyle = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgStyle} cursor-pointer select-none transition-transform hover:scale-102`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        title={explanation}
      >
        <Icon className="w-3.5 h-3.5 fill-current" />
        <span>{score}% Match</span>
        {label && <span className="opacity-80 font-normal">({label})</span>}
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </div>

      {/* Tooltip explaining the match reason */}
      {(showTooltip || showExplanation) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-30 pointer-events-none animate-fade-in border border-slate-700/50 leading-relaxed">
          <p className="font-semibold text-violet-300 mb-1 flex items-center gap-1">
            <Icon className="w-3 h-3" />
            {isMutual ? 'Mutual Skill Exchange Match' : 'Recommended Match'}
          </p>
          <p className="text-slate-300">{explanation}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
