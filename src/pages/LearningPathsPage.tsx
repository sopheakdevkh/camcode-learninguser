import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Clock, Layers, Map } from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Course } from '@/types';

export const LearningPathsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { user, getPathCompletion, enrollLearningPath } = useLearner();
  const paths = catalogService.getLearningPaths();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#0F172A] tracking-tight">
          {t.nav.learningPaths}
        </h1>
        <p className="text-[14.5px] text-[#475569] mt-1">
          Step-by-step career tracks combining curated courses into job-ready certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {paths.map((path) => {
          const stats = getPathCompletion(path.courseIds);
          const isEnrolled = user.enrolledPathIds.includes(path.id);
          return (
            <div
              key={path.id}
              className="glass-card glass-card-interactive rounded-[18px] overflow-hidden flex flex-col"
            >
              <div
                className={`p-5 bg-gradient-to-br ${path.thumbnailTheme} border-b border-white/70 dark:border-slate-700 space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="primary">
                    <Map className="h-3.5 w-3.5" />
                    {stats.total} Courses
                  </Badge>
                  <Badge tone={isEnrolled ? 'success' : 'neutral'}>
                    {isEnrolled ? 'Enrolled' : path.level}
                  </Badge>
                </div>
                <h2 className="text-[19px] font-bold text-[#0F172A] leading-snug">
                  {pickText(path.title)}
                </h2>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <p className="text-[13.5px] text-[#475569] leading-relaxed">
                    {pickText(path.subtitle)}
                  </p>

                  <div className="flex items-center gap-4 text-[12.5px] text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#94A3B8]" />
                      {path.estimatedHours} {t.common.hours}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#2563EB] font-medium">
                      <Award className="h-4 w-4" />
                      {pickText(path.badgeName)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#64748B]">Track progress</span>
                      <span className="font-mono-custom font-bold text-[#2563EB]">
                        {stats.completed}/{stats.total} ({stats.percent}%)
                      </span>
                    </div>
                    <ProgressBar value={stats.percent} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {!isEnrolled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => enrollLearningPath(path.id)}
                    >
                      Enroll Track
                    </Button>
                  )}
                  <Link to={`/learning-paths/${path.slug}`} className="flex-1">
                    <Button
                      size="sm"
                      fullWidth
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {isEnrolled ? 'Open Track' : 'View Path'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LearningPathDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, pickText } = useI18n();
  const { user, getPathCompletion, getCourseCompletion, enrollLearningPath } = useLearner();

  const path = slug ? catalogService.getLearningPathBySlug(slug) : undefined;
  if (!path) {
    return (
      <div className="glass-card rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#0F172A]">Learning path not found</h2>
        <Link to="/learning-paths">
          <Button>{t.nav.learningPaths}</Button>
        </Link>
      </div>
    );
  }

  const courses = path.courseIds
    .map((id) => catalogService.getCourseById(id))
    .filter((c): c is Course => Boolean(c));
  const stats = getPathCompletion(path.courseIds);
  const isEnrolled = user.enrolledPathIds.includes(path.id);

  return (
    <div className="space-y-6">
      <Link
        to="/learning-paths"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#64748B] hover:text-[#2563EB]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {t.nav.learningPaths}</span>
      </Link>

      <section className="glass-panel rounded-[20px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge tone="primary">
              <Layers className="h-3.5 w-3.5" />
              {courses.length} Courses · {path.estimatedHours}h
            </Badge>
            <Badge tone="success">
              <Award className="h-3.5 w-3.5" />
              {pickText(path.badgeName)}
            </Badge>
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0F172A]">
            {pickText(path.title)}
          </h1>
          <p className="text-[15px] text-[#475569]">{pickText(path.description)}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {path.outcomes.map((o, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[13px] text-[#334155] bg-white/80 dark:bg-slate-900 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-slate-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                {pickText(o)}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-72 rounded-[16px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 p-5 space-y-3 shrink-0">
          <div className="flex justify-between text-[13px]">
            <span className="font-medium text-[#64748B]">Overall Completion</span>
            <span className="font-mono-custom font-bold text-[#2563EB]">{stats.percent}%</span>
          </div>
          <ProgressBar value={stats.percent} heightClass="h-2.5" />
          <p className="text-[12px] text-[#64748B]">
            {stats.completed} of {stats.total} courses completed
          </p>
          {!isEnrolled && (
            <Button fullWidth onClick={() => enrollLearningPath(path.id)}>
              Enroll in Learning Path
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[19px] font-bold text-[#0F172A]">Ordered Path Curriculum</h2>
        <div className="space-y-4">
          {courses.map((course, idx) => {
            const cStats = getCourseCompletion(course);
            return (
              <div key={course.id} className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="md:w-14 flex md:flex-col items-center justify-center gap-2 shrink-0">
                  <span
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-[14px] ${
                      cStats.status === 'completed'
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-[#EFF6FF] dark:bg-blue-950 text-[#2563EB] border border-[#BFDBFE] dark:border-blue-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <CourseCard course={course} variant="enrolled" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

