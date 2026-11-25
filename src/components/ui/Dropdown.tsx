import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: DropdownSize;
  align?: 'start' | 'end';
  className?: string;
  buttonClassName?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<DropdownSize, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-10 px-3.5 text-[14px]',
  lg: 'h-[44px] px-3.5 text-[14.5px]',
};

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  size = 'md',
  align = 'start',
  className = '',
  buttonClassName = '',
  id,
  name,
  'aria-label': ariaLabel,
}: DropdownProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = options.find((option) => option.value === value);
  const getEnabledIndexes = () =>
    options.reduce<number[]>((acc, option, index) => {
      if (!option.disabled) acc.push(index);
      return acc;
    }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const enabledIndexes = getEnabledIndexes();
    const selectedIndex = options.findIndex((option) => option.value === value && !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndexes[0] ?? -1);
  }, [open, value, options]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const moveActive = (direction: 1 | -1) => {
    const enabledIndexes = getEnabledIndexes();
    if (enabledIndexes.length === 0) return;
    const currentPos = enabledIndexes.indexOf(activeIndex);
    const nextPos =
      currentPos === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPos + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPos]);
  };

  const commit = (next: T) => {
    onChange?.(next);
    setOpen(false);
  };

  const borderStyle = error
    ? 'border-[#DC2626] focus-visible:border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/20'
    : open
      ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
      : 'border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20';

  return (
    <div
      ref={rootRef}
      className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'} relative ${className}`}
    >
      {label && (
        <label htmlFor={triggerId} className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
          {label}
        </label>
      )}

      {name && <input type="hidden" name={name} value={value ?? ''} />}

      <button
        type="button"
        id={triggerId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel ?? label}
        aria-invalid={Boolean(error)}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            moveActive(event.key === 'ArrowDown' ? 1 : -1);
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            const option = options[activeIndex];
            if (option && !option.disabled) commit(option.value);
          }
          if (event.key === 'Home' && open) {
            event.preventDefault();
            const enabledIndexes = getEnabledIndexes();
            if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
          }
          if (event.key === 'End' && open) {
            event.preventDefault();
            const enabledIndexes = getEnabledIndexes();
            const last = enabledIndexes[enabledIndexes.length - 1];
            if (last !== undefined) setActiveIndex(last);
          }
        }}
        className={`inline-flex items-center justify-between gap-2 rounded-[8px] border bg-white dark:bg-slate-900 text-left font-medium text-[#0F172A] transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] ${sizeClasses[size]} ${borderStyle} ${fullWidth ? 'w-full' : 'min-w-[9.5rem]'} ${buttonClassName}`}
      >
        <span className={`truncate ${selected ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className={`absolute top-full z-50 mt-1.5 max-h-64 min-w-full overflow-auto rounded-[12px] border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-xl ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                data-index={index}
                className={`flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-[13px] ${
                  option.disabled
                    ? 'cursor-not-allowed text-[#94A3B8]'
                    : 'cursor-pointer text-[#0F172A]'
                } ${isActive && !option.disabled ? 'bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB]' : ''} ${
                  isSelected && !isActive ? 'bg-[#F8FAFC] dark:bg-slate-800' : ''
                } ${!option.disabled && !isActive ? 'hover:bg-[#F8FAFC] dark:hover:bg-slate-800' : ''}`}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!option.disabled) commit(option.value);
                }}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mt-1.5 text-[12px] text-[#DC2626]">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-[12px] text-[#64748B]">{helperText}</p>}
    </div>
  );
}

