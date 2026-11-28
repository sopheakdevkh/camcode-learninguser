import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  message: string;
  title?: string;
  tone?: ToastTone;
  durationMs?: number;
}

interface ToastRecord extends Required<Pick<ToastOptions, 'message' | 'tone' | 'durationMs'>> {
  id: string;
  title?: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneConfig: Record<
  ToastTone,
  {
    border: string;
    iconBg: string;
    bar: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    border: 'border-[#BBD6C8] dark:border-[#2A4D3E]',
    iconBg: 'bg-[#e4ede7] text-[#1c5b48] dark:bg-[#1B3028] dark:text-[#7CD4B5]',
    bar: 'bg-[#1c5b48] dark:bg-[#7CD4B5]',
    icon: <CheckCircle2 className="h-4.5 w-4.5" />,
  },
  error: {
    border: 'border-[#FECACA] dark:border-[#4D2424]',
    iconBg: 'bg-[#FEE2E2] text-[#a5331f] dark:bg-[#2F1616] dark:text-[#FCA5A5]',
    bar: 'bg-[#a5331f] dark:bg-[#FCA5A5]',
    icon: <AlertCircle className="h-4.5 w-4.5" />,
  },
  warning: {
    border: 'border-[#FDE68A] dark:border-[#4D3C1D]',
    iconBg: 'bg-[#FEF3C7] text-[#8a5008] dark:bg-[#2E2514] dark:text-[#FBBF24]',
    bar: 'bg-[#8a5008] dark:bg-[#FBBF24]',
    icon: <AlertTriangle className="h-4.5 w-4.5" />,
  },
  info: {
    border: 'border-[#BFE0DB] dark:border-[#234742]',
    iconBg: 'bg-[#E6F2F0] text-[#0f766e] dark:bg-[#162C29] dark:text-[#6EE7B7]',
    bar: 'bg-[#0f766e] dark:bg-[#6EE7B7]',
    icon: <Info className="h-4.5 w-4.5" />,
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, title, tone = 'info', durationMs = 3600 }: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, title, tone, durationMs }]);
      timersRef.current[id] = window.setTimeout(() => {
        dismiss(id);
      }, durationMs);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      toast: {
        success: (message, title) => showToast({ message, title, tone: 'success' }),
        error: (message, title) => showToast({ message, title, tone: 'error' }),
        info: (message, title) => showToast({ message, title, tone: 'info' }),
        warning: (message, title) => showToast({ message, title, tone: 'warning' }),
      },
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Bottom-Right Toast Stack */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="no-print fixed bottom-20 lg:bottom-5 right-4 sm:right-5 z-[70] flex flex-col gap-2.5 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((item) => {
          const cfg = toneConfig[item.tone];
          return (
            <div
              key={item.id}
              role="status"
              style={{ animation: 'toast-enter 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
              className={`pointer-events-auto relative overflow-hidden rounded-[12px] border bg-[#f6f3ec] dark:bg-[#151A17] ${cfg.border} shadow-[0_18px_40px_-14px_rgba(20,19,18,0.22)]`}
            >
              <div className="flex items-start gap-3 p-3.5 pr-3">
                <span
                  className={`h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0 ${cfg.iconBg}`}
                >
                  {cfg.icon}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  {item.title && (
                    <p className="text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec] leading-snug">
                      {item.title}
                    </p>
                  )}
                  <p className="text-[13px] text-[#4c4842] dark:text-[#D5D1C8] leading-snug">
                    {item.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-lg text-[#6e6a62] hover:text-[#141312] dark:hover:text-[#f6f3ec] hover:bg-[#e5dfd2]/60 dark:hover:bg-[#181E1B] cursor-pointer transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Timeline countdown bar */}
              <div className="h-[3px] w-full bg-[#e5dfd2]/80 dark:bg-[#2A332E]">
                <div
                  className={`h-full w-full origin-left ${cfg.bar}`}
                  style={{ animation: `toast-timeline ${item.durationMs}ms linear forwards` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

