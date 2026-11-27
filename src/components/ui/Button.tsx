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
    'bg-[#1c5b48] text-white border border-[#1c5b48] hover:bg-[#15463a] hover:border-[#15463a] active:bg-[#0F2E24] dark:bg-[#2D7A62] dark:border-[#2D7A62] dark:hover:bg-[#23634F] focus-visible:ring-2 focus-visible:ring-[#1c5b48]/40 focus-visible:ring-offset-2',
  secondary:
    'bg-[#e5dfd2] text-[#141312] border border-[#ded8ca] hover:border-[#1c5b48] hover:bg-[#E2DDD1] dark:bg-[#181E1B] dark:text-[#f6f3ec] dark:border-[#2A332E] dark:hover:border-[#2D7A62] focus-visible:ring-2 focus-visible:ring-[#1c5b48]/30',
  outline:
    'bg-[#efebe1] text-[#141312] border border-[#ded8ca] hover:border-[#1c5b48] hover:bg-[#e5dfd2]/55 dark:bg-[#151A17] dark:text-[#f6f3ec] dark:border-[#2A332E] dark:hover:border-[#2D7A62] focus-visible:ring-2 focus-visible:ring-[#1c5b48]/30',
  ghost:
    'bg-transparent text-[#1c5b48] dark:text-[#7CD4B5] border border-transparent hover:bg-[#e5dfd2]/70 dark:hover:bg-[#181E1B] focus-visible:ring-2 focus-visible:ring-[#1c5b48]/25',
  danger:
    'bg-[#a5331f] text-white border border-[#a5331f] hover:bg-[#991B1B] active:bg-[#7F1D1D] focus-visible:ring-2 focus-visible:ring-[#a5331f]/40 focus-visible:ring-offset-2',
  success:
    'bg-[#1c5b48] text-white border border-[#1c5b48] hover:bg-[#15463a] active:bg-[#0F2E24] focus-visible:ring-2 focus-visible:ring-[#1c5b48]/40 focus-visible:ring-offset-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-10 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[14.5px]',
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
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[effectiveVariant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
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
