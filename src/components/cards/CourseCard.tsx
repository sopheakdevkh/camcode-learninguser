import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Clock,
  FileText,
  Play,
  Star,
} from 'lucide-react';
import { CategoryIconBox } from '@/components/academy/CourseThumbnail';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  variant?: 'explore' | 'enrolled';
  onAction?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = 'explore',
  onAction,
}) => {
  const { pickText, t, formatNumber } = useI18n();
  const {
    user,
    courseProgress,
    getCourseAccessState,
    getCourseCompletion,
    enrollFreeCourse,
    toggleSavedCourse,
  } = useLearner();
  const navigate = useNavigate();

  const instructor = catalogService.getInstructorById(course.instructorId);
  const category = catalogService.getCategoryBySlug(course.categorySlug);
  const accessState = getCourseAccessState(course);
  const completion = getCourseCompletion(course);
  const progress = courseProgress[course.id];
  const isSaved = user.savedCourseIds.includes(course.id);

  const renderStatusBadge = () => {
    if (accessState === 'purchased') return <Badge tone="success">{t.common.purchased}</Badge>;
    if (accessState === 'free_enrolled') return <Badge tone="info">{t.common.enrolled}</Badge>;
    if (accessState === 'subscription') return <Badge tone="primary">{t.common.included}</Badge>;
    if (course.price === 0) return <Badge tone="success">{t.common.free}</Badge>;
    return <Badge tone="warning">{t.common.premium}</Badge>;
  };

  const getCtaLabel = () => {
    if (variant === 'enrolled') {
      if (completion.status === 'completed') return t.myCourses.reviewBtn;
      if (completion.status === 'in_progress') return t.myCourses.continueBtn;
      return t.myCourses.startBtn;
    }
    if (accessState === 'purchased' || accessState === 'free_enrolled' || accessState === 'subscription') {
      return completion.percent > 0 ? t.explore.ctaContinue : t.explore.ctaStart;
    }
    if (accessState === 'free_available') return t.explore.ctaEnrollFree;
    return t.explore.ctaBuy;
  };

  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (onAction) {
      e.preventDefault();
      e.stopPropagation();
      onAction(course);
      return;
    }
    if (
      variant === 'enrolled' ||
      accessState === 'purchased' ||
      accessState === 'free_enrolled' ||
      accessState === 'subscription'
    ) {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/learn/${course.slug}`);
      return;
    }
    if (accessState === 'free_available') {
      e.preventDefault();
      e.stopPropagation();
      enrollFreeCourse(course.id);
      navigate(`/learn/${course.slug}`);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedCourse(course.id);
  };

  const difficultyLabel =
    course.difficulty === 'beginner'
      ? t.common.beginner
      : course.difficulty === 'intermediate'
        ? t.common.intermediate
        : t.common.advanced;

  return (
    <article className="card-note group flex flex-col justify-between p-5">
      <div>
        {/* Inset Blueprint Frame */}
        <Link to={`/courses/${course.slug}`} className="block">
          <div className="relative h-38 w-full rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] swiss-blueprint-bg overflow-hidden p-3 flex flex-col justify-between transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tech inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[10px] font-medium uppercase tracking-[0.06em] text-[#141312] dark:text-[#f6f3ec] truncate max-w-[155px] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6]">
                <span className="swiss-dot" aria-hidden="true" />
                <span className="truncate">{category ? pickText(category.name) : course.thumbnailLabel}</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {renderStatusBadge()}
                <button
                  type="button"
                  onClick={handleBookmark}
                  aria-label={isSaved ? 'Remove from watchlist' : 'Save course'}
                  className="p-1.5 rounded-full bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#6e6a62] hover:text-[#1c5b48] hover:border-[#1c5b48] cursor-pointer transition-colors"
                >
                  {isSaved ? (
                    <BookmarkCheck className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center my-auto">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <CategoryIconBox categorySlug={course.categorySlug} />
              </div>
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.08em] text-[#6e6a62] dark:text-[#A3ACA6]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#efebe1]/95 dark:bg-[#151A17]/95 border border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6]">
                {difficultyLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#efebe1]/95 dark:bg-[#151A17]/95 border border-[#ded8ca] dark:border-[#2A332E] tabular-nums transition-colors duration-[0.22s] group-hover:border-[#B9B3A6]">
                <Star className="h-3 w-3 fill-[#1c5b48] text-[#1c5b48] dark:fill-[#7CD4B5] dark:text-[#7CD4B5]" />
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </Link>

        {/* Card Header Row & Meta */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <Link to={`/courses/${course.slug}`} className="block min-w-0 flex-1">
            <h3 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] transition-colors line-clamp-2 leading-snug">
              {pickText(course.title)}
            </h3>
          </Link>
          <span aria-hidden="true" className="index-number mt-1 shrink-0">
            {String(completion.totalCount).padStart(2, '0')}L
          </span>
        </div>

        <p className="mt-2 text-[13.5px] text-[#6e6a62] dark:text-[#A3ACA6] line-clamp-2 leading-relaxed">
          {pickText(course.subtitle)}
        </p>

        {variant === 'enrolled' ? (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-[#141312] dark:text-[#f6f3ec]">
                {completion.completedCount}/{completion.totalCount} {t.myCourses.completedLessons}
              </span>
              <span className="font-mono-custom font-semibold text-[#1c5b48] dark:text-[#7CD4B5]">
                {completion.percent}%
              </span>
            </div>
            <ProgressBar value={completion.percent} />
            {progress?.lastAccessedAt && (
              <p className="text-[11px] font-mono-custom text-[#6e6a62]">
                {t.myCourses.lastAccessed}: {progress.lastAccessedAt}
              </p>
            )}
          </div>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            <li>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                <Clock className="h-3 w-3 opacity-75" />
                {formatNumber(course.durationHours)} {t.common.hours}
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                <FileText className="h-3 w-3 opacity-75" />
                {formatNumber(completion.totalCount)} {t.common.lessons}
              </span>
            </li>
            {instructor && (
              <li>
                <span className="inline-flex items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                  {instructor.name}
                </span>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45] flex items-center justify-between gap-3">
        {variant === 'enrolled' ? (
          <Link
            to={`/courses/${course.slug}`}
            className="t-method hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] truncate"
          >
            {t.workspace.backToCourse}
          </Link>
        ) : (
          <div className="flex items-baseline gap-1.5">
            {course.price === 0 ? (
              <span className="font-serif-display text-[20px] font-medium text-[#1c5b48] dark:text-[#7CD4B5]">
                {t.common.free}
              </span>
            ) : accessState === 'purchased' || accessState === 'subscription' ? (
              <span className="text-[12.5px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5]">
                {accessState === 'purchased' ? t.common.purchased : t.common.included}
              </span>
            ) : (
              <>
                <span className="font-serif-display text-[20px] font-medium tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                  ${course.price.toFixed(0)}
                </span>
                {course.originalPrice && (
                  <span className="text-[12px] text-[#6e6a62] line-through tabular-nums">
                    ${course.originalPrice.toFixed(0)}
                  </span>
                )}
              </>
            )}
            {course.certificateIncluded && (
              <Award className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5] ml-1" />
            )}
          </div>
        )}

        <Link
          to={
            variant === 'enrolled' ||
            accessState === 'purchased' ||
            accessState === 'free_enrolled' ||
            accessState === 'subscription'
              ? `/learn/${course.slug}`
              : `/courses/${course.slug}`
          }
          onClick={handlePrimaryClick}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#1c5b48] hover:bg-[#15463a] dark:bg-[#2D7A62] dark:hover:bg-[#23634F] text-white text-[12.5px] font-semibold whitespace-nowrap transition-colors shrink-0"
        >
          {variant === 'enrolled' ? (
            <Play className="h-3 w-3 fill-current" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
          <span>{getCtaLabel()}</span>
        </Link>
      </div>
    </article>
  );
};
