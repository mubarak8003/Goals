import React from 'react';
import {
  LayoutDashboard,
  Target,
  Receipt,
  User,
  Settings,
  X,
  PiggyBank,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: 'dashboard' | 'goals' | 'records' | 'profile' | 'settings';
  onNavigate: (screen: 'dashboard' | 'goals' | 'records' | 'profile' | 'settings') => void;
  totalSaved: number;
  totalGoals: number;
  currency: string;
  userName: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen,
  onNavigate,
  totalSaved,
  totalGoals,
  currency,
  userName,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', label: 'All Goals', icon: Target },
    { id: 'records', label: 'Records & History', icon: Receipt },
    { id: 'profile', label: 'Profile & Balance', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div
        id="navigation-drawer"
        className="relative z-10 flex h-full w-[82%] max-w-[320px] flex-col bg-[#24333D] text-white shadow-2xl transition-transform duration-300 ease-out"
      >
        {/* Drawer Header */}
        <div className="border-b border-white/10 bg-[#1E2B34] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#344B5A] to-[#F5B041] shadow-md">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">Goal Vault</h2>
                <p className="text-xs text-white/70">Savings & Target Tracker</p>
              </div>
            </div>
            <button
              id="drawer-close-btn"
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Balance Preview Card */}
          <div className="mt-4 rounded-xl bg-white/5 p-3.5 border border-white/10">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Total Saved Balance</span>
              <span className="flex items-center text-[#F5B041]">
                <TrendingUp className="mr-1 h-3 w-3" />
                {totalGoals} {totalGoals === 1 ? 'Goal' : 'Goals'}
              </span>
            </div>
            <div className="mt-1 font-heading text-xl font-bold tracking-tight text-white">
              {formatCurrency(totalSaved, currency, false)}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                id={`drawer-nav-${item.id}`}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#344B5A] text-[#F5B041] shadow-sm'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#F5B041]' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-[#F5B041]" />}
              </button>
            );
          })}
        </nav>

        {/* Install App Button */}
        <div className="px-3 pb-3">
          <PWAInstallButton variant="drawer" />
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#344B5A] text-sm font-bold text-[#F5B041]">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-white">{userName || 'Personal Account'}</p>
              <p className="text-xs text-emerald-400 flex items-center">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Offline Persistent Storage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
