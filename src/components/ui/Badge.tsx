import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  primary: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  success: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  error: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-red-950/60 dark:text-red-300 dark:border-red-800',
  info: 'bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC] dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
  dark: 'bg-[#0F172A] text-white border-[#0F172A] dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[12px] font-medium whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

