import React, { useMemo, useState } from 'react';
import { BookOpen, Search, SlidersHorizontal, X } from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { AccessFilterOption, CourseSortOption, DifficultyLevel } from '@/types';

const PAGE_STEP = 6;

export const ExploreCoursesPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { getCourseAccessState } = useLearner();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('');
  const [accessFilter, setAccessFilter] = useState<AccessFilterOption>('all');
  const [sortBy, setSortBy] = useState<CourseSortOption>('recommended');
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  const categories = catalogService.getCategories();
  const allCourses = catalogService.getAllCourses();

  const filtered = useMemo(() => {
    let list = [...allCourses];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => {
        const inst = catalogService.getInstructorById(c.instructorId);
        return (
          pickText(c.title).toLowerCase().includes(q) ||
          pickText(c.subtitle).toLowerCase().includes(q) ||
          (inst?.name.toLowerCase().includes(q) ?? false)
        );
      });
    }

    if (selectedCategory) {
      list = list.filter((c) => c.categorySlug === selectedCategory);
    }

    if (difficulty) {
      list = list.filter((c) => c.difficulty === difficulty);
    }

    if (accessFilter !== 'all') {
      list = list.filter((c) => {
        const st = getCourseAccessState(c);
        if (accessFilter === 'free') return c.price === 0;
        if (accessFilter === 'premium') return c.price > 0;
        if (accessFilter === 'purchased') return st === 'purchased' || st === 'free_enrolled' || st === 'subscription';
        return true;
      });
    }

    switch (sortBy) {
      case 'popular':
        list.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'newest':
        list.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
        break;
      case 'highest_rated':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'recommended':
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
        break;
    }

    return list;
  }, [allCourses, query, selectedCategory, difficulty, accessFilter, sortBy, pickText, getCourseAccessState]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const resetAll = () => {
    setQuery('');
    setSelectedCategory('');
    setDifficulty('');
    setAccessFilter('all');
    setSortBy('recommended');
    setVisibleCount(PAGE_STEP);
  };

  const hasActiveFilters = Boolean(query || selectedCategory || difficulty || accessFilter !== 'all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {t.explore.title}
          </h1>
          <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">{t.explore.subtitle}</p>
        </div>
        <span className="text-[13px] font-medium text-[#6e6a62] dark:text-[#A3ACA6]">
          {filtered.length} {t.explore.resultsCount}
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('')}
          className={`px-3.5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === ''
              ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
              : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#4c4842] dark:text-[#D5D1C8] hover:border-[#1c5b48] dark:border-[#7CD4B5]'
          }`}
        >
          {t.explore.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.slug
                ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#4c4842] dark:text-[#D5D1C8] hover:border-[#1c5b48] dark:border-[#7CD4B5]'
            }`}
          >
            {pickText(cat.name)}
          </button>
        ))}
      </div>

      {/* Search + Filter Toolbar */}
      <div className="card-note rounded-[16px] p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5 flex items-center h-10 px-3 rounded-[9px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] focus-within:border-[#1c5b48] dark:border-[#7CD4B5]">
          <Search className="h-4 w-4 text-[#6e6a62] mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.explore.searchPlaceholder}
            className="w-full bg-transparent text-[13.5px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#6e6a62] hover:text-[#4c4842] dark:text-[#D5D1C8] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="md:col-span-2">
          <Dropdown<DifficultyLevel | ''>
            fullWidth
            value={difficulty}
            onChange={setDifficulty}
            aria-label={t.explore.allLevels}
            options={[
              { value: '', label: t.explore.allLevels },
              { value: 'beginner', label: t.common.beginner },
              { value: 'intermediate', label: t.common.intermediate },
              { value: 'advanced', label: t.common.advanced },
            ]}
          />
        </div>

        <div className="md:col-span-2">
          <Dropdown<AccessFilterOption>
            fullWidth
            value={accessFilter}
            onChange={setAccessFilter}
            aria-label={t.explore.allAccess}
            options={[
              { value: 'all', label: t.explore.allAccess },
              { value: 'free', label: t.explore.filterFree },
              { value: 'premium', label: t.explore.filterPremium },
              { value: 'purchased', label: t.explore.filterPurchased },
            ]}
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#6e6a62] dark:text-[#A3ACA6] shrink-0 hidden sm:block" />
          <Dropdown<CourseSortOption>
            fullWidth
            value={sortBy}
            onChange={setSortBy}
            aria-label={t.explore.sortBy}
            align="end"
            options={[
              { value: 'recommended', label: t.explore.sortRecommended },
              { value: 'popular', label: t.explore.sortPopular },
              { value: 'newest', label: t.explore.sortNewest },
              { value: 'highest_rated', label: t.explore.sortHighestRated },
              { value: 'price_asc', label: t.explore.sortPriceAsc },
              { value: 'price_desc', label: t.explore.sortPriceDesc },
            ]}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={resetAll}
            className="text-[13px] font-medium text-[#1c5b48] dark:text-[#7CD4B5] hover:underline cursor-pointer"
          >
            {t.common.resetFilters}
          </button>
        </div>
      )}

      {/* Course Grid */}
      {displayed.length === 0 ? (
        <div className="card-note rounded-[18px] p-10 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-[#6e6a62] mx-auto" />
          <h3 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">{t.explore.emptyTitle}</h3>
          <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">{t.explore.emptySubtitle}</p>
          <Button variant="outline" onClick={resetAll}>
            {t.common.resetFilters}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayed.map((course) => (
              <CourseCard key={course.id} course={course} variant="explore" />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_STEP)}>
                {t.common.loadMore}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

