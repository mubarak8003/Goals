import React from 'react';
import { Menu, ArrowLeft, Edit3, Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  onEditClick?: () => void;
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  isPortfolio?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onMenuClick,
  onEditClick,
  darkMode,
  onToggleDarkMode,
  isPortfolio = false,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full bg-[#344B5A] text-white shadow-md transition-colors duration-200"
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left Action: Back Arrow or Hamburger */}
        <div className="flex items-center">
          {showBack ? (
            <button
              id="header-back-btn"
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          ) : (
            <button
              id="header-menu-btn"
              type="button"
              onClick={onMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/10 active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Center Title */}
        <h1
          id="header-title"
          className="truncate px-2 text-lg font-bold tracking-wide text-white"
        >
          {title}
        </h1>

        {/* Right Action */}
        <div className="flex items-center space-x-1.5">
          {!isPortfolio && <PWAInstallButton variant="header" darkMode={darkMode} />}
          {isPortfolio && onEditClick ? (
            <button
              id="header-edit-goal-btn"
              type="button"
              onClick={onEditClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#F5B041] transition-all hover:bg-white/10 hover:text-amber-300 active:scale-95"
              aria-label="Edit goal"
              title="Edit Goal"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          ) : onToggleDarkMode ? (
            <button
              id="header-theme-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Toggle theme"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </header>
  );
};
