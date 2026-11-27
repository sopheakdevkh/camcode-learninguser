import React from 'react';

interface ProgressBarProps {
  value: number; // 0..100
  tone?: 'primary' | 'success' | 'warning';
  heightClass?: string;
  className?: string;
}

const barColors = {
  primary: 'bg-[#1c5b48] dark:bg-[#2D7A62]',
  success: 'bg-[#15463a] dark:bg-[#7CD4B5]',
  warning: 'bg-[#8a5008] dark:bg-[#F59E0B]',
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
      className={`w-full ${heightClass} rounded-full bg-[#e5dfd2] dark:bg-[#1E2622] overflow-hidden ${className}`}
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
