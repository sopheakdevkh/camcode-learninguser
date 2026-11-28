import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-2xl',
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141312]/55 backdrop-blur-[4px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClass} bg-[#f6f3ec] dark:bg-[#151A17] rounded-[20px] border border-[#ded8ca] dark:border-[#2A332E] shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ded8ca] dark:border-[#2A332E]">
          <h3 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full border border-[#ded8ca] dark:border-[#2A332E] text-[#6e6a62] hover:text-[#141312] hover:border-[#1c5b48] dark:hover:text-[#f6f3ec] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 max-h-[82vh] overflow-y-auto thin-scrollbar">{children}</div>
      </div>
    </div>
  );
};
