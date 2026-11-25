import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertTone, { wrap: string; icon: React.ReactNode }> = {
  info: {
    wrap: 'bg-[#ECFEFF] border-[#A5F3FC] text-[#0E7490] dark:bg-cyan-950/40 dark:border-cyan-800 dark:text-cyan-200',
    icon: <Info className="h-5 w-5 text-[#0891B2] shrink-0" />,
  },
  success: {
    wrap: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200',
    icon: <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />,
  },
  warning: {
    wrap: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200',
    icon: <AlertTriangle className="h-5 w-5 text-[#D97706] shrink-0" />,
  },
  error: {
    wrap: 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] dark:bg-red-950/40 dark:border-red-800 dark:text-red-200',
    icon: <AlertCircle className="h-5 w-5 text-[#DC2626] shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({ tone = 'info', title, children, className = '' }) => {
  const s = styles[tone];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-[12px] border ${s.wrap} ${className}`}
    >
      {s.icon}
      <div className="text-[14px] leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};

