import React from 'react';
import { BarChart3, BookOpen, Briefcase, Code2, Film, Megaphone, Palette } from 'lucide-react';

export const categoryIcons: Record<string, React.ReactNode> = {
  'digital-marketing': <Megaphone className="h-8 w-8 text-[#2563EB]" />,
  'software-engineering': <Code2 className="h-8 w-8 text-[#0891B2]" />,
  'ui-ux-design': <Palette className="h-8 w-8 text-[#16A34A]" />,
  'business-finance': <Briefcase className="h-8 w-8 text-[#D97706]" />,
  'data-ai': <BarChart3 className="h-8 w-8 text-[#2563EB]" />,
  'creative-video': <Film className="h-8 w-8 text-[#DC2626]" />,
};

export const CategoryIconBox: React.FC<{ categorySlug: string; size?: 'sm' | 'md' | 'lg' }> = ({
  categorySlug,
  size = 'md',
}) => {
  const dims = size === 'sm' ? 'h-10 w-10 rounded-xl' : size === 'lg' ? 'h-16 w-16 rounded-2xl' : 'h-13 w-13 rounded-xl';
  return (
    <div
      className={`${dims} bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/90 dark:border-slate-700 flex items-center justify-center shadow-sm`}
    >
      {categoryIcons[categorySlug] ?? <BookOpen className="h-7 w-7 text-[#2563EB]" />}
    </div>
  );
};

