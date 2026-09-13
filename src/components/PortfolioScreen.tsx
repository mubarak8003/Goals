import React, { useState, useEffect } from 'react';
import { Goal, SavingsRecord } from '../types';
import { calculateGoalStats, formatCurrency } from '../utils/calculations';
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Receipt,
  AlertCircle,
  FileEdit,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PortfolioScreenProps {
  goal: Goal;
  currency: string;
  onBack: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal?: (goal: Goal) => void;
  onOpenAddSaving: (goal: Goal) => void;
  onOpenEditRecord: (record: SavingsRecord) => void;
  onOpenDeleteRecord: (record: SavingsRecord) => void;
  records: SavingsRecord[];
  darkMode?: boolean;
}

export const PortfolioScreen: React.FC<PortfolioScreenProps> = ({
  goal,
  currency,
  onBack,
  onEditGoal,
  onDeleteGoal,
  onOpenAddSaving,
  onOpenEditRecord,
  onOpenDeleteRecord,
  records,
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'goal' | 'records'>('goal');
  const stats = calculateGoalStats(goal);

  // Trigger celebration confetti if just loaded completed
  useEffect(() => {
    if (stats.isCompleted) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F5B041', '#EC407A', '#344B5A', '#2ECC71'],
        });
      } catch (e) {
        // ignore if not supported
      }
    }
  }, [stats.isCompleted]);

  // Circular progress calculations
  const radius = 86;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * stats.progress) / 100;

  return (
    <div
      id="portfolio-screen"
      className={`min-h-full w-full flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-[#18232A] text-slate-200' : 'bg-[#EBF0F4] text-slate-900'
      }`}
    >
      {/* 1. HEADER (Dark blue-gray #344B5A) */}
      <header className="sticky top-0 z-20 w-full bg-[#344B5A] text-white shadow-md">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            id="portfolio-back-btn"
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 active:scale-95"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <h1
            id="portfolio-title"
            className="truncate px-2 text-lg font-bold tracking-wide text-white"
          >
            {goal.name}
          </h1>

          <div className="flex items-center gap-1">
            {onDeleteGoal && (
              <button
                id="portfolio-delete-btn"
                type="button"
                onClick={() => onDeleteGoal(goal)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-rose-400 active:scale-95"
                aria-label="Delete goal"
                title="Delete Goal"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}

            <button
              id="portfolio-edit-btn"
              type="button"
              onClick={() => onEditGoal(goal)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#F5B041] transition-all hover:bg-white/10 hover:text-amber-300 active:scale-95"
              aria-label="Edit goal details"
              title="Edit Goal"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2. TABS: GOAL & RECORDS */}
        <div className="flex w-full border-t border-white/10 px-4">
          <button
            id="tab-goal"
            type="button"
            onClick={() => setActiveTab('goal')}
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wider transition-colors uppercase ${
              activeTab === 'goal' ? 'text-[#F5B041]' : 'text-white/60 hover:text-white/90'
            }`}
          >
            GOAL
            {activeTab === 'goal' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5B041] rounded-t-sm" />
            )}
          </button>

          <button
            id="tab-records"
            type="button"
            onClick={() => setActiveTab('records')}
            className={`relative flex-1 py-3 text-center text-sm font-bold tracking-wider transition-colors uppercase flex items-center justify-center gap-1.5 ${
              activeTab === 'records' ? 'text-[#F5B041]' : 'text-white/60 hover:text-white/90'
            }`}
          >
            RECORDS
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === 'records' ? 'bg-[#F5B041] text-[#24333D]' : 'bg-white/20 text-white'
              }`}
            >
              {records.length}
            </span>
            {activeTab === 'records' && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#F5B041] rounded-t-sm" />
            )}
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      {activeTab === 'goal' ? (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top section: Progress Ring, Amount & Add Saving Button */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6">
            {/* Circular Progress Ring with Goal Image */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-56 w-56 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 200 200">
                  {/* Background Track Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    className="stroke-slate-200 dark:stroke-slate-700/50"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Active Progress Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke={stats.isCompleted ? '#10B981' : '#E91E63'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Centered Image */}
                <div className="absolute h-36 w-36 overflow-hidden rounded-full border-4 border-white dark:border-[#22303A] shadow-md bg-slate-100 dark:bg-slate-800">
                  {goal.imageUrl ? (
                    <img
                      src={goal.imageUrl}
                      alt={goal.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#344B5A] to-[#F5B041] text-3xl font-extrabold text-white">
                      {goal.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Percentage Badge */}
                <div className="absolute -bottom-1">
                  <span className="inline-flex items-center rounded-full bg-[#E91E63] px-3.5 py-1 text-xs font-black tracking-wide text-white shadow-md">
                    {stats.progress} %
                  </span>
                </div>
              </div>
            </div>

            {/* SAVED Amount Section */}
            <div className="mt-5 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#344B5A] dark:text-slate-400">
                SAVED
              </span>
              <div className={`mt-1 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-slate-100' : 'text-[#24333D]'}`}>
                {formatCurrency(goal.savedAmount, currency, true)}
              </div>
            </div>

            {/* Two Columns: REMAINING and GOAL */}
            <div className="mt-5 flex w-full max-w-xs items-center justify-between border-t border-slate-200/80 dark:border-white/[0.08] pt-4 text-center">
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  REMAINING
                </span>
                <div className={`mt-0.5 font-heading text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {formatCurrency(stats.remaining, currency, true)}
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-white/[0.08]" />

              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  GOAL
                </span>
                <div className={`mt-0.5 font-heading text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {formatCurrency(goal.targetAmount, currency, true)}
                </div>
              </div>
            </div>

            {/* ADD SAVING BUTTON: Large white pill-shaped button with colorful + icon */}
            <div className="mt-7 w-full max-w-xs">
              <button
                id="portfolio-add-saving-btn"
                type="button"
                onClick={() => onOpenAddSaving(goal)}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-base font-bold text-[#344B5A] shadow-md transition-all duration-200 hover:bg-slate-50 hover:shadow-lg active:scale-95 dark:bg-[#24323C] dark:text-slate-100 dark:hover:bg-[#2C3B47] dark:border dark:border-white/[0.08]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#EC407A] via-[#F5B041] to-emerald-400 text-white shadow-sm transition-transform group-hover:rotate-90 duration-300">
                  <Plus className="h-4 w-4 stroke-[3]" />
                </div>
                <span>Add saving</span>
              </button>
            </div>
          </div>

          {/* 3. BOTTOM INFORMATION: Dark blue-gray #344B5A section */}
          <div
            id="portfolio-bottom-info"
            className="w-full bg-[#344B5A] text-white pt-6 pb-8 px-6 rounded-t-3xl shadow-xl mt-4"
          >
            {/* Target Date Header */}
            <div className="text-center">
              <p className="text-xs font-medium tracking-wide text-white/80">
                Target on {stats.targetDateFormatted}
              </p>
              <h3 className="mt-1 font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                {stats.isCompleted ? (
                  <span className="flex items-center justify-center gap-2 text-emerald-300">
                    <Sparkles className="h-5 w-5 text-[#F5B041]" />
                    Goal Completed!
                  </span>
                ) : (
                  `“${stats.timeRemainingLabel}”`
                )}
              </h3>
            </div>

            {/* Three Columns: Daily, Weekly, Monthly */}
            {!stats.isCompleted ? (
              <div className="mt-6 grid grid-cols-3 divide-x divide-white/15 text-center">
                <div className="px-2">
                  <p className="text-xs font-semibold text-white/70">Daily</p>
                  <p className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                    {formatCurrency(stats.dailyRequired, currency, true)}
                  </p>
                </div>

                <div className="px-2">
                  <p className="text-xs font-semibold text-white/70">Weekly</p>
                  <p className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                    {formatCurrency(stats.weeklyRequired, currency, true)}
                  </p>
                </div>

                <div className="px-2">
                  <p className="text-xs font-semibold text-white/70">Monthly</p>
                  <p className="mt-1 font-heading text-sm sm:text-base font-bold text-white">
                    {formatCurrency(stats.monthlyRequired, currency, true)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-white/10 p-3.5 text-center border border-white/10">
                <p className="text-sm font-semibold text-emerald-300">
                  Congratulations! You have reached 100% of your target savings.
                </p>
                <p className="text-xs text-white/70 mt-1">
                  Keep this milestone saved or update the target to grow even further.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RECORDS TAB CONTENT */
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`font-heading text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              Savings Transactions
            </h2>
            <button
              id="records-add-btn"
              type="button"
              onClick={() => onOpenAddSaving(goal)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#344B5A] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#283944] active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Record
            </button>
          </div>

          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center bg-white/50 dark:bg-white/5">
              <Receipt className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No savings records yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Log your first savings deposit to start tracking your timeline towards this goal.
              </p>
              <button
                type="button"
                onClick={() => onOpenAddSaving(goal)}
                className="mt-4 rounded-xl bg-[#344B5A] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#24333D]"
              >
                Add First Deposit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  id={`record-item-${rec.id}`}
                  className={`flex items-center justify-between rounded-2xl p-4 shadow-xs border transition-all ${
                    darkMode
                      ? 'border-white/[0.08] bg-[#22303A] text-slate-200'
                      : 'border-slate-200/80 bg-white text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-emerald-600 dark:text-emerald-400 text-base">
                          + {formatCurrency(rec.amount, currency, true)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {rec.date}
                        {rec.note ? ` • ${rec.note}` : ''}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                        Balance: {formatCurrency(rec.runningBalance, currency, true)}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      id={`edit-record-${rec.id}`}
                      type="button"
                      onClick={() => onOpenEditRecord(rec)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                      title="Edit record"
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>
                    <button
                      id={`delete-record-${rec.id}`}
                      type="button"
                      onClick={() => onOpenDeleteRecord(rec)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
