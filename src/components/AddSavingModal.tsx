import React, { useState, useEffect } from 'react';
import { Goal, SavingsRecord } from '../types';
import { formatCurrency } from '../utils/calculations';
import { X, Plus, Calendar, FileText } from 'lucide-react';

interface AddSavingModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  currency: string;
  onSave: (amount: number, date: string, note?: string) => void;
  editingRecord?: SavingsRecord | null;
  darkMode?: boolean;
}

export const AddSavingModal: React.FC<AddSavingModalProps> = ({
  isOpen,
  onClose,
  goal,
  currency,
  onSave,
  editingRecord,
  darkMode = false,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [amount, setAmount] = useState<string>(
    editingRecord ? editingRecord.amount.toString() : ''
  );
  const [date, setDate] = useState<string>(
    editingRecord ? editingRecord.date : todayStr
  );
  const [note, setNote] = useState<string>(
    editingRecord?.note || ''
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setAmount(editingRecord ? editingRecord.amount.toString() : '');
      setDate(editingRecord ? editingRecord.date : new Date().toISOString().split('T')[0]);
      setNote(editingRecord?.note || '');
      setError('');
    }
  }, [isOpen, editingRecord]);

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid savings amount greater than 0');
      return;
    }
    if (!date) {
      setError('Please select a date for this deposit');
      return;
    }

    onSave(numAmount, date, note);
    onClose();
  };

  const handleQuickAdd = (chipAmount: number) => {
    setAmount(chipAmount.toString());
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        id="add-saving-modal"
        className={`relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all ${
          darkMode ? 'bg-[#22303A] text-slate-200' : 'bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-white/10">
          <div>
            <h2 className={`font-heading text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-[#344B5A]'}`}>
              {editingRecord ? 'Edit Savings Record' : 'Add Savings Deposit'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For: <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{goal.name}</span>
            </p>
          </div>
          <button
            id="close-add-saving-modal"
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Deposit Amount ({currency})
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xl font-bold text-slate-400 dark:text-slate-500">
                {currency}
              </span>
              <input
                id="saving-amount-input"
                type="number"
                step="any"
                min="1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-2xl font-bold tracking-tight outline-hidden transition-all ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#1A252D] text-slate-100 focus:border-[#F5B041]'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-[#344B5A] focus:bg-white'
                }`}
                autoFocus
              />
            </div>
            {error && <p className="mt-1.5 text-xs font-semibold text-rose-500">{error}</p>}
          </div>

          {/* Quick preset chips */}
          {!editingRecord && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                Quick Shortcuts
              </p>
              <div className="flex flex-wrap gap-2">
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAdd(val)}
                    className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-bold text-[#344B5A] dark:text-[#F5B041] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    +{currency}{val.toLocaleString()}
                  </button>
                ))}
                {remaining > 0 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(remaining)}
                    className="rounded-full border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 transition-colors"
                  >
                    Full Remaining ({formatCurrency(remaining, currency, false)})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Deposit Date
            </label>
            <input
              id="saving-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full rounded-xl border py-2.5 px-3.5 text-sm font-medium outline-hidden transition-all ${
                darkMode
                  ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
              }`}
            />
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Note (Optional)
            </label>
            <input
              id="saving-note-input"
              type="text"
              placeholder="e.g. Monthly salary share, bonus, cash gift"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`w-full rounded-xl border py-2.5 px-3.5 text-sm outline-hidden transition-all ${
                darkMode
                  ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 placeholder-slate-500 focus:border-[#F5B041]'
                  : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#344B5A]'
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="submit-saving-btn"
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#344B5A] py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:bg-[#283944] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              <span>{editingRecord ? 'Update Record' : 'Add Deposit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
