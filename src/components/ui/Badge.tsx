import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    'bg-[#e5dfd2] text-[#6e6a62] border-[#ded8ca] dark:bg-[#181E1B] dark:text-[#A3ACA6] dark:border-[#2A332E]',
  primary:
    'bg-[#e4ede7] text-[#1c5b48] border-[#c5d6cb] dark:bg-[#1B3028] dark:text-[#7CD4B5] dark:border-[#2A4D3E]',
  success:
    'bg-[#e4ede7] text-[#15463a] border-[#BBD6C8] dark:bg-[#1B3028] dark:text-[#7CD4B5] dark:border-[#2A4D3E]',
  warning:
    'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A] dark:bg-[#2E2514] dark:text-[#FBBF24] dark:border-[#4D3C1D]',
  error:
    'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA] dark:bg-[#2F1616] dark:text-[#FCA5A5] dark:border-[#4D2424]',
  info:
    'bg-[#E6F2F0] text-[#0F524C] border-[#BFE0DB] dark:bg-[#162C29] dark:text-[#6EE7B7] dark:border-[#234742]',
  dark:
    'bg-[#1C2420] text-white border-[#1C2420] dark:bg-[#efebe1] dark:text-[#141312] dark:border-[#efebe1]',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children, className = '' }) => {
  return (
    <span
      className={`font-mono-tech inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10.5px] uppercase tracking-[0.06em] font-semibold whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};
