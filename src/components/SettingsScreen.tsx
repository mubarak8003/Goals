import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Moon, Sun, RotateCcw, ShieldCheck, Sparkles, Bell, Info, Smartphone } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onResetData: () => void;
  darkMode?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  darkMode = false,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleDarkMode = () => {
    onUpdateSettings({
      ...settings,
      darkMode: !settings.darkMode,
    });
  };

  return (
    <div className={`p-4 sm:p-6 min-h-full space-y-6 ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
      <div className="mb-2">
        <h2 className={`font-heading text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>App Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize display, theme, and data management
        </p>
      </div>

      {/* Appearance Section */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-3 flex items-center gap-2">
          {darkMode ? <Moon className="h-4 w-4 text-[#F5B041]" /> : <Sun className="h-4 w-4 text-amber-500" />}
          Appearance
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/[0.08]">
          <div>
            <p className="text-sm font-semibold">Dark Theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between daylight and subtle dark blue-gray appearance
            </p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              darkMode ? 'bg-[#F5B041]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* App Installation Section */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-3 flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-[#F5B041]" />
          App Installation (PWA)
        </h3>
        <PWAInstallButton variant="settings" darkMode={darkMode} />
      </div>

      {/* Reset Section */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-2 flex items-center gap-2 text-rose-500">
          <RotateCcw className="h-4 w-4" />
          Reset Demo Data
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Reset all goals, savings records, and targets back to the initial reference state (including the Portfolio goal).
        </p>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800/40 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
        >
          Reset to Default Sample Data
        </button>
      </div>

      {/* About Section */}
      <div
        className={`rounded-3xl p-6 shadow-sm border ${
          darkMode ? 'border-white/[0.08] bg-[#22303A]' : 'border-slate-200/80 bg-white'
        }`}
      >
        <h3 className="font-heading text-base font-bold mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-[#344B5A] dark:text-[#F5B041]" />
          About Goal Vault
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Version 1.0.0 • Mobile-first Personal Finance & Goal Savings Tracker.
          Built with precision formulas for daily, weekly, and monthly required savings targets.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={onResetData}
        title="Reset All Data?"
        message="This will replace all your current goals and records with the default demo goals (including Portfolio ₹4,000 / ₹10,000). Are you sure you want to proceed?"
        darkMode={darkMode}
      />
    </div>
  );
};
