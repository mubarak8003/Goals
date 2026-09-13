import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator-banner"
      className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between rounded-xl bg-amber-500/95 px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-xl backdrop-blur-xs"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0 text-slate-950" />
        <span>Offline Mode — All data is safely saved and accessible locally.</span>
      </div>
      <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
    </div>
  );
};
