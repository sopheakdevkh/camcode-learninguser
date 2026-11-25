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

  return (
    <div className="group glass-card glass-card-interactive flex flex-col rounded-[16px] overflow-hidden">
      <Link to={`/courses/${course.slug}`} className="block p-3.5 pb-0">
        <div
          className={`relative h-40 w-full rounded-[12px] bg-gradient-to-br ${course.thumbnailTheme} border border-white/80 dark:border-slate-700/60 overflow-hidden p-3 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-[11px] font-semibold text-[#0F172A] dark:text-slate-100 shadow-xs truncate max-w-[160px]">
              {category ? pickText(category.name) : course.thumbnailLabel}
            </span>
            <div className="flex items-center gap-1.5">
              {renderStatusBadge()}
              <button
                type="button"
                onClick={handleBookmark}
                aria-label={isSaved ? 'Remove from watchlist' : 'Save course'}
                className="p-1.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-700 text-[#475569] hover:text-[#2563EB] cursor-pointer"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-[#2563EB]" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center my-auto">
            <div className="group-hover:scale-105 transition-transform">
              <CategoryIconBox categorySlug={course.categorySlug} />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#475569] dark:text-slate-200">
            <span className="px-2 py-0.5 rounded bg-white/85 dark:bg-slate-900/85">
              {course.difficulty === 'beginner'
                ? t.common.beginner
                : course.difficulty === 'intermediate'
                  ? t.common.intermediate
                  : t.common.advanced}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/85 dark:bg-slate-900/85">
              <Star className="h-3 w-3 fill-[#D97706] text-[#D97706]" />
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-[12px] text-[#64748B]">
            <span className="truncate">{instructor?.name}</span>
            {course.certificateIncluded && (
              <span className="inline-flex items-center gap-1 text-[#2563EB] font-medium shrink-0">
                <Award className="h-3.5 w-3.5" />
                {t.common.certificate}
              </span>
            )}
          </div>

          <Link to={`/courses/${course.slug}`} className="block">
            <h3 className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {pickText(course.title)}
            </h3>
          </Link>

          <p className="text-[13px] text-[#64748B] line-clamp-2 leading-relaxed">
            {pickText(course.subtitle)}
          </p>

          {variant === 'enrolled' ? (
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#0F172A]">
                  {completion.completedCount}/{completion.totalCount} {t.myCourses.completedLessons}
                </span>
                <span className="font-mono-custom font-semibold text-[#2563EB]">
                  {completion.percent}%
                </span>
              </div>
              <ProgressBar value={completion.percent} />
              {progress?.lastAccessedAt && (
                <p className="text-[11px] text-[#64748B]">
                  {t.myCourses.lastAccessed}: {progress.lastAccessedAt}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 pt-1 text-[12px] text-[#64748B]">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                {formatNumber(course.durationHours)} {t.common.hours}
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-[#94A3B8]" />
                {formatNumber(completion.totalCount)} {t.common.lessons}
              </span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between gap-3">
          {variant === 'enrolled' ? (
            <Link
              to={`/courses/${course.slug}`}
              className="text-[12px] font-medium text-[#64748B] hover:text-[#2563EB]"
            >
              {t.workspace.backToCourse}
            </Link>
          ) : (
            <div>
              {course.price === 0 ? (
                <span className="text-[17px] font-bold text-[#16A34A]">{t.common.free}</span>
              ) : accessState === 'purchased' || accessState === 'subscription' ? (
                <span className="text-[13px] font-semibold text-[#16A34A]">
                  {accessState === 'purchased' ? t.common.purchased : t.common.included}
                </span>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[17px] font-bold text-[#0F172A]">
                    ${course.price.toFixed(0)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-[12px] text-[#94A3B8] line-through">
                      ${course.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <Link
            to={
              variant === 'enrolled' || accessState === 'purchased' || accessState === 'free_enrolled' || accessState === 'subscription'
                ? `/learn/${course.slug}`
                : `/courses/${course.slug}`
            }
            onClick={handlePrimaryClick}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[8px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium transition-colors shrink-0"
          >
            {variant === 'enrolled' ? (
              <Play className="h-3.5 w-3.5 fill-current" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
            <span>{getCtaLabel()}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

