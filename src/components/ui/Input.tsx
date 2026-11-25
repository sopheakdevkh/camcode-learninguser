import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftAddon, rightAddon, id, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const borderStyle = error
      ? 'border-[#DC2626] focus-within:border-[#DC2626] focus-within:ring-2 focus-within:ring-[#DC2626]/20'
      : 'border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[13px] font-medium text-[#0F172A] dark:text-slate-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center h-[42px] rounded-[8px] border bg-white dark:bg-slate-900 transition-colors ${borderStyle} ${
            props.disabled ? 'bg-[#F8FAFC] opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {leftAddon && (
            <span className="pl-3 text-[#64748B] flex items-center shrink-0">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent px-3 text-[14px] text-[#0F172A] dark:text-slate-100 placeholder:text-[#94A3B8] outline-none disabled:cursor-not-allowed ${className}`}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightAddon && (
            <span className="pr-3 text-[#64748B] flex items-center shrink-0">{rightAddon}</span>
          )}
        </div>
        {error && <p className="mt-1 text-[12px] text-[#DC2626]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[12px] text-[#64748B]">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

