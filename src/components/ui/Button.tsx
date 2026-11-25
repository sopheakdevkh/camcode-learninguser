import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2563EB] text-white border border-transparent hover:bg-[#1D4ED8] active:bg-[#1E40AF] focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2',
  secondary:
    'bg-[#0F172A] text-white border border-transparent hover:bg-[#1E293B] focus-visible:ring-2 focus-visible:ring-[#0F172A]/40 focus-visible:ring-offset-2 dark:bg-[#1E293B] dark:hover:bg-[#334155]',
  outline:
    'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-[#2563EB] border border-transparent hover:bg-[#EFF6FF] dark:hover:bg-blue-950/40',
  danger:
    'bg-[#DC2626] text-white border border-transparent hover:bg-[#B91C1C]',
  success:
    'bg-[#16A34A] text-white border border-transparent hover:bg-[#15803D]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-10 px-4.5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  fullWidth = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const effectiveVariant: ButtonVariant = success ? 'success' : variant;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-colors duration-150 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[effectiveVariant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : success ? (
        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && !success && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};

