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
    wrap: 'bg-[#E6F2F0] border-[#BFE0DB] text-[#0F524C] dark:bg-[#162C29] dark:border-[#234742] dark:text-[#6EE7B7]',
    icon: <Info className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />,
  },
  success: {
    wrap: 'bg-[#e4ede7] border-[#BBD6C8] text-[#15463a] dark:bg-[#1B3028] dark:border-[#2A4D3E] dark:text-[#7CD4B5]',
    icon: <CheckCircle2 className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />,
  },
  warning: {
    wrap: 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] dark:bg-[#2E2514] dark:border-[#4D3C1D] dark:text-[#FBBF24]',
    icon: <AlertTriangle className="h-5 w-5 text-[#8a5008] dark:text-[#FBBF24] shrink-0" />,
  },
  error: {
    wrap: 'bg-[#FEE2E2] border-[#FECACA] text-[#991B1B] dark:bg-[#2F1616] dark:border-[#4D2424] dark:text-[#FCA5A5]',
    icon: <AlertCircle className="h-5 w-5 text-[#a5331f] dark:text-[#FCA5A5] shrink-0" />,
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
