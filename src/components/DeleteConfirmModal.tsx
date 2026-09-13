import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  darkMode?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  darkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="delete-confirm-modal"
        className={`relative z-10 w-full max-w-sm rounded-3xl p-6 shadow-2xl transition-all ${
          darkMode ? 'bg-[#24333D] text-white' : 'bg-white text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 text-rose-500 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-lg font-bold">{title}</h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
