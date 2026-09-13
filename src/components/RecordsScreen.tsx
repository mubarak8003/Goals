import React, { useState } from 'react';
import { Goal, SavingsRecord } from '../types';
import { formatCurrency, formatDatePretty } from '../utils/calculations';
import { Receipt, Search, Filter, Trash2, FileEdit, Plus, ArrowUpRight } from 'lucide-react';

interface RecordsScreenProps {
  records: SavingsRecord[];
  goals: Goal[];
  currency: string;
  onOpenEditRecord: (record: SavingsRecord) => void;
  onOpenDeleteRecord: (record: SavingsRecord) => void;
  onSelectGoal: (goalId: string) => void;
  darkMode?: boolean;
}

export const RecordsScreen: React.FC<RecordsScreenProps> = ({
  records,
  goals,
  currency,
  onOpenEditRecord,
  onOpenDeleteRecord,
  onSelectGoal,
  darkMode = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all');

  const goalMap = new Map<string, Goal>();
  goals.forEach((g) => goalMap.set(g.id, g));

  const filteredRecords = records.filter((rec) => {
    const matchesGoal = selectedGoalId === 'all' || rec.goalId === selectedGoalId;
    const goalName = goalMap.get(rec.goalId)?.name.toLowerCase() || '';
    const note = rec.note?.toLowerCase() || '';
    const query = search.toLowerCase();
    const matchesSearch = !query || goalName.includes(query) || note.includes(query);
    return matchesGoal && matchesSearch;
  });

  const totalFilteredSaved = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className={`p-4 sm:p-6 min-h-full flex flex-col ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
      {/* Title & Summary */}
      <div className="mb-4">
        <h2 className={`font-heading text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Transaction History</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          All deposits logged towards your savings goals
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes or goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-xs outline-hidden transition-all ${
              darkMode
                ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 placeholder-slate-500 focus:border-[#F5B041]'
                : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#344B5A]'
            }`}
          />
        </div>

        <select
          value={selectedGoalId}
          onChange={(e) => setSelectedGoalId(e.target.value)}
          className={`rounded-xl border py-2.5 px-3 text-xs font-semibold outline-hidden transition-all ${
            darkMode
              ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
              : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
          }`}
        >
          <option value="all">All Goals ({goals.length})</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Total Filtered Stat Banner */}
      <div className={`mb-4 flex items-center justify-between rounded-2xl border px-4 py-3 ${
        darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-slate-50'
      }`}>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing {filteredRecords.length} records
        </span>
        <span className="font-heading font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          {formatCurrency(totalFilteredSaved, currency, true)}
        </span>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center bg-white/40 dark:bg-white/5">
          <Receipt className="h-10 w-10 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No records found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredRecords.map((rec) => {
            const goal = goalMap.get(rec.goalId);
            return (
              <div
                key={rec.id}
                id={`history-rec-${rec.id}`}
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

                    {goal && (
                      <button
                        type="button"
                        onClick={() => onSelectGoal(goal.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#344B5A] dark:text-[#F5B041] hover:underline mt-0.5"
                      >
                        <span>{goal.name}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {formatDatePretty(rec.date)}
                      {rec.note ? ` • ${rec.note}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenEditRecord(rec)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                    title="Edit record"
                  >
                    <FileEdit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDeleteRecord(rec)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
