import React, { useRef, useState } from 'react';
import { Goal, UserSettings } from '../types';
import { formatCurrency } from '../utils/calculations';
import { StorageService } from '../services/storage';
import {
  User,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
  Download,
  Upload,
  Check,
} from 'lucide-react';

interface ProfileScreenProps {
  goals: Goal[];
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onResetData: () => void;
  onRefreshData: () => void;
  darkMode?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  goals,
  settings,
  onUpdateSettings,
  onResetData,
  onRefreshData,
  darkMode = false,
}) => {
  const [name, setName] = useState(settings.name);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSaved = goals.reduce((acc, g) => acc + g.savedAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length;

  const currencies = [
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: '¥', label: 'JPY (¥)' },
    { symbol: 'AED', label: 'AED' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...settings, name };
    onUpdateSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    const updated = { ...settings, currency: newCurrency };
    onUpdateSettings(updated);
  };

  const handleExport = () => {
    const dataStr = StorageService.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goals_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importBackup(content);
        if (success) {
          onRefreshData();
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file format. Import failed.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`p-4 sm:p-6 min-h-full space-y-6 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
      <div className="mb-2">
        <h2 className={`font-heading text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Profile & Overview</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your identity, currency symbol, and data backups
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-2xl p-4 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Saved
          </span>
          <p className={`font-heading text-base font-extrabold mt-1 truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {formatCurrency(totalSaved, settings.currency, false)}
          </p>
        </div>

        <div className={`rounded-2xl p-4 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Target
          </span>
          <p className={`font-heading text-base font-extrabold mt-1 truncate ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {formatCurrency(totalTarget, settings.currency, false)}
          </p>
        </div>

        <div className={`rounded-2xl p-4 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Completed
          </span>
          <p className="font-heading text-base font-extrabold mt-1 text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            {completedGoals}/{goals.length}
          </p>
        </div>
      </div>

      {/* Profile Name Form */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-[#344B5A] dark:text-[#F5B041]" />
          Personal Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Your Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-xl border py-2.5 px-3.5 text-sm font-semibold outline-hidden transition-all ${
                darkMode
                  ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 focus:border-[#F5B041]'
                  : 'border-slate-200 bg-white text-slate-900 focus:border-[#344B5A]'
              }`}
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#344B5A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#283944] active:scale-95 transition-transform shadow-md"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Name</span>
            )}
          </button>
        </form>
      </div>

      {/* Preferred Currency Section */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-3 flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-[#344B5A] dark:text-[#F5B041]" />
          Preferred Currency Symbol
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Choose which currency sign to show before your savings and target figures.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {currencies.map((cur) => (
            <button
              key={cur.symbol}
              type="button"
              onClick={() => handleCurrencyChange(cur.symbol)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                settings.currency === cur.symbol
                  ? 'border-[#F5B041] bg-amber-500/10 text-[#F5B041] font-bold ring-1 ring-[#F5B041]'
                  : 'border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="text-lg font-bold">{cur.symbol}</span>
              <span className="text-[10px] mt-0.5">{cur.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Backup & Portability */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-2 flex items-center gap-2">
          <Download className="h-4 w-4 text-[#344B5A] dark:text-[#F5B041]" />
          Data Backup & Portability
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Download a complete JSON backup of your goals and savings transactions, or restore from a previous file.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl bg-[#344B5A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#283944] active:scale-95 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export Backup (JSON)
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <Upload className="h-4 w-4" />
            Restore From File
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
