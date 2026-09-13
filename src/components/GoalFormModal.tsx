import React, { useState, useEffect } from 'react';
import { Goal, GoalCategory } from '../types';
import { GOAL_IMAGE_PRESETS } from '../services/storage';
import { X, Target, Image as ImageIcon, Calendar, Check, AlertCircle, Trash2 } from 'lucide-react';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Partial<Goal>) => void;
  onDelete?: (goal: Goal) => void;
  editingGoal?: Goal | null;
  currency: string;
  darkMode?: boolean;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingGoal,
  currency,
  darkMode = false,
}) => {
  const [name, setName] = useState(editingGoal?.name || '');
  const [targetAmount, setTargetAmount] = useState(
    editingGoal ? editingGoal.targetAmount.toString() : ''
  );
  const [savedAmount, setSavedAmount] = useState(
    editingGoal ? editingGoal.savedAmount.toString() : '0'
  );
  const [targetDate, setTargetDate] = useState(
    editingGoal?.targetDate || '2026-12-31'
  );
  const [monthlyTarget, setMonthlyTarget] = useState(
    editingGoal?.monthlyTarget ? editingGoal.monthlyTarget.toString() : ''
  );
  const [imageUrl, setImageUrl] = useState(
    editingGoal?.imageUrl || GOAL_IMAGE_PRESETS[0].url
  );
  const [category, setCategory] = useState<GoalCategory>(
    editingGoal?.category || 'investment'
  );
  const [notes, setNotes] = useState(editingGoal?.notes || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (editingGoal) {
        setName(editingGoal.name);
        setTargetAmount(editingGoal.targetAmount.toString());
        setSavedAmount(editingGoal.savedAmount.toString());
        setTargetDate(editingGoal.targetDate);
        setMonthlyTarget(editingGoal.monthlyTarget ? editingGoal.monthlyTarget.toString() : '');
        setImageUrl(editingGoal.imageUrl || GOAL_IMAGE_PRESETS[0].url);
        setCategory(editingGoal.category);
        setNotes(editingGoal.notes || '');
      } else {
        setName('');
        setTargetAmount('');
        setSavedAmount('0');
        setTargetDate('2026-12-31');
        setMonthlyTarget('');
        setImageUrl(GOAL_IMAGE_PRESETS[0].url);
        setCategory('investment');
        setNotes('');
      }
      setErrors({});
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    const numTarget = parseFloat(targetAmount);
    if (isNaN(numTarget) || numTarget <= 0) {
      newErrors.targetAmount = 'Please enter a target amount greater than 0';
    }

    const numSaved = parseFloat(savedAmount);
    if (isNaN(numSaved) || numSaved < 0) {
      newErrors.savedAmount = 'Saved amount cannot be negative';
    }

    if (!targetDate) {
      newErrors.targetDate = 'Target date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      savedAmount: parseFloat(savedAmount) || 0,
      targetDate,
      category,
      imageUrl,
      monthlyTarget: monthlyTarget ? parseFloat(monthlyTarget) : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="goal-form-modal"
        className={`relative z-10 w-full max-w-lg rounded-3xl p-6 shadow-2xl transition-all my-8 max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-[#22303A] text-slate-200' : 'bg-white text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#344B5A] text-[#F5B041]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`font-heading text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-[#344B5A]'}`}>
                {editingGoal ? 'Edit Savings Goal' : 'Create New Goal'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {editingGoal ? 'Update your target and plan' : 'Set a target to keep track of your savings'}
              </p>
            </div>
          </div>
          <button
            id="close-goal-form-modal"
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Goal Name *
            </label>
            <input
              id="goal-name-input"
              type="text"
              placeholder="e.g. Portfolio, Emergency Fund, Dream Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl border py-2.5 px-3.5 text-sm font-semibold outline-hidden transition-all ${
                darkMode
                  ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
              }`}
              autoFocus
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Target Amount & Initial Saved Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Target Amount ({currency}) *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-bold text-slate-400">{currency}</span>
                <input
                  id="goal-target-amount-input"
                  type="number"
                  step="any"
                  placeholder="10000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 pl-8 pr-3 text-sm font-bold outline-hidden transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
                  }`}
                />
              </div>
              {errors.targetAmount && (
                <p className="mt-1 text-xs text-rose-500">{errors.targetAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Current Saved ({currency})
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-bold text-slate-400">{currency}</span>
                <input
                  id="goal-saved-amount-input"
                  type="number"
                  step="any"
                  placeholder="0"
                  value={savedAmount}
                  onChange={(e) => setSavedAmount(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 pl-8 pr-3 text-sm font-bold outline-hidden transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
                  }`}
                />
              </div>
              {errors.savedAmount && (
                <p className="mt-1 text-xs text-rose-500">{errors.savedAmount}</p>
              )}
            </div>
          </div>

          {/* Target Date & Optional Monthly Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Target Date *
              </label>
              <input
                id="goal-target-date-input"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full rounded-xl border py-2.5 px-3.5 text-sm font-medium outline-hidden transition-all ${
                  darkMode
                    ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                    : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
                }`}
              />
              {errors.targetDate && (
                <p className="mt-1 text-xs text-rose-500">{errors.targetDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Monthly Target ({currency})
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-bold text-slate-400">{currency}</span>
                <input
                  id="goal-monthly-target-input"
                  type="number"
                  step="any"
                  placeholder="Optional"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(e.target.value)}
                  className={`w-full rounded-xl border py-2.5 pl-8 pr-3 text-sm outline-hidden transition-all ${
                    darkMode
                      ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Visual Goal Cover / Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" />
              Goal Image / Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GOAL_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setCategory(preset.category as GoalCategory);
                  }}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    imageUrl === preset.url
                      ? 'border-[#F5B041] ring-2 ring-[#F5B041]/50 scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-full w-full object-cover"
                  />
                  {imageUrl === preset.url && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Image URL fallback */}
            <div className="mt-2.5">
              <input
                id="goal-image-url-input"
                type="url"
                placeholder="Or paste custom image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`w-full rounded-xl border py-2 px-3 text-xs outline-hidden transition-all ${
                  darkMode
                    ? 'border-white/10 bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                    : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
                }`}
              />
            </div>
          </div>

          {/* Action Buttons: Save Goal and Delete Goal */}
          <div className="pt-2 space-y-2.5">
            <button
              id="save-goal-btn"
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#344B5A] py-3.5 text-base font-bold text-white shadow-lg transition-transform hover:bg-[#283944] active:scale-[0.98]"
            >
              <span>{editingGoal ? 'Save Changes' : 'Create Goal'}</span>
            </button>

            {editingGoal && onDelete && (
              <button
                id="form-delete-goal-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(editingGoal);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete This Goal</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
