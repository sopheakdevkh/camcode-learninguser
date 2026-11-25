import React from 'react';

interface ProgressBarProps {
  value: number; // 0..100
  tone?: 'primary' | 'success' | 'warning';
  heightClass?: string;
  className?: string;
}

const barColors = {
  primary: 'bg-[#2563EB]',
  success: 'bg-[#16A34A]',
  warning: 'bg-[#D97706]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  tone = 'primary',
  heightClass = 'h-2',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const resolvedTone = clamped >= 100 ? 'success' : tone;

  return (
    <div
      className={`w-full ${heightClass} rounded-full bg-[#E2E8F0] dark:bg-slate-800 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColors[resolvedTone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

