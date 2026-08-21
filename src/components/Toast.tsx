import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      id="app-toast-notification"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#121212] border border-amber-500/40 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-black/80 flex items-center gap-3 animate-slideUp backdrop-blur-xl"
    >
      <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shrink-0 shadow-md shadow-amber-500/20">
        <CheckCircle className="w-4 h-4" />
      </div>
      <p className="text-xs font-semibold text-neutral-100 flex-1 leading-snug">
        {message}
      </p>
    </div>
  );
};
