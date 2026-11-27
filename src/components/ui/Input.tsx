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
      ? 'border-[#a5331f] focus-within:border-[#a5331f] focus-within:ring-1 focus-within:ring-[#a5331f]'
      : 'border-[#ded8ca] hover:border-[#8D928D] focus-within:border-[#1c5b48] dark:border-[#2A332E] dark:hover:border-[#5C6B63] dark:focus-within:border-[#2D7A62]';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono-tech text-[10.5px] uppercase tracking-[0.09em] font-medium text-[#6e6a62] mb-1.5"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center h-[44px] rounded-xl border bg-[#efebe1] dark:bg-[#151A17] transition-colors ${borderStyle} ${
            props.disabled ? 'bg-[#e5dfd2] dark:bg-[#181E1B] opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {leftAddon && (
            <span className="pl-3.5 text-[#6e6a62] flex items-center shrink-0">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent px-3.5 text-[14px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62]/65 outline-none disabled:cursor-not-allowed ${className}`}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightAddon && (
            <span className="pr-3 text-[#6e6a62] flex items-center shrink-0">{rightAddon}</span>
          )}
        </div>
        {error && <p className="mt-1 text-[12px] text-[#a5331f]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[12px] text-[#6e6a62]">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
