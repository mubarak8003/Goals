import React, { useState, useEffect } from 'react';
import { Goal, SavingsRecord, UserSettings } from './types';
import { StorageService } from './services/storage';
import { formatCurrency } from './utils/calculations';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { GoalCard } from './components/GoalCard';
import { PortfolioScreen } from './components/PortfolioScreen';
import { AddSavingModal } from './components/AddSavingModal';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RecordsScreen } from './components/RecordsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import {
  Plus,
  Target,
  TrendingUp,
  Receipt,
  Search,
  Filter,
  Sparkles,
  Smartphone,
  Maximize2,
} from 'lucide-react';

export function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [records, setRecords] = useState<SavingsRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());

  // Navigation and active view state
  const [activeScreen, setActiveScreen] = useState<
    'dashboard' | 'goals' | 'records' | 'profile' | 'settings' | 'portfolio'
  >('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>('goal-portfolio-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals state
  const [isAddSavingOpen, setIsAddSavingOpen] = useState(false);
  const [savingTargetGoal, setSavingTargetGoal] = useState<Goal | null>(null);
  const [editingRecord, setEditingRecord] = useState<SavingsRecord | null>(null);

  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'goal' | 'record';
    targetId: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'goal',
    targetId: '',
    title: '',
    message: '',
  });

  // Filters for All Goals screen
  const [goalsFilter, setGoalsFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [goalsSearch, setGoalsSearch] = useState('');

  // Notification Toast state
  const [notification, setNotification] = useState<string | null>(null);

  // Mobile frame container vs full width for responsive design
  const [isMobileFrameView, setIsMobileFrameView] = useState(false);

  // Reload state from storage
  const loadData = () => {
    const loadedGoals = StorageService.getGoals();
    const loadedRecords = StorageService.getRecords();
    setGoals(loadedGoals);
    setRecords(loadedRecords);

    // If selectedGoalId is set, verify it exists
    if (selectedGoalId && !loadedGoals.find((g) => g.id === selectedGoalId)) {
      setSelectedGoalId(loadedGoals.length > 0 ? loadedGoals[0].id : null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // Calculations for drawer and stats
  const totalSavedAllGoals = goals.reduce((acc, g) => acc + g.savedAmount, 0);
  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || goals[0] || null;
  const selectedGoalRecords = selectedGoal
    ? records.filter((r) => r.goalId === selectedGoal.id)
    : [];

  // Goal CRUD handlers
  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (editingGoal) {
      const updated: Goal = {
        ...editingGoal,
        ...goalData,
      } as Goal;
      StorageService.updateGoal(updated);
      showToast(`Goal "${updated.name}" updated!`);
    } else {
      const newGoal = StorageService.addGoal(goalData as any);
      setSelectedGoalId(newGoal.id);
      showToast(`Goal "${newGoal.name}" created!`);
    }
    loadData();
  };

  const handlePromptDeleteGoal = (goal: Goal) => {
    setDeleteModalState({
      isOpen: true,
      type: 'goal',
      targetId: goal.id,
      title: `Delete "${goal.name}"?`,
      message: `Are you sure you want to delete this goal and its associated records (${formatCurrency(goal.savedAmount, settings.currency, false)} saved)? This action cannot be undone.`,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'goal') {
      StorageService.deleteGoal(deleteModalState.targetId);
      showToast('Goal deleted');
      if (selectedGoalId === deleteModalState.targetId) {
        setActiveScreen('dashboard');
        setSelectedGoalId(null);
      }
    } else if (deleteModalState.type === 'record') {
      StorageService.deleteRecord(deleteModalState.targetId);
      showToast('Record deleted');
    }
    loadData();
  };

  // Savings record handlers
  const handleSaveDeposit = (amount: number, date: string, note?: string) => {
    if (!savingTargetGoal) return;

    if (editingRecord) {
      StorageService.updateRecord(editingRecord.id, amount, date, note);
      showToast(`Record updated: ${formatCurrency(amount, settings.currency, true)}`);
    } else {
      StorageService.addRecord(savingTargetGoal.id, amount, date, note);
      showToast(`Added ${formatCurrency(amount, settings.currency, true)} to ${savingTargetGoal.name}!`);
    }
    loadData();
  };

  const handleOpenAddSaving = (goal: Goal, recordToEdit?: SavingsRecord) => {
    setSavingTargetGoal(goal);
    setEditingRecord(recordToEdit || null);
    setIsAddSavingOpen(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalFormOpen(true);
  };

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setIsGoalFormOpen(true);
  };

  const handleSelectGoalForPortfolio = (goalId: string) => {
    setSelectedGoalId(goalId);
    setActiveScreen('portfolio');
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleResetData = () => {
    StorageService.resetToDefault();
    loadData();
    setSelectedGoalId('goal-portfolio-1');
    setActiveScreen('dashboard');
    showToast('Reset to default sample data successfully!');
  };

  const filteredGoals = goals.filter((g) => {
    const isCompleted = g.savedAmount >= g.targetAmount;
    if (goalsFilter === 'active' && isCompleted) return false;
    if (goalsFilter === 'completed' && !isCompleted) return false;
    if (goalsSearch && !g.name.toLowerCase().includes(goalsSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 ${
        settings.darkMode ? 'bg-[#141C22] text-slate-200' : 'bg-slate-800 text-slate-900'
      } flex items-center justify-center`}
    >
      {/* Container Wrapper (Responsive Mobile First View) */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrameView
            ? 'max-w-[430px] my-4 h-[92vh] max-h-[920px] rounded-[42px] overflow-hidden border-[10px] border-[#24333D] shadow-2xl relative flex flex-col'
            : 'max-w-md md:max-w-xl lg:max-w-2xl min-h-screen flex flex-col shadow-2xl relative'
        } ${settings.darkMode ? 'bg-[#18232A]' : 'bg-[#EBF0F4]'}`}
      >
        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-[#344B5A] px-5 py-3 text-xs font-bold text-white shadow-2xl border border-white/20 animate-bounce">
            <Sparkles className="h-4 w-4 text-[#F5B041]" />
            <span>{notification}</span>
          </div>
        )}

        {/* View Switcher toggle (on desktop screens) */}
        <div className="hidden lg:flex absolute -right-16 top-4 z-40 flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#344B5A] text-[#F5B041] shadow-lg hover:bg-[#283845] transition-all"
            title={isMobileFrameView ? 'Expand to wide view' : 'Fit to phone viewport frame'}
          >
            {isMobileFrameView ? <Maximize2 className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
          </button>
        </div>

        {/* 1. APP HEADER */}
        {activeScreen === 'portfolio' && selectedGoal ? (
          <PortfolioScreen
            goal={selectedGoal}
            currency={settings.currency}
            onBack={() => setActiveScreen('dashboard')}
            onEditGoal={(g) => handleOpenEditGoal(g)}
            onDeleteGoal={(g) => handlePromptDeleteGoal(g)}
            onOpenAddSaving={(g) => handleOpenAddSaving(g)}
            onOpenEditRecord={(r) => handleOpenAddSaving(selectedGoal, r)}
            onOpenDeleteRecord={(r) => {
              setDeleteModalState({
                isOpen: true,
                type: 'record',
                targetId: r.id,
                title: 'Delete Savings Record?',
                message: `Are you sure you want to delete this deposit of ${formatCurrency(r.amount, settings.currency, true)}? The goal's saved amount will be recalculated automatically.`,
              });
            }}
            records={selectedGoalRecords}
            darkMode={settings.darkMode}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-screen">
            <Header
              title={
                activeScreen === 'dashboard'
                  ? 'Dashboard'
                  : activeScreen === 'goals'
                  ? 'Goals'
                  : activeScreen === 'records'
                  ? 'Records'
                  : activeScreen === 'profile'
                  ? 'Profile'
                  : 'Settings'
              }
              showBack={activeScreen !== 'dashboard'}
              onBack={() => setActiveScreen('dashboard')}
              onMenuClick={() => setIsDrawerOpen(true)}
              darkMode={settings.darkMode}
              onToggleDarkMode={() =>
                handleUpdateSettings({ ...settings, darkMode: !settings.darkMode })
              }
            />

            {/* SCREEN CONTENTS */}
            {activeScreen === 'dashboard' && (
              <main id="dashboard-content" className="flex-1 px-1 py-3 overflow-y-auto pb-36">
                {/* Summary Banner */}
                <div
                  className={`mb-3 rounded-3xl p-5 shadow-sm border ${
                    settings.darkMode
                      ? 'border-white/[0.08] bg-gradient-to-tr from-[#22303A] to-[#2A3B46] text-slate-200'
                      : 'border-slate-200/80 bg-gradient-to-tr from-[#344B5A] to-[#2C414F] text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wide text-white/70">
                        Total Accumulated Savings
                      </span>
                      <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {formatCurrency(totalSavedAllGoals, settings.currency, false)}
                      </h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F5B041] shadow-inner">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/80">
                    <span>{goals.length} Active Targets</span>
                    <button
                      type="button"
                      onClick={() => setActiveScreen('records')}
                      className="font-bold text-[#F5B041] hover:underline"
                    >
                      View All Records →
                    </button>
                  </div>
                </div>

                {/* Goals Section Header */}
                <div className="mb-2 px-1 flex items-center justify-between">
                  <h2 className={`font-heading text-lg font-bold flex items-center gap-2 ${settings.darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    <Target className="h-5 w-5 text-[#F5B041]" />
                    Goals
                  </h2>
                  <span className="rounded-full bg-slate-200/80 dark:bg-white/10 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {goals.length}
                  </span>
                </div>

                {/* Goals Cards List */}
                {goals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-10 text-center bg-white/40 dark:bg-white/5">
                    <Target className="h-12 w-12 text-slate-400 mb-3" />
                    <h3 className={`font-heading text-base font-bold ${settings.darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      No Goals Yet
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Start by creating your first savings target, such as a Portfolio, Emergency Fund, or Dream Vacation.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenCreateGoal}
                      className="mt-5 rounded-2xl bg-[#344B5A] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#273844]"
                    >
                      + Create Goal
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 pb-6">
                    {goals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        currency={settings.currency}
                        onClick={() => handleSelectGoalForPortfolio(goal.id)}
                        onQuickAdd={(e) => {
                          e.stopPropagation();
                          handleOpenAddSaving(goal);
                        }}
                        darkMode={settings.darkMode}
                      />
                    ))}
                  </div>
                )}
              </main>
            )}

            {activeScreen === 'goals' && (
              <main className="flex-1 px-1 py-3 overflow-y-auto pb-36">
                {/* Search & Filter */}
                <div className="mb-3 space-y-2 px-0.5">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={goalsSearch}
                      onChange={(e) => setGoalsSearch(e.target.value)}
                      className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-xs outline-hidden transition-all ${
                        settings.darkMode
                          ? 'border-white/[0.08] bg-[#1A252D] text-slate-200 placeholder-slate-500 focus:border-[#F5B041]'
                          : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-[#344B5A]'
                      }`}
                    />
                  </div>

                  {/* Filter tabs */}
                  <div className="flex gap-2">
                    {(['all', 'active', 'completed'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setGoalsFilter(filter)}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition-all border ${
                          goalsFilter === filter
                            ? 'border-[#344B5A] bg-[#344B5A] text-[#F5B041] dark:border-[#F5B041] dark:bg-[#F5B041] dark:text-[#24333D]'
                            : 'border-slate-200 dark:border-white/[0.08] bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredGoals.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center bg-white/40 dark:bg-white/5">
                    <p className="text-xs text-slate-500">No matching goals found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 pb-6">
                    {filteredGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        currency={settings.currency}
                        onClick={() => handleSelectGoalForPortfolio(goal.id)}
                        onQuickAdd={(e) => {
                          e.stopPropagation();
                          handleOpenAddSaving(goal);
                        }}
                        darkMode={settings.darkMode}
                      />
                    ))}
                  </div>
                )}
              </main>
            )}

            {activeScreen === 'records' && (
              <main className="flex-1 overflow-y-auto pb-24">
                <RecordsScreen
                  records={records}
                  goals={goals}
                  currency={settings.currency}
                  onOpenEditRecord={(rec) => {
                    const parentGoal = goals.find((g) => g.id === rec.goalId);
                    if (parentGoal) handleOpenAddSaving(parentGoal, rec);
                  }}
                  onOpenDeleteRecord={(rec) => {
                    setDeleteModalState({
                      isOpen: true,
                      type: 'record',
                      targetId: rec.id,
                      title: 'Delete Savings Record?',
                      message: `Are you sure you want to delete this deposit record?`,
                    });
                  }}
                  onSelectGoal={(goalId) => handleSelectGoalForPortfolio(goalId)}
                  darkMode={settings.darkMode}
                />
              </main>
            )}

            {activeScreen === 'profile' && (
              <main className="flex-1 overflow-y-auto pb-24">
                <ProfileScreen
                  goals={goals}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetData={handleResetData}
                  onRefreshData={loadData}
                  darkMode={settings.darkMode}
                />
              </main>
            )}

            {activeScreen === 'settings' && (
              <main className="flex-1 overflow-y-auto pb-24">
                <SettingsScreen
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onResetData={handleResetData}
                  darkMode={settings.darkMode}
                />
              </main>
            )}

            {/* FLOATING ACTION BUTTON (+ button at bottom-right for creating a goal) */}
            {activeScreen === 'dashboard' && (
              <button
                id="floating-add-goal-btn"
                type="button"
                onClick={handleOpenCreateGoal}
                className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#344B5A] to-[#F5B041] text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Create new savings goal"
                title="Create new savings goal"
              >
                <Plus className="h-7 w-7 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}

        {/* NAVIGATION DRAWER */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeScreen={activeScreen === 'portfolio' ? 'goals' : activeScreen}
          onNavigate={(screen) => setActiveScreen(screen)}
          totalSaved={totalSavedAllGoals}
          totalGoals={goals.length}
          currency={settings.currency}
          userName={settings.name}
        />

        {/* MODALS */}
        {isAddSavingOpen && savingTargetGoal && (
          <AddSavingModal
            isOpen={isAddSavingOpen}
            onClose={() => {
              setIsAddSavingOpen(false);
              setEditingRecord(null);
            }}
            goal={savingTargetGoal}
            currency={settings.currency}
            onSave={handleSaveDeposit}
            editingRecord={editingRecord}
            darkMode={settings.darkMode}
          />
        )}

        {isGoalFormOpen && (
          <GoalFormModal
            isOpen={isGoalFormOpen}
            onClose={() => {
              setIsGoalFormOpen(false);
              setEditingGoal(null);
            }}
            onSave={handleSaveGoal}
            onDelete={(g) => handlePromptDeleteGoal(g)}
            editingGoal={editingGoal}
            currency={settings.currency}
            darkMode={settings.darkMode}
          />
        )}

        {deleteModalState.isOpen && (
          <DeleteConfirmModal
            isOpen={deleteModalState.isOpen}
            onClose={() =>
              setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
            }
            onConfirm={handleConfirmDelete}
            title={deleteModalState.title}
            message={deleteModalState.message}
            darkMode={settings.darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;
