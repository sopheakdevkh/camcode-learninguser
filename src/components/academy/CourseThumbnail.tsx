import React from 'react';
import { BarChart3, BookOpen, Briefcase, Code2, Film, Megaphone, Palette } from 'lucide-react';

export const categoryIcons: Record<string, React.ReactNode> = {
  'digital-marketing': <Megaphone className="h-5 w-5" />,
  'software-engineering': <Code2 className="h-5 w-5" />,
  'ui-ux-design': <Palette className="h-5 w-5" />,
  'business-finance': <Briefcase className="h-5 w-5" />,
  'data-ai': <BarChart3 className="h-5 w-5" />,
  'creative-video': <Film className="h-5 w-5" />,
};

export const CategoryIconBox: React.FC<{ categorySlug: string; size?: 'sm' | 'md' | 'lg' }> = ({
  categorySlug,
  size = 'md',
}) => {
  const dims =
    size === 'sm'
      ? '!w-10 !h-10 !rounded-xl'
      : size === 'lg'
        ? '!w-14 !h-14 !rounded-2xl'
        : '!w-12 !h-12 !rounded-xl';
  return (
    <div className={`icon-box border border-[#ded8ca] dark:border-[#2A332E] ${dims}`}>
      {categoryIcons[categorySlug] ?? <BookOpen className="h-5 w-5" />}
    </div>
  );
};
