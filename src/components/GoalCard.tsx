import React from 'react';
import { Goal } from '../types';
import { calculateGoalStats, formatCurrency } from '../utils/calculations';
import { CheckCircle2, PlusCircle, Calendar, Sparkles } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  currency: string;
  onClick: () => void;
  onQuickAdd: (e: React.MouseEvent) => void;
  darkMode?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  currency,
  onClick,
  onQuickAdd,
  darkMode = false,
}) => {
  const stats = calculateGoalStats(goal);

  return (
    <div
      id={`goal-card-${goal.id}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative w-full cursor-pointer rounded-2xl border transition-all duration-200 hover:shadow-md active:scale-[0.99] ${
        darkMode
          ? 'border-white/[0.08] bg-[#22303A] text-slate-200 hover:border-white/20'
          : 'border-slate-200/80 bg-white text-slate-900 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Image / Category + Name + Action Buttons */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {goal.imageUrl ? (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-inner">
                <img
                  src={goal.imageUrl}
                  alt={goal.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#344B5A] to-[#F5B041] text-white shadow-sm font-bold text-lg">
                {goal.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`font-heading text-base sm:text-lg font-bold tracking-tight truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {goal.name}
                </h3>
                {stats.isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    Done
                  </span>
                )}
              </div>
              <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Calendar className="h-3 w-3 flex-shrink-0" />
                Target: {stats.targetDateFormatted}
              </p>
            </div>
          </div>

          {/* Quick Add Saving Action */}
          <div className="flex items-center flex-shrink-0">
            <button
              id={`quick-add-${goal.id}`}
              type="button"
              onClick={onQuickAdd}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-90 ${
                darkMode
                  ? 'bg-white/10 text-[#F5B041] hover:bg-white/20'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
              title="Add saving"
              aria-label={`Add saving to ${goal.name}`}
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Saved vs Goal Amount */}
        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-sm font-semibold">
            <span className={darkMode ? 'text-slate-100' : 'text-slate-900'}>
              {formatCurrency(goal.savedAmount, currency, false)}
            </span>
            <span className={`font-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {' '}saved
            </span>
          </div>
          <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            / {formatCurrency(goal.targetAmount, currency, false)} goal
          </div>
        </div>

        {/* Progress Bar with pink/magenta or gold accent */}
        <div className="mt-2 relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              stats.isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-[#EC407A] to-[#F5B041]'
            }`}
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {/* Footer info: % completed + remaining */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="font-bold text-[#EC407A] dark:text-pink-400">
            {stats.progress}% completed
          </span>

          <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
            {stats.isCompleted ? (
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Fully Funded
              </span>
            ) : (
              <span>
                <strong className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {formatCurrency(stats.remaining, currency, false)}
                </strong>{' '}
                remaining
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
