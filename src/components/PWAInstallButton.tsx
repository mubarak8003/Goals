import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, CheckCircle2, X, Smartphone, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'drawer' | 'banner' | 'settings';
  darkMode?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'drawer',
  darkMode = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // If already installed as a standalone app, hide or show installed badge
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 py-1">
          <CheckCircle2 className="h-4 w-4" />
          <span>App is installed and running in standalone mode</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // Header compact pill/button
  if (variant === 'header') {
    return (
      <>
        <button
          id="header-install-pwa-btn"
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 rounded-full bg-[#F5B041] px-2.5 py-1 text-xs font-bold text-slate-900 shadow-xs hover:bg-amber-400 active:scale-95 transition-all"
          title="Install App"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showGuideModal && (
          <InstallInstructionsModal
            isOpen={showGuideModal}
            onClose={() => setShowGuideModal(false)}
            isIOS={isIOS}
            darkMode={darkMode}
          />
        )}
      </>
    );
  }

  // Navigation Drawer item
  if (variant === 'drawer') {
    return (
      <>
        <button
          id="drawer-install-pwa-btn"
          type="button"
          onClick={handleInstallClick}
          className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#F5B041] to-amber-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-300 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-slate-950" />
            <span>Install App on Phone</span>
          </div>
          <span className="rounded-md bg-slate-950/15 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider">
            PWA
          </span>
        </button>

        {showGuideModal && (
          <InstallInstructionsModal
            isOpen={showGuideModal}
            onClose={() => setShowGuideModal(false)}
            isIOS={isIOS}
            darkMode={darkMode}
          />
        )}
      </>
    );
  }

  // Settings screen button
  if (variant === 'settings') {
    return (
      <>
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/[0.08]">
          <div>
            <p className="text-sm font-semibold">Install on Home Screen</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Install Goal Vault for quick access and full offline support
            </p>
          </div>
          <button
            id="settings-install-pwa-btn"
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 rounded-xl bg-[#F5B041] px-3.5 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-amber-400 transition-all"
          >
            <Download className="h-4 w-4" />
            Install
          </button>
        </div>

        {showGuideModal && (
          <InstallInstructionsModal
            isOpen={showGuideModal}
            onClose={() => setShowGuideModal(false)}
            isIOS={isIOS}
            darkMode={darkMode}
          />
        )}
      </>
    );
  }

  // Dashboard top banner
  if (variant === 'banner') {
    if (bannerDismissed) return null;

    return (
      <>
        <div
          id="dashboard-pwa-banner"
          className={`mb-3 rounded-2xl p-3.5 border flex items-center justify-between gap-3 shadow-xs transition-all ${
            darkMode
              ? 'bg-[#1D2B34] border-[#F5B041]/30 text-slate-200'
              : 'bg-amber-50/90 border-amber-200 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5B041] text-slate-950 font-bold shadow-xs">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Install Goal Vault App</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                One-tap home screen access & offline tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="banner-install-btn"
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1 rounded-lg bg-[#F5B041] px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </button>
            <button
              id="banner-dismiss-btn"
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showGuideModal && (
          <InstallInstructionsModal
            isOpen={showGuideModal}
            onClose={() => setShowGuideModal(false)}
            isIOS={isIOS}
            darkMode={darkMode}
          />
        )}
      </>
    );
  }

  return null;
};

interface InstallInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  darkMode: boolean;
}

const InstallInstructionsModal: React.FC<InstallInstructionsModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  darkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
          darkMode
            ? 'bg-[#1E2B34] border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F5B041] text-slate-900">
              <Download className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-base font-bold">Install Goal Vault</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {isIOS ? (
            <>
              <p className="text-slate-600 dark:text-slate-300">
                To install this web app on your <strong>iPhone or iPad</strong>:
              </p>
              <div className="space-y-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 p-4 border border-slate-200/60 dark:border-white/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B041]/20 font-bold text-[#F5B041]">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Tap the <Share className="inline h-3.5 w-3.5 mx-1 text-sky-500" /> <strong>Share</strong> button
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Located at the bottom menu in Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B041]/20 font-bold text-[#F5B041]">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Select <PlusSquare className="inline h-3.5 w-3.5 mx-1 text-[#F5B041]" /> <strong>Add to Home Screen</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Scroll down the options list until you see Add to Home Screen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B041]/20 font-bold text-[#F5B041]">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Tap <strong>Add</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Goal Vault icon will appear right on your home screen!
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-300">
                To install Goal Vault on your <strong>Android phone or browser</strong>:
              </p>
              <div className="space-y-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 p-4 border border-slate-200/60 dark:border-white/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B041]/20 font-bold text-[#F5B041]">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Tap the <strong>three dots (⋮)</strong> menu
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Located in the top or bottom right corner of Chrome/browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5B041]/20 font-bold text-[#F5B041]">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Confirm installation to place the app on your mobile launcher.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="rounded-xl bg-emerald-500/10 p-3 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Installed apps launch instantly in full screen without browser toolbars.</span>
          </div>

          <button
            id="install-modal-close-btn"
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#344B5A] py-2.5 text-xs font-bold text-white hover:bg-[#2C414F] active:scale-95 transition-all shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
